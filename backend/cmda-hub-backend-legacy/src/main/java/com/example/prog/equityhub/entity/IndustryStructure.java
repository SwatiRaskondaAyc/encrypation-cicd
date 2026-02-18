package com.example.prog.equityhub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable
@Table(name = "IndustryStructure", schema = "dbo")
public class IndustryStructure {
    @Id
    @Column(name = "Basic_Ind_Code")
    private String basicIndCode; // Primary key

    @Column(name = "MES_Code")
    private String mesCode;
    
    @Column(name = "Macro_Economic_Sector")
    private String macroEconomicSector;
    
    @Column(name = "Sect_Code")
    private String sectCode;
    
    @Column(name = "Sector")
    private String sector;
    
    @Column(name = "Ind_Code")
    private String indCode;
    
    @Column(name = "Industry")
    private String industry;
    
    @Column(name = "Basic_Industry")
    private String basicIndustry;
    
    @Column(name = "Definition")
    private String definition;

    // Getters and setters
    public String getMesCode() {
        return mesCode;
    }

    public void setMesCode(String mesCode) {
        this.mesCode = mesCode;
    }

    public String getMacroEconomicSector() {
        return macroEconomicSector;
    }

    public void setMacroEconomicSector(String macroEconomicSector) {
        this.macroEconomicSector = macroEconomicSector;
    }

    public String getSectCode() {
        return sectCode;
    }

    public void setSectCode(String sectCode) {
        this.sectCode = sectCode;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getIndCode() {
        return indCode;
    }

    public void setIndCode(String indCode) {
        this.indCode = indCode;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getBasicIndCode() {
        return basicIndCode;
    }

    public void setBasicIndCode(String basicIndCode) {
        this.basicIndCode = basicIndCode;
    }

    public String getBasicIndustry() {
        return basicIndustry;
    }

    public void setBasicIndustry(String basicIndustry) {
        this.basicIndustry = basicIndustry;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }
}

