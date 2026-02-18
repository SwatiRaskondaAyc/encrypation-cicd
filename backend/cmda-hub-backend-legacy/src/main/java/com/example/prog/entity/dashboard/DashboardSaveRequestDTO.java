//package com.example.prog.entity.dashboard;
//
//
//
//import java.util.List;
//
//public class DashboardSaveRequestDTO {
//    private DashboardMaster dashboard;
//    private List<EquityHubPlotDTO> equityHubPlots;
//    private List<PortfolioPlotDTO> portfolioPlots;
//
//    // Getters and Setters
//    public DashboardMaster getDashboard() { return dashboard; }
//    public void setDashboard(DashboardMaster dashboard) { this.dashboard = dashboard; }
//    public List<EquityHubPlotDTO> getEquityHubPlots() { return equityHubPlots; }
//    public void setEquityHubPlots(List<EquityHubPlotDTO> equityHubPlots) { this.equityHubPlots = equityHubPlots; }
//    public List<PortfolioPlotDTO> getPortfolioPlots() { return portfolioPlots; }
//    public void setPortfolioPlots(List<PortfolioPlotDTO> portfolioPlots) { this.portfolioPlots = portfolioPlots; }
//}
//




package com.example.prog.entity.dashboard;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Base64;
import java.util.List;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class DashboardSaveRequestDTO {

    @NotNull(message = "Dashboard is required")
    private DashboardMaster dashboard;

    private List<EquityHubPlotDTO> equityHubPlots;
    private List<PortfolioPlotDTO> portfolioPlots;

    @Size(max = 10, message = "Cannot upload more than 10 screenshots")
    private List<Screenshot> screenshots;

    // Getters and Setters
    public DashboardMaster getDashboard() {
        return dashboard;
    }

    public void setDashboard(DashboardMaster dashboard) {
        this.dashboard = dashboard;
    }

    public List<EquityHubPlotDTO> getEquityHubPlots() {
        return equityHubPlots;
    }

    public void setEquityHubPlots(List<EquityHubPlotDTO> equityHubPlots) {
        this.equityHubPlots = equityHubPlots;
    }

    public List<PortfolioPlotDTO> getPortfolioPlots() {
        return portfolioPlots;
    }

    public void setPortfolioPlots(List<PortfolioPlotDTO> portfolioPlots) {
        this.portfolioPlots = portfolioPlots;
    }

    public List<Screenshot> getScreenshots() {
        return screenshots;
    }

    public void setScreenshots(List<Screenshot> screenshots) {
        this.screenshots = screenshots;
    }

    public static class Screenshot {
        @NotBlank(message = "Screenshot type is required")
        private String type;

        private int index;

        @Size(max = 10485760, message = "Screenshot size must not exceed 10MB")
        @ValidBase64
        private String screenshot;

        // Getters and setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }

        public String getScreenshot() {
            return screenshot;
        }

        public void setScreenshot(String screenshot) {
            this.screenshot = screenshot;
        }
    }

    @Constraint(validatedBy = {ValidBase64Validator.class})
    @Target({ElementType.FIELD})
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ValidBase64 {
        String message() default "Invalid base64 string";
        Class<?>[] groups() default {};
        Class<? extends Payload>[] payload() default {};
    }

    public static class ValidBase64Validator implements ConstraintValidator<ValidBase64, String> {
        @Override
        public boolean isValid(String value, ConstraintValidatorContext context) {
            if (value == null) {
                return true;
            }
            try {
                String cleanValue = value.replaceFirst("^data:image/[^;]+;base64,", "");
                Base64.getDecoder().decode(cleanValue);
                return true;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
    }
}