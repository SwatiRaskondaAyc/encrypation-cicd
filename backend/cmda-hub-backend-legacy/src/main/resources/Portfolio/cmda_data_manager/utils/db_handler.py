# import pyodbc
#
# class DBHandler:
#
#     @staticmethod
#     def get_connection():
#         connection_string = (
#             'Driver={ODBC Driver 17 for SQL Server};'
#             'Server=AYCANALYTICS-DC;'
#             'Database=MktDB;'
#             'Trusted_Connection=yes;'
#         )
#
#         try:
#             # Establish a connection to the SQL Server database
#             conn = pyodbc.connect(connection_string)
#             cursor = conn.cursor()
#
#             # Execute a simple query to verify the connection
#             cursor.execute("SELECT 1")
#             result = cursor.fetchone()
#
#             if result:
#                 # print("Connection is established successfully.")
#                 return conn, cursor
#             else:
#                 # print("Connection established, but test query failed.")
#                 conn.close()  # Close the connection if the test query fails
#                 return None, None
#
#         except pyodbc.Error as e:
#             print("Error while connecting to SQL Server:", e)
#             return None, None


import pyodbc

class DBHandler:

    @staticmethod
    def get_connection():
        connection_string = (
            'Driver={ODBC Driver 17 for SQL Server};'
            'Server=AYCANALYTICS-DC;'
            'Database=MktDB;'
            'UID=shreyad;'     # <-- Use your SQL Server login username
            'PWD=Ayc@1234;'     # <-- Use your SQL Server login password
        )

        try:
            # Establish a connection to the SQL Server database
            conn = pyodbc.connect(connection_string)
            cursor = conn.cursor()

            # Execute a simple query to verify the connection
            cursor.execute("SELECT 1")
            result = cursor.fetchone()

            if result:
                return conn, cursor
            else:
                conn.close()
                return None, None

        except pyodbc.Error as e:
            print("Error while connecting to SQL Server:", e)
            return None, None
