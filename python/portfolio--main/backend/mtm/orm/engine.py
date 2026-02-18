import os
from pathlib import Path
from dotenv import load_dotenv, dotenv_values

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, scoped_session


# Get absolute path to the .env file relative to the engine.py file
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # This goes to `server/`
ENV_PATH = BASE_DIR / ".env"
_config = dotenv_values(ENV_PATH)

# print(_config)
# --- Database Credential Fetching ---
USERNAME = _config.get("USERNAME")
PASSWORD = _config.get("PASSWORD")
HOST = _config.get("HOST")
PORT = _config.get("PORT")

# --- Database Names ---
FUNDAMENTAL_DB = _config.get("CORE_DB")  # Company master/fundamentals
PRICE_DB = _config.get("FACT_DB")        # Price action/time series
# print(_config)
# --- Connection URLs ---
fundamental_url = URL.create(
    drivername="mssql+pyodbc",
    username=USERNAME, password=PASSWORD,
    host=HOST, port=PORT,
    database=FUNDAMENTAL_DB,
    query={"driver": "ODBC Driver 17 for SQL Server"}
)

price_url = URL.create(
    drivername="mssql+pyodbc",
    username=USERNAME, password=PASSWORD,
    host=HOST, port=PORT,
    database=PRICE_DB,
    query={"driver": "ODBC Driver 17 for SQL Server"}
)

# --- Engines ---
# engine_fundamentals = create_engine(fundamental_url, pool_pre_ping=True)
# engine_priceAction = create_engine(price_url, pool_pre_ping=True)


engine_fundamentals = create_engine(
    fundamental_url,
    pool_size=20,           # Max number of connections in the pool
    max_overflow=5,         # Extra connections that can be opened beyond the pool_size
    pool_timeout=30,        # Seconds to wait before giving up on getting a connection
    pool_recycle=1800,      # Recycle connections after this many seconds
    pool_pre_ping=True
)

engine_priceAction = create_engine(
    price_url,
    pool_size=20,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True
)

# --- Session Makers ---
SessionFundamentals = scoped_session(sessionmaker(bind=engine_fundamentals, autocommit=False, autoflush=False))
SessionPriceAction = scoped_session(sessionmaker(bind=engine_priceAction, autocommit=False, autoflush=False))

# --- Dependency-style session generators ---
def get_fundamental_db_session():
    """Yields a session for the fundamentals (company master) database."""
    db_session = SessionFundamentals()
    try:
        yield db_session
    finally:
        db_session.close()

def get_price_db_session():
    """Yields a session for the price action (market data) database."""
    db_session = SessionPriceAction()
    try:
        yield db_session
    finally:
        db_session.close()
