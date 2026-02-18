# accord_fundamentals.py
import warnings
from typing import Union, List, Dict, Optional
import pandas as pd
from sqlalchemy import desc, func, case
from sqlalchemy.orm import Session
from mtm.repo.query_executor import QueryExecutor
# import ORM models (adjust module path if needed in your project)
from mtm.orm.db_fundamentals.orm_models import *

class Accord:
    """
    Accord: helper to fetch company fundamentals and derived tables.
    Uses QueryExecutor and resolved FINCODEs (self._available_fincodes).
    Default return format: 'records' (dict of lists). Accepts fmt forwarded to QueryExecutor.
    """

    def __init__(self, symbols: Union[str, List[str]] = None,
                 fundamental_session: Session = None):
        """
        symbols: optional symbol or list of symbols to resolve; if None, do not resolve until needed.
        fundamental_session: optional externally-provided session (SQLAlchemy)
        """
        self.symbols = []
        if symbols:
            self.symbols = ([symbols.upper()] if isinstance(symbols, str)
                            else sorted(list(set(s.strip().upper() for s in symbols))))
        # sessions
        self._fundamental_session = fundamental_session or next(__import__("mtm.orm.engine", fromlist=["get_fundamental_db_session"]).get_fundamental_db_session())
        # internal state
        self._fincode_map: Dict[str, int] = {}
        self._available_fincodes: List[int] = []
        self._available_symbols: List[str] = []
        self._resolved = False

        if self.symbols:
            self._resolve_discrepancies()

    def _resolve_discrepancies(self):
        """
        Resolve input symbols -> primary FINCODE mapping using Company_master.
        Prioritize principal listings and populate self._fincode_map and lists.
        """
        executor = QueryExecutor(session=self._fundamental_session, mode="orm")

        # Build a series priority to ensure a primary mapping per symbol if multiple rows exist.
        # Use SQLAlchemy case to express priority but we filter to NSE in downstream methods anyway.
        series_priority = case(
            (Company_master.SERIES == 'EQ', 1),
            (Company_master.SERIES == 'BE', 2),
            (Company_master.SERIES == 'BZ', 3),
            (Company_master.SERIES == 'BL', 4),
            (Company_master.SERIES == 'SM', 5),
            (Company_master.SERIES == 'ST', 6),
            (Company_master.SERIES == 'SZ', 7),
            else_=8
        )

        rn = func.row_number().over(
            partition_by=Company_master.SYMBOL,
            order_by=series_priority
        ).label("rn")

        subq = (
            self._fundamental_session.query(
                Company_master.SYMBOL,
                Company_master.FINCODE,
                Company_master.Nse_sublisting,
                rn
            )
            .filter(Company_master.SYMBOL.in_(self.symbols))
            .subquery()
        )

        q = self._fundamental_session.query(
            subq.c.SYMBOL, subq.c.FINCODE, subq.c.Nse_sublisting
        ).filter(subq.c.rn == 1)

        res = executor.select(q, format="records")

        available_symbols = set()
        for row in res:
            sym = row.get("SYMBOL")
            fin = row.get("FINCODE")
            if fin is None:
                continue
            self._fincode_map[sym] = fin
            available_symbols.add(sym)

        self._available_fincodes = list(sorted(set(self._fincode_map.values())))
        self._available_symbols = sorted(list(available_symbols))
        self._resolved = True

        missing = sorted(set(self.symbols) - available_symbols)
        if missing:
            warnings.warn(f"Missing fundamental entries for symbols: {missing}")

    def close_sessions(self):
        try:
            if hasattr(self, "_fundamental_session") and self._fundamental_session:
                self._fundamental_session.close()
        except Exception:
            pass

    # Optional context manager helpers
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close_sessions()

    # ---------------------------
    # Methods
    # ---------------------------

    def get_company_industry_sector(self, fmt: str = "records"):
        """
        Fetches all active NSE-listed companies along with their industry and sector details.
        
        Args:
            fmt (str): Output format - "df", "records", "tuple", "colwise_dict", "gr", "gr_smart"
        
        Returns:
            Company data with FINCODE, SYMBOL, COMPNAME, industry, Sector, IndustryName
            in the requested format.
        """
        if not self._available_fincodes:
            raise ValueError("No resolved FINCODEs available for this Accord instance.")

        executor = QueryExecutor(session=self._fundamental_session, mode="orm")

        query = (
            self._fundamental_session.query(
                Company_master.FINCODE.label("FINCODE"),
                Company_master.SYMBOL.label("SYMBOL"),
                Company_master.COMPNAME.label("COMPNAME"),
                Company_master.industry.label("industry"),
                Industrymaster_Ex1.Sector.label("Sector"),
                Industrymaster_Ex1.Industry.label("IndustryName"),
            )
            .join(
                Industrymaster_Ex1, 
                Company_master.IND_CODE == Industrymaster_Ex1.Ind_code, 
                isouter=True
            )
            .join(Complistings, Complistings.FINCODE == Company_master.FINCODE)
            .join(Stockexchangemaster, Stockexchangemaster.STK_ID == Complistings.STK_ID)
            .filter(Stockexchangemaster.STK_NAME == "NSE")
            .filter(Company_master.FINCODE.in_(self._available_fincodes))
        )

        return executor.select(query, format=fmt)


    def get_company_financial_ratios(self, fmt: str = "records", consolidated: bool = False):
        """
        Fetches financial ratios for all companies, including:
        - Book Value per share (BOOKNAVPERSHARE)
        - TTM EPS (TTMEPS)
        - TTM P/E (TTMPE)
        - Shares Outstanding (No_Shs_Subscribed)
        - Market Cap (MCAP)
        - Face Value (FV)
        
        Args:
            fmt (str): Output format - "df", "records", "tuple", "colwise_dict", "gr", "gr_smart"
            consolidated (bool): If True, uses consolidated financial data
        
        Returns:
            Financial ratios data with SYMBOL, bookValue, TTM_EPS, TTM_PE, 
            sharesOutstanding, MCAP, FaceValue in the requested format.
        """
        if not self._available_fincodes:
            raise ValueError("No resolved FINCODEs available for this Accord instance.")

        executor = QueryExecutor(session=self._fundamental_session, mode="orm")

        # Select appropriate equity table
        equity_tbl = Company_equity if consolidated else Company_equity

        query = (
            self._fundamental_session.query(
                Company_master.SYMBOL.label("SYMBOL"),
                equity_tbl.BOOKNAVPERSHARE.label("bookValue"),
                equity_tbl.TTMEPS.label("TTM_EPS"),
                equity_tbl.TTMPE.label("TTM_PE"),
                equity_tbl.No_Shs_Subscribed.label("sharesOutstanding"),
                equity_tbl.MCAP.label("MCAP"),
                equity_tbl.FV.label("FaceValue"),
            )
            .join(equity_tbl, Company_master.FINCODE == equity_tbl.FINCODE)
            .filter(Company_master.FINCODE.in_(self._available_fincodes))
        )

        return executor.select(query, format=fmt)


    def get_company_financials_with_netprofit(self, n_quarters: int = 10, fmt: str = "colwise_dict", consolidated: bool = False):
        """
        Returns base financials + net_profit columns for last n_quarters.
        Dedupes (Fincode, Date_End) by UploadDT if available, else by Net_Profit desc.
        """
        if not self._available_fincodes:
            raise ValueError("No resolved FINCODEs available for this Accord instance.")

        executor = QueryExecutor(session=self._fundamental_session, mode="orm")
        equity_tbl = Company_equity if not consolidated else Company_equity
        results_tbl = Resultsf_IND_Ex1 if not consolidated else Resultsf_IND_Cons_Ex1

        # Step 1: base metrics
        eq_query = (
            self._fundamental_session.query(
                Company_master.SYMBOL.label("SYMBOL"),
                equity_tbl.BOOKNAVPERSHARE.label("bookValue"),
                equity_tbl.TTMEPS.label("EPS"),
                equity_tbl.TTMPE.label("PE"),
                equity_tbl.No_Shs_Subscribed.label("sharesOutstanding"),
                equity_tbl.MCAP.label("MCAP"),
                equity_tbl.FV.label("FaceValue"),
                Company_master.FINCODE.label("FINCODE"),
            )
            .join(equity_tbl, Company_master.FINCODE == equity_tbl.FINCODE)
            .filter(Company_master.FINCODE.in_(self._available_fincodes))
        )
        eq_records = executor.select(eq_query, format="records")
        eq_df = pd.DataFrame(eq_records) if eq_records else pd.DataFrame(columns=[
            "SYMBOL","bookValue","EPS","PE","sharesOutstanding","MCAP","FaceValue","FINCODE"
        ])

        # Step 2: dedupe (Fincode, Date_End) -> choose latest UploadDT if present, else choose max Net_Profit
        # Try to build order_by expression: prefer UploadDT desc if column exists
        upload_col = getattr(results_tbl, "UploadDT", None) or getattr(results_tbl, "UploadDate", None) or getattr(results_tbl, "UploadDatetime", None)
        if upload_col is not None:
            order_by_expression = upload_col.desc()
        else:
            # fallback to Net_Profit desc then Date_End desc
            order_by_expression = results_tbl.Net_Profit.desc()

        dedupe_rn = func.row_number().over(
            partition_by=[results_tbl.Fincode, results_tbl.Date_End],
            order_by=order_by_expression
        ).label("rn_dedupe")

        dedup_subq = (
            self._fundamental_session.query(
                results_tbl.Fincode.label("Fincode"),
                results_tbl.Date_End.label("Date_End"),
                results_tbl.Net_Profit.label("Net_Profit"),
                dedupe_rn
            )
            .filter(results_tbl.Fincode.in_(self._available_fincodes))
            .filter(results_tbl.Result_Type.in_(["Q", "QR"]))
            .subquery()
        )

        deduped = (
            self._fundamental_session.query(
                dedup_subq.c.Fincode,
                dedup_subq.c.Date_End,
                dedup_subq.c.Net_Profit
            )
            .filter(dedup_subq.c.rn_dedupe == 1)
            .subquery()
        )

        # Step 3: pick latest n_quarters per fincode
        quarter_rn = func.row_number().over(
            partition_by=deduped.c.Fincode,
            order_by=deduped.c.Date_End.desc()
        ).label("rn_quarter")

        quarter_subq = (
            self._fundamental_session.query(
                deduped.c.Fincode,
                deduped.c.Date_End,
                deduped.c.Net_Profit,
                quarter_rn
            ).subquery()
        )

        q = (
            self._fundamental_session.query(
                quarter_subq.c.Fincode,
                quarter_subq.c.Date_End,
                quarter_subq.c.Net_Profit
            )
            .filter(quarter_subq.c.rn_quarter <= n_quarters)
            .order_by(quarter_subq.c.Fincode, quarter_subq.c.Date_End.desc())
        )

        net_records = executor.select(q, format="records")
        net_df = pd.DataFrame(net_records) if net_records else pd.DataFrame(columns=["Fincode","Date_End","Net_Profit"])

        # Step 4: prepare pivot-safe values and convert to crores
        if not net_df.empty:
            net_df["Net_Profit"] = pd.to_numeric(net_df["Net_Profit"], errors="coerce")
            net_df["Net_Profit_cr"] = net_df["Net_Profit"] * 0.1
            # format Date_End -> readable column suffix
            def colfmt(d):
                s = str(int(d))
                if len(s) >= 6:
                    y = int(s[:4]); m = int(s[4:6])
                    return pd.to_datetime(f"{y}-{m:02d}-01").strftime("%b%y")
                return s
            ordered = net_df["Date_End"].drop_duplicates().sort_values(ascending=False).tolist()
            col_map = {d: f"net_profit_{colfmt(d)}_cr" for d in ordered}
            net_df["col_name"] = net_df["Date_End"].map(col_map)
            # pivot_table with aggfunc='first' to avoid duplicate-index errors
            pivot = net_df.pivot_table(index="Fincode", columns="col_name", values="Net_Profit_cr", aggfunc="first").reset_index()
        else:
            pivot = pd.DataFrame({"Fincode": []})

        # Step 5: merge and return in requested format
        merged = eq_df.merge(pivot, how="left", left_on="FINCODE", right_on="Fincode").drop(columns=["Fincode"], errors="ignore")

        if fmt == "df":
            return merged
        if fmt == "records":
            return merged.to_dict(orient="records")
        if fmt == "tuple":
            data = [tuple(merged.columns)]
            data += [tuple(row) for row in merged.values]
            return data
        # default colwise_dict
        return {col: merged[col].tolist() for col in merged.columns}


    def get_shareholding_pattern(self, fmt: str = "records"):
        """
        Fetches latest shareholding pattern summary for all companies.
        Returns the most recent shareholding data per company.
        
        Args:
            fmt (str): Output format - "df", "records", "tuple", "colwise_dict", "gr", "gr_smart"
        
        Returns:
            Shareholding pattern data with SYMBOL, DATE_END, and various shareholding 
            categories (promoter holdings, public holdings, etc.) in the requested format.
        """
        if not self._available_fincodes:
            raise ValueError("No resolved FINCODEs available for this Accord instance.")

        executor = QueryExecutor(session=self._fundamental_session, mode="orm")

        # Subquery to get the latest DATE_END for each FINCODE
        subq = (
            self._fundamental_session.query(
                Shpsummary.FINCODE.label("FINCODE"),
                func.max(Shpsummary.DATE_END).label("max_date")
            )
            .filter(Shpsummary.FINCODE.in_(self._available_fincodes))
            .group_by(Shpsummary.FINCODE)
            .subquery()
        )

        # Main query - join to get latest shareholding data
        query = (
            self._fundamental_session.query(
                Company_master.SYMBOL.label("SYMBOL"),
                Shpsummary.DATE_END.label("DATE_END"),
                # Promoter holdings - Indian
                Shpsummary.tpINDSubtotal.label("Indian_Promoter_Pct"),
                Shpsummary.nsINDSubtotal.label("Indian_Promoter_Shares"),
                # Promoter holdings - Foreign
                Shpsummary.tpFSubtotal.label("Foreign_Promoter_Pct"),
                Shpsummary.nsFSubtotal.label("Foreign_Promoter_Shares"),
                # Total promoter holdings
                Shpsummary.tpFtotalpromoter.label("Total_Promoter_Pct"),
                Shpsummary.nsFtotalpromoter.label("Total_Promoter_Shares"),
                # Public holdings - Institutions
                Shpsummary.tpINSubtotal.label("Institutional_Pct"),
                Shpsummary.nsINSubtotal.label("Institutional_Shares"),
                # Public holdings - Non-Institutions
                Shpsummary.tpNINSubtotal.label("Non_Institutional_Pct"),
                Shpsummary.nsNINSubtotal.label("Non_Institutional_Shares"),
                # Total public holdings
                Shpsummary.tpTotalpublic.label("Total_Public_Pct"),
                Shpsummary.nsTotalpublic.label("Total_Public_Shares"),
                # Grand total
                Shpsummary.nsGrandTotal.label("Total_Shares"),
            )
            .join(
                subq, 
                (Shpsummary.FINCODE == subq.c.FINCODE) & 
                (Shpsummary.DATE_END == subq.c.max_date)
            )
            .join(Company_master, Company_master.FINCODE == Shpsummary.FINCODE, isouter=True)
            .filter(Shpsummary.FINCODE.in_(self._available_fincodes))
        )

        return executor.select(query, format=fmt)