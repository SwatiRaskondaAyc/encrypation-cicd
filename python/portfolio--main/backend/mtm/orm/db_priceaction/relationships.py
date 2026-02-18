from sqlalchemy.orm import relationship
from orm.db_priceaction.orm_models import *
from sqlalchemy.orm import relationship

# ===============================
# RELATIONSHIPS FOR FACT MODEL TABLES
# ===============================

# ListedSecurities ↔ IndexSecurityMap
ListedSecurities.index_links = relationship("IndexSecurityMap", back_populates="security")
IndexSecurityMap.security = relationship("ListedSecurities", back_populates="index_links")

# ListedSecurities ↔ SeriesInfo
SeriesInfo.listed_securities = relationship("ListedSecurities", back_populates="series_info")
ListedSecurities.series_info = relationship("SeriesInfo", back_populates="listed_securities")

# ListedSecurities ↔ IndustryStructure
IndustryStructure.securities = relationship("ListedSecurities", back_populates="industry")
ListedSecurities.industry = relationship("IndustryStructure", back_populates="securities")


# ListedSecurities ↔ CompanyDescriptors
ListedSecurities.descriptors = relationship("CompanyDescriptors", back_populates="security")
CompanyDescriptors.security = relationship("ListedSecurities", back_populates="descriptors")

# ListedSecurities ↔ PEData
ListedSecurities.pe_data = relationship("PE_Data", back_populates="security")
PE_Data.security = relationship("ListedSecurities", back_populates="pe_data")

# MarketIndices ↔ ListedSecurities
market_index = relationship("MarketIndices", back_populates="components")
security = relationship("ListedSecurities", back_populates="index_links")
