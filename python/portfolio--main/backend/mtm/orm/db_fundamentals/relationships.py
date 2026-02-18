
from sqlalchemy.orm import relationship
from sqlalchemy.orm import foreign
from orm_models import *
from sqlalchemy.orm import relationship

# ===============================
# MASTER TABLE RELATIONSHIPS
# ===============================

Company_master.address = relationship("Companyaddress", back_populates="company", uselist=False)
Companyaddress.company = relationship("Company_master", back_populates="address")

Company_master.listings = relationship("Complistings", back_populates="company")
Complistings.company = relationship("Company_master", back_populates="listings")
Complistings.exchange = relationship("Stockexchangemaster", back_populates="listings")
Stockexchangemaster.listings = relationship("Complistings", back_populates="exchange")

Company_master.board = relationship("Board", back_populates="company")
Board.company = relationship("Company_master", back_populates="board")

Company_master.registrar_links = relationship("Registrardata", back_populates="company")
Registrardata.company = relationship("Company_master", back_populates="registrar_links")
Registrardata.registrar = relationship("Registrarmaster", back_populates="registrations")
Registrarmaster.registrations = relationship("Registrardata", back_populates="registrar")

Company_master.house_ref = relationship("Housemaster", primaryjoin="Company_master.house==foreign(Housemaster.HOUSE)", back_populates="companies", viewonly=True)
Housemaster.companies = relationship("Company_master", back_populates="house_ref", viewonly=True)

Company_master.industry_ref = relationship("Industrymaster_Ex1", primaryjoin="Company_master.IND_CODE==foreign(Industrymaster_Ex1.Ind_code)", back_populates="companies", viewonly=True)
Industrymaster_Ex1.companies = relationship("Company_master", back_populates="industry_ref", viewonly=True)

# ===============================
# EQUITY AND SHAREHOLDING
# ===============================

Company_master.equities = relationship("Company_equity", back_populates="company")
Company_equity.company = relationship("Company_master", back_populates="equities")

Company_master.equities_cons = relationship("Company_equity_cons", back_populates="company")
CompanyEquityCons.company = relationship("Company_master", back_populates="equities_cons")

Company_master.shp_details = relationship("Shp_details", back_populates="company")
ShpDetails.company = relationship("Company_master", back_populates="shp_details")

ShpDetails.category = relationship("Shp_catmaster_2", back_populates="details")
Shp_catmaster_2.details = relationship("Shp_details", back_populates="category")

# ===============================
# FINANCIAL RELATIONSHIPS
# ===============================

Company_master.finance_bs = relationship("Finance_bs", back_populates="company")
Finance_bs.company = relationship("Company_master", back_populates="finance_bs")

Company_master.finance_cons_bs = relationship("Finance_cons_bs", back_populates="company")
Finance_cons_bs.company = relationship("Company_master", back_populates="finance_cons_bs")

Company_master.finance_cf = relationship("Finance_cf", back_populates="company")
Finance_cf.company = relationship("Company_master", back_populates="finance_cf")

Company_master.finance_cons_cf = relationship("Finance_cons_cf", back_populates="company")
Finance_cons_cf.company = relationship("Company_master", back_populates="finance_cons_cf")

Company_master.financṇe_fr = relationship("Finance_fr", back_populates="company")
Finance_fr.company = relationship("Company_master", back_populates="finance_fr")

Company_master.finance_cons_fr = relationship("Finance_cons_fr", back_populates="company")
Finance_cons_fr.company = relationship("Company_master", back_populates="finance_cons_fr")

Company_master.finance_pl = relationship("Finance_pl", back_populates="company")
Finance_pl.company = relationship("Company_master", back_populates="finance_pl")

Company_master.finance_cons_pl = relationship("Finance_cons_pl", back_populates="company")
Finance_cons_pl.company = relationship("Company_master", back_populates="finance_cons_pl")

# ===============================
# RESULTS
# ===============================

Company_master.results_ind = relationship("Results_INDAS", back_populates="company")
Resultsf_IND_Ex1.company = relationship("Company_master", back_populates="results_ind")

Company_master.results_ind_cons = relationship("Results_cons_INDAS", back_populates="company")
Resultsf_IND_Cons_Ex1.company = relationship("Company_master", back_populates="results_ind_cons")

# ===============================
# SHARE PRICE
# ===============================

Company_master.monthly_prices = relationship("Monthly_share_price_bse", back_populates="company")
Monthlyprice.company = relationship("Company_master", back_populates="monthly_prices")

Company_master.nse_prices = relationship("Monthly_share_price_nse", back_populates="company")
Nse_Monthprice.company = relationship("Company_master", back_populates="nse_prices")


# ===============================
# DISPLAY & SUMMARY RELATIONSHIPS
# ===============================

Company_master.shp_summaries = relationship("Shpsummary", back_populates="company")
Shpsummary.company = relationship("Company_master", back_populates="shp_summaries")

# Display format tables are typically lookup/static tables used in rendering.
# These are often referenced by format or UI and don't have bi-directional joins.
# So no back_populates for: Shp_Displayformat, Finance_cf_Displayformat, Finance_fr_Displayformat, Results_IndAS_Displayformat_*


# ===============================
# FIXED EQUITY & SHAREHOLDING RELATIONSHIPS
# ===============================

Company_master.equities_cons = relationship("Company_equity_cons", back_populates="company")
CompanyEquityCons.company = relationship("Company_master", back_populates="equities_cons")

Company_master.shp_details = relationship("Shp_details", back_populates="company")
ShpDetails.company = relationship("Company_master", back_populates="shp_details")

ShpDetails.category = relationship("Shp_catmaster_2", back_populates="details")
Shp_catmaster_2.details = relationship("Shp_details", back_populates="category")

Company_master.finance_cons_bs = relationship(
    "Finance_cons_bs",
    back_populates="company",
    primaryjoin="Company_master.FINCODE == foreign(Finance_cons_bs.FINCODE)"
)

Finance_cons_bs.company = relationship(
    "Company_master",
    back_populates="finance_cons_bs",
    primaryjoin="Finance_cons_bs.FINCODE == foreign(Company_master.FINCODE)"
)