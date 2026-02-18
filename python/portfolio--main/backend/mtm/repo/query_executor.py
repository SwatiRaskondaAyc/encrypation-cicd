# ==============================================================================
# 1. query_executor.py
# ==============================================================================
import numpy as np
import pandas as pd
from sqlalchemy import text, desc
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.query import Query as ORMQuery
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

class QueryExecutor:
    """
    A unified executor for both Raw SQL and ORM queries.
    Handles session management, error handling, and flexible output formatting.
    """
    def __init__(self, engine: Engine = None, session: Session = None, mode="orm"):
        if mode not in ("raw", "orm"):
            raise ValueError("mode must be 'raw' or 'orm'")
        self.engine = engine
        self.session = session
        self.mode = mode

    def select(self, query, params=None, format="records", group_key=None, 
               replace_fincode_with_symbol=False, fincode_map=None):
        
        if format == "gr" and not group_key:
            raise ValueError("`group_key` must be provided when format is 'gr'")

        if self.mode == "raw":
            return self._run_raw_select(query, params, format, group_key)
        else:
            return self._run_orm_select(query, format, group_key, 
                                      replace_fincode_with_symbol, fincode_map)

    def execute(self, query, params=None):
        """Executes DML queries (INSERT/UPDATE/DELETE). Raw mode only."""
        if self.mode != "raw":
            raise NotImplementedError("Execute is only supported for raw queries.")
        try:
            with self.engine.begin() as conn:
                result = conn.execute(text(query), params or {})
                return {
                    "rowcount": result.rowcount,
                    "is_insert": query.strip().lower().startswith("insert"),
                    "success": result.rowcount > 0
                }
        except SQLAlchemyError as e:
            raise RuntimeError(f"Database operation failed. Reason: {e}")

    def insert_dataframe(self, df: pd.DataFrame, table_name: str, if_exists="append"):
        try:
            with self.engine.begin() as conn:
                df.to_sql(table_name, con=conn, if_exists=if_exists, index=False, method="multi")
                return {"status": "success", "message": f"{len(df)} rows inserted."}
        except Exception as e:
            raise RuntimeError(f"DataFrame insert failed for `{table_name}`. Reason: {e}")

    def _run_raw_select(self, query, params, format, group_key):
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(query), params or {})
                rows = result.fetchall()
                columns = result.keys()
                return self._format_result(rows, columns, format, group_key)
        except Exception as e:
            raise RuntimeError(f"Raw SELECT failed: {e}")

    def _run_orm_select(self, query: ORMQuery, format, group_key, replace_fincode_with_symbol, fincode_map):
        try:
            result = query.all()
            columns = self._get_columns_from_orm(query)
            return self._format_result(result, columns, format, group_key, 
                                     replace_fincode_with_symbol, fincode_map)
        finally:
            if self.session:
                self.session.close()

    def _get_columns_from_orm(self, query: ORMQuery):
        return [desc['name'] if isinstance(desc, dict) else str(desc).split('.')[-1]
                for desc in query.column_descriptions]

    def _format_result(self, result, columns, format, group_key=None, 
                       replace_fincode_with_symbol=False, fincode_map=None):
        if not result:
            if format == "records_or_template":
                return [{col: "" for col in columns}]
            return [] if format != "df" else pd.DataFrame(columns=columns)

        # --- Format: DataFrame ---
        if format == "df":
            if isinstance(result[0], tuple):
                df = pd.DataFrame(result, columns=columns)
            else:
                df = pd.DataFrame([{col: getattr(row, col) for col in columns} for row in result])
            
            if replace_fincode_with_symbol and fincode_map and "FINCODE" in df.columns:
                reverse_map = {v: k for k, v in fincode_map.items()}
                df.insert(0, "SYMBOL", df["FINCODE"].map(reverse_map))
                df.drop(columns=["FINCODE"], inplace=True)
            return df

        # --- Format: List of Dictionaries (Records) ---
        elif format in ("records", "records_or_template"):
            if isinstance(result[0], tuple):
                records = [dict(zip(columns, row)) for row in result]
            else:
                records = [{col: getattr(row, col) for col in columns} for row in result]
            
            if replace_fincode_with_symbol and fincode_map:
                reverse_map = {v: k for k, v in fincode_map.items()}
                for i, rec in enumerate(records):
                    fincode = rec.get("FINCODE")
                    if fincode in reverse_map:
                        symbol = reverse_map[fincode]
                        rec.pop("FINCODE", None)
                        records[i] = {"SYMBOL": symbol, **rec}
            return records

        # --- Format: Tuple ---
        elif format == "tuple":
            data = [tuple(columns)]
            if isinstance(result[0], tuple):
                data += result
            else:
                data += [tuple(getattr(row, col) for col in columns) for row in result]
            
            if replace_fincode_with_symbol and fincode_map:
                reverse_map = {v: k for k, v in fincode_map.items()}
                headers = list(data[0])
                if "FINCODE" in headers:
                    fin_idx = headers.index("FINCODE")
                    headers[fin_idx] = "SYMBOL"
                    updated_rows = [tuple(headers)]
                    for row in data[1:]:
                        row = list(row)
                        fincode = row[fin_idx]
                        row[fin_idx] = reverse_map.get(fincode, fincode)
                        updated_rows.append(tuple(row))
                    data = updated_rows
            return data

        # --- Format: Column-wise Dictionary ---
        elif format == "colwise_dict":
            col_data = {col: [] for col in columns}
            for row in result:
                for i, col in enumerate(columns):
                    val = row[i] if isinstance(row, tuple) else getattr(row, col)
                    col_data[col].append(val)
            
            if replace_fincode_with_symbol and fincode_map and "FINCODE" in col_data:
                reverse_map = {v: k for k, v in fincode_map.items()}
                col_data["SYMBOL"] = [reverse_map.get(fc) for fc in col_data["FINCODE"]]
                del col_data["FINCODE"]
            return col_data

        # --- Format: Grouped ---
        elif format in ("gr", "gr_smart"):
            if not group_key:
                raise ValueError("`group_key` must be provided for grouped formats.")
            if group_key not in columns:
                raise ValueError(f"group_key '{group_key}' not found in columns {columns}")

            grouped_data = {}
            for row in result:
                row_dict = row if isinstance(row, dict) else {col: getattr(row, col, None) for col in columns}
                key = row_dict[group_key]
                if key not in grouped_data:
                    grouped_data[key] = {col: [] for col in columns if col != group_key}
                for col in columns:
                    if col != group_key:
                        grouped_data[key][col].append(row_dict[col])

            if format == "gr_smart":
                for key in grouped_data:
                    for col in grouped_data[key]:
                        values = grouped_data[key][col]
                        unique_values = list(set(values))
                        grouped_data[key][col] = unique_values[0] if len(unique_values) == 1 else values

            if replace_fincode_with_symbol and fincode_map:
                reverse_map = {v: k for k, v in fincode_map.items()}
                new_grouped = {}
                for fincode, data in grouped_data.items():
                    symbol = reverse_map.get(fincode, fincode)
                    new_grouped[symbol] = data
                grouped_data = new_grouped
            
            return grouped_data
        
        else:
            raise ValueError(f"Unsupported format: {format}")

