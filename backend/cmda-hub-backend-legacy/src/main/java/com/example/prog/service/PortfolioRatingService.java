// package com.example.prog.service;

// import com.example.prog.entity.PortfolioRating;
// import com.example.prog.repository.PortfolioRatingRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// @Service
// public class PortfolioRatingService {

//     @Autowired
//     private PortfolioRatingRepository portfolioRatingRepository;

//     // Map for points per portfolio plot type (configurable)
//     private final Map<String, Integer> pointsPerPlot = Map.ofEntries(
//         Map.entry("top_ten_script", 15),
//         Map.entry("stock_deployed_amt_over_time", 15),
//         Map.entry("combined_box_plot", 15),
//         Map.entry("create_PNL_plot", 15),
//         Map.entry("create_swot_plot", 15),
//         Map.entry("create_industry_sunburst", 15),
//         Map.entry("create_user_sunburst_with_dropdown", 15),
//         Map.entry("generate_combined_bubble_chart", 15),
//         Map.entry("create_invested_amount_plot", 15),
//         Map.entry("create_best_trade_plot", 15),
//         Map.entry("classify_stocks_risk_return", 15),
//         Map.entry("plot_portfolio_eps_bv_quarterly_all_entries", 15),
//         Map.entry("get_shareholding_data", 15),
//         Map.entry("get_price_acquisition_plot", 15),
//         Map.entry("calculate_portfolio_metrics", 15),
//         Map.entry("portfolio_replacements", 15),
//         Map.entry("actual_date_replacements", 15)
//     );

//     public void submitRating(String plotType, Integer userId, String userType, Integer rating) {
//         Optional<PortfolioRating> existing = portfolioRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType);
//         PortfolioRating portfolioRating;

//         if (existing.isPresent()) {
//             // Update existing rating
//             portfolioRating = existing.get();
//             portfolioRating.setRating(rating);
//             portfolioRating.setTimestamp(LocalDateTime.now());
//             // Do not modify earned_point, keep the original value
//         } else {
//             // Create new rating
//             portfolioRating = new PortfolioRating();
//             portfolioRating.setPlotType(plotType);
//             portfolioRating.setUserId(userId);
//             portfolioRating.setUserType(userType);
//             portfolioRating.setRating(rating);
//             portfolioRating.setTimestamp(LocalDateTime.now());

//             // Award points based on plot type (default to 15 if not found)
//             Integer points = pointsPerPlot.getOrDefault(plotType, 15);
//             portfolioRating.setEarnedPoint(points);

//             // TODO: Integrate with offer points system to credit points to user
//             // e.g., offerPointService.awardPoints(userId, userType, points);
//         }

//         portfolioRatingRepository.save(portfolioRating);
//     }

//     public Double getAverage(String plotType) {
//         List<PortfolioRating> ratings = portfolioRatingRepository.findByPlotType(plotType);
//         if (ratings.isEmpty()) {
//             return 0.0;
//         }
//         return ratings.stream().mapToInt(PortfolioRating::getRating).average().orElse(0.0);
//     }

//     public Integer getUserRating(String plotType, Integer userId, String userType) {
//         return portfolioRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType)
//                 .map(PortfolioRating::getRating)
//                 .orElse(0);
//     }
// }




//--------------------earned points --------------------



package com.example.prog.service;

import com.example.prog.entity.PortfolioRating;
import com.example.prog.interceptor.PointsTrackingInterceptor;
import com.example.prog.repository.PortfolioRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PortfolioRatingService {

    @Autowired
    private PortfolioRatingRepository portfolioRatingRepository;

    // ADD THIS - Points tracking interceptor
    @Autowired
    private PointsTrackingInterceptor pointsTrackingInterceptor;

    // Map for points per portfolio plot type (configurable)
    private final Map<String, Integer> pointsPerPlot = Map.ofEntries(
        Map.entry("top_ten_script", 10),
        Map.entry("stock_deployed_amt_over_time", 10),
        Map.entry("combined_box_plot", 15),
        Map.entry("create_PNL_plot", 10),
        Map.entry("create_swot_plot", 15),
        Map.entry("create_industry_sunburst", 10),
        Map.entry("create_user_sunburst_with_dropdown", 10),
        Map.entry("generate_combined_bubble_chart", 15),
        Map.entry("create_invested_amount_plot", 10),
        Map.entry("create_best_trade_plot", 10),
        Map.entry("classify_stocks_risk_return", 15),
        Map.entry("plot_portfolio_eps_bv_quarterly_all_entries", 10),
        Map.entry("get_shareholding_data", 10),
        Map.entry("get_price_acquisition_plot", 10),
        Map.entry("calculate_portfolio_metrics", 15),
        Map.entry("portfolio_replacements", 10),
        Map.entry("actual_date_replacements", 10)
    );

    public void submitRating(String plotType, Integer userId, String userType, Integer rating) {
        Optional<PortfolioRating> existing = portfolioRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType);
        PortfolioRating portfolioRating;
        boolean isNewRating = false;
        Integer earnedPoints = 0;

        if (existing.isPresent()) {
            // Update existing rating
            portfolioRating = existing.get();
            portfolioRating.setRating(rating);
            portfolioRating.setTimestamp(LocalDateTime.now());
            // Do not modify earned_point, keep the original value
            earnedPoints = portfolioRating.getEarnedPoint(); // Use existing points
        } else {
            // Create new rating
            portfolioRating = new PortfolioRating();
            portfolioRating.setPlotType(plotType);
            portfolioRating.setUserId(userId);
            portfolioRating.setUserType(userType);
            portfolioRating.setRating(rating);
            portfolioRating.setTimestamp(LocalDateTime.now());

            // Award points based on plot type (default to 10 if not found)
            earnedPoints = pointsPerPlot.getOrDefault(plotType, 10);
            portfolioRating.setEarnedPoint(earnedPoints);

            isNewRating = true;
        }

        portfolioRatingRepository.save(portfolioRating);

        // ADD THIS - Track points in the new system (only for new ratings)
        if (isNewRating) {
            pointsTrackingInterceptor.trackPortfolioRating(
                userId.longValue(), 
                rating, 
                plotType, 
                plotType // Using plotType as portfolio name
            );
        }
    }

    public Double getAverage(String plotType) {
        List<PortfolioRating> ratings = portfolioRatingRepository.findByPlotType(plotType);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        return ratings.stream().mapToInt(PortfolioRating::getRating).average().orElse(0.0);
    }

    public Integer getUserRating(String plotType, Integer userId, String userType) {
        return portfolioRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType)
                .map(PortfolioRating::getRating)
                .orElse(0);
    }
}
