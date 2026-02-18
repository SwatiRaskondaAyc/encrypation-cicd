package com.example.prog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "investment_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String fullname;

    @Column(name = "user_investment_experience")
    private String userInvestmentExperience;

    @Column(name = "primary_investment_goal")
    private String primaryInvestmentGoal;

    @Column(name = "preferred_asset_type")
    private String preferredAssetType;

    @Column(name = "investment_activity_frequency")
    private String investmentActivityFrequency;

    @Column(name = "main_investment_challenge")
    private String mainInvestmentChallenge;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    @Column(name = "skipped", nullable = false)
    private boolean skipped = false;

    // === EXPLICIT GETTERS & SETTERS ===

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getUserInvestmentExperience() {
        return userInvestmentExperience;
    }

    public void setUserInvestmentExperience(String userInvestmentExperience) {
        this.userInvestmentExperience = userInvestmentExperience;
    }

    public String getPrimaryInvestmentGoal() {
        return primaryInvestmentGoal;
    }

    public void setPrimaryInvestmentGoal(String primaryInvestmentGoal) {
        this.primaryInvestmentGoal = primaryInvestmentGoal;
    }

    public String getPreferredAssetType() {
        return preferredAssetType;
    }

    public void setPreferredAssetType(String preferredAssetType) {
        this.preferredAssetType = preferredAssetType;
    }

    public String getInvestmentActivityFrequency() {
        return investmentActivityFrequency;
    }

    public void setInvestmentActivityFrequency(String investmentActivityFrequency) {
        this.investmentActivityFrequency = investmentActivityFrequency;
    }

    public String getMainInvestmentChallenge() {
        return mainInvestmentChallenge;
    }

    public void setMainInvestmentChallenge(String mainInvestmentChallenge) {
        this.mainInvestmentChallenge = mainInvestmentChallenge;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public boolean isSkipped() {
        return skipped;
    }

    public void setSkipped(boolean skipped) {
        this.skipped = skipped;
    }
}