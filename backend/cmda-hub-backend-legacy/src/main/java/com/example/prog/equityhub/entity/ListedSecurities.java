package com.example.prog.equityhub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

@Entity
@Immutable // Prevents Hibernate from making changes to this entity
@Table(name = "ListedSecurities", schema = "dbo") // Ensure schema is correct
public class ListedSecurities {
    @Id
    @Column(name = "Symbol")
    private String symbol; // Primary key

    @Column(name = "CompanyName")
    private String companyName;
    
    @Column(name = "Series")
    private String series;
    
    @Column(name = "ListingDate")
    private String listingDate;
    
    @Column(name = "PaidUpValue")
    private Integer paidUpValue;
    
    @Column(name = "Mkt_lot")
    private Integer mktLot;
    
    @Column(name = "ISIN")
    private String isin;
    
    @Column(name = "Face_Value")
    private Integer faceValue;
    
    @Column(name = "Basic_Ind_Code")
    private String basicIndCode;

    // Getters and setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getListingDate() {
        return listingDate;
    }

    public void setListingDate(String listingDate) {
        this.listingDate = listingDate;
    }

    public Integer getPaidUpValue() {
        return paidUpValue;
    }

    public void setPaidUpValue(Integer paidUpValue) {
        this.paidUpValue = paidUpValue;
    }

    public Integer getMktLot() {
        return mktLot;
    }

    public void setMktLot(Integer mktLot) {
        this.mktLot = mktLot;
    }

    public String getIsin() {
        return isin;
    }

    public void setIsin(String isin) {
        this.isin = isin;
    }

    public Integer getFaceValue() {
        return faceValue;
    }

    public void setFaceValue(Integer faceValue) {
        this.faceValue = faceValue;
    }

    public String getBasicIndCode() {
        return basicIndCode;
    }

    public void setBasicIndCode(String basicIndCode) {
        this.basicIndCode = basicIndCode;
    }
}

