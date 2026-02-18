import os
import pandas as pd

class Operations:

    @staticmethod
    def split_and_save_to_batch_files(df, output_dir, extension="csv", batch_size=100000):
        """
        Splits a large DataFrame into smaller files.

        Args:
            df: The DataFrame to be split.
            output_dir: The directory to save the split files.
            extension: The file extension (e.g., "csv", "xlsx"). Default is "csv".
            batch_size: The number of rows per batch.

        Returns:
            A list of paths to the saved files.
        """
        file_paths = []
        for i in range(0, len(df), batch_size):
            batch_df = df[i:i+batch_size]
            file_name = f"batch_{i//batch_size}.{extension}"
            file_path = os.path.join(output_dir, file_name)
            if extension.lower() == "csv":
                batch_df.to_csv(file_path, index=False)
            elif extension.lower() in ["xlsx", "xls"]:
                batch_df.to_excel(file_path, index=False)
            else:
                raise ValueError(f"Unsupported file extension: {extension}")
            file_paths.append(file_path)
        return file_paths


    @staticmethod
    def combine_batch_files(folder_path):
        '''Combines all files('csv' or 'excels') in a folder.'''
        combined_df = pd.DataFrame()
        failed_files = []

        for file in os.listdir(folder_path):
            file_path = os.path.join(folder_path, file)
            try:
                if file.endswith(".xlsx") or file.endswith(".xls"):
                    df = pd.read_excel(file_path)
                elif file.endswith(".csv"):
                    df = pd.read_csv(file_path)
                else:
                    continue  # Skip files with unsupported extensions

                combined_df = pd.concat([combined_df, df], ignore_index=True)

            except Exception as e:
                print(f"Error processing file {file}: {e}")
                failed_files.append(file)

        if len(failed_files) > 0:
            print(f"Failed to process the following files: {failed_files}")

        return combined_df
    
    @staticmethod
    def insert_records(df, table_name, conn):
        columns = [f"[{col}]" for col in df.columns]
        placeholders = ', '.join(['?'] * len(columns))
        records = df.values.tolist()
        insert_query = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({placeholders})"
        with conn.cursor() as cursor:
            try:
                cursor.executemany(insert_query, records)
            except Exception as e:
                print(f"Error inserting records: {e}")
                conn.rollback()
                raise
    
    
