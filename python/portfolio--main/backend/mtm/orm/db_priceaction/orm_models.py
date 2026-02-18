from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Float, Integer, Date, DateTime, ForeignKey, Boolean
from datetime import date, datetime

class FactBase(DeclarativeBase):
    pass

class HistPA(FactBase):
    __tablename__ = "EquityPA"
    __table_args__ = {"schema": "Price_Action.dbo"}
    Symbol: Mapped[str] = mapped_column(String(255), primary_key=True)
    Series: Mapped[str] = mapped_column(String(255), primary_key=True)
    Date: Mapped[date] = mapped_column(Date, primary_key=True)
    PrevClose: Mapped[float] = mapped_column(Float)
    Open: Mapped[float] = mapped_column(Float)
    High: Mapped[float] = mapped_column(Float)
    Low: Mapped[float] = mapped_column(Float)
    LastPrice: Mapped[float] = mapped_column(Float)
    Close: Mapped[float] = mapped_column(Float)
    AvgPrice: Mapped[float] = mapped_column(Float)
    TotalTradedQty: Mapped[float] = mapped_column(Float)
    TurnoverInRs: Mapped[float] = mapped_column(Float)
    TotalTrades: Mapped[float] = mapped_column(Float)
    DeliverableQty: Mapped[int] = mapped_column(Integer)
    DeliveryPct: Mapped[float] = mapped_column(Float)

class IndexPA(FactBase):
    __tablename__ = "IndexPA"
    __table_args__ = {"schema": "Price_Action.dbo"}
    Index: Mapped[str] = mapped_column(String(255), primary_key=True)
    Date: Mapped[date] = mapped_column(Date, primary_key=True)
    Open: Mapped[float] = mapped_column(Float)
    High: Mapped[float] = mapped_column(Float)
    Low: Mapped[float] = mapped_column(Float)
    Close: Mapped[float] = mapped_column(Float)

    
class IndexTypes(FactBase):
    __tablename__ = "IndexTypes"
    __table_args__ = {"schema": "Price_Action.dbo"}
    IndexCategory: Mapped[str] = mapped_column(String(255))
    IndexType: Mapped[str] = mapped_column(String(255))
    IndexTypeID: Mapped[str] = mapped_column(String(255), primary_key=True)
    Indices_source: Mapped[str] = mapped_column(String(255))

class SeriesInfo(FactBase):
    __tablename__ = "SeriesInfo"
    __table_args__ = {"schema": "Price_Action.dbo"}
    SeriesCode: Mapped[str] = mapped_column(String(255), primary_key=True)
    SecurityType: Mapped[str] = mapped_column(String(255))
    Category: Mapped[str] = mapped_column(String(255))
    Description: Mapped[str] = mapped_column(String(255))

class IndustryStructure(FactBase):
    __tablename__ = "IndustryStructure"
    __table_args__ = {"schema": "Price_Action.dbo"}
    MES_Code: Mapped[str] = mapped_column(String(255))
    Macro_Economic_Sector: Mapped[str] = mapped_column(String(255))
    Sect_Code: Mapped[str] = mapped_column(String(255))
    Sector: Mapped[str] = mapped_column(String(255))
    Ind_Code: Mapped[str] = mapped_column(String(255))
    Industry: Mapped[str] = mapped_column(String(255))
    Basic_Ind_Code: Mapped[str] = mapped_column(String(255), primary_key=True)
    Basic_Industry: Mapped[str] = mapped_column(String(255))
    Definition: Mapped[str] = mapped_column(String)

class ListedSecurities(FactBase):
    __tablename__ = "ListedSecurities"
    __table_args__ = {"schema": "Price_Action.dbo"}
    Symbol: Mapped[str] = mapped_column(String(225))
    CompanyName: Mapped[str] = mapped_column(String(225))
    Series: Mapped[str] = mapped_column(String(225), ForeignKey("SeriesInfo.SeriesCode"))
    ListingDate: Mapped[date] = mapped_column(Date)
    PaidUpValue: Mapped[float] = mapped_column(Float)
    Mkt_lot: Mapped[float] = mapped_column(Float)
    ISIN: Mapped[str] = mapped_column(String(255), primary_key=True)
    Face_Value: Mapped[float] = mapped_column(Float)
    Basic_Ind_code: Mapped[str] = mapped_column(String(255), ForeignKey("IndustryStructure.Basic_Ind_Code"))

class IndexSecurityMap(FactBase):
    __tablename__ = "IndexSecurityMap"
    __table_args__ = {"schema": "Price_Action.dbo"}
    Index: Mapped[str] = mapped_column(String(225), ForeignKey("MarketIndices.Index"), primary_key=True)
    ISIN: Mapped[str] = mapped_column(String(225), ForeignKey("ListedSecurities.ISIN"), primary_key=True)

class CompanyDescriptors(FactBase):
    __tablename__ = "Company_Descriptions"
    __table_args__ = {"schema": "Price_Action.dbo"}
    ISIN: Mapped[str] = mapped_column(String(255), ForeignKey("ListedSecurities.ISIN"), primary_key=True)
    DescriptorCategory: Mapped[str] = mapped_column(String(255), primary_key=True)
    Descriptor: Mapped[str] = mapped_column(String(255), primary_key=True)
    Value: Mapped[str] = mapped_column(String(255))

class PE_Data(FactBase):
    __tablename__ = "pe_data"
    __table_args__ = {"schema": "Price_Action.dbo"}
    Symbol: Mapped[str] = mapped_column(String(255), primary_key=True)
    trailingPE: Mapped[float] = mapped_column(Float)
    bookValue: Mapped[float] = mapped_column(Float)
    trailingEps: Mapped[float] = mapped_column(Float)
    dividendRate: Mapped[float] = mapped_column(Float)
    sharesOutstanding: Mapped[float] = mapped_column(Float)
    quickRatio: Mapped[float] = mapped_column(Float)

class Nifty50(FactBase):
    __tablename__ = "nifty_50"
    __table_args__ = {"schema": "Price_Action.dbo"}

    Date: Mapped[date] = mapped_column(Date, primary_key=True)
    Close: Mapped[float] = mapped_column(Float)
    High: Mapped[float] = mapped_column(Float)
    Low: Mapped[float] = mapped_column(Float)
    Open: Mapped[float] = mapped_column(Float)
    Volume: Mapped[float] = mapped_column(Float)
    Pct_Chng: Mapped[float] = mapped_column(Float)
    
class BseSensex(FactBase):
    __tablename__ = "bse_sensex"
    __table_args__ = {"schema": "Price_Action.dbo"}

    Date: Mapped[date] = mapped_column(Date, primary_key=True)
    Close: Mapped[float] = mapped_column(Float)
    High: Mapped[float] = mapped_column(Float)
    Low: Mapped[float] = mapped_column(Float)
    Open: Mapped[float] = mapped_column(Float)
    Volume: Mapped[float] = mapped_column(Float)
    Pct_Chng: Mapped[float] = mapped_column(Float)