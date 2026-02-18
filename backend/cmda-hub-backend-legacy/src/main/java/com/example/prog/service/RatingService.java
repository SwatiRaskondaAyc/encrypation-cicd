// package com.example.prog.service;

// import com.example.prog.entity.PlotRating;
// import com.example.prog.repository.PlotRatingRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// @Service
// public class RatingService {

//     @Autowired
//     private PlotRatingRepository plotRatingRepository;

//     // Map for points per plot type (configurable)
//     private final Map<String, Integer> pointsPerPlot = Map.ofEntries(
//             Map.entry("candle_chronicle", 15),
//             Map.entry("shareholding_summary", 10),
//             Map.entry("shareholding_overall", 10),
//             Map.entry("breach_busters", 10),
//             Map.entry("price_trend", 10),
//             Map.entry("trend_tapestry", 10),
//             Map.entry("macd", 10),
//             Map.entry("sensex_stock_fluctuations", 10),
//             Map.entry("sensex_symphony", 10),
//             Map.entry("performance_heatmap", 10),
//             Map.entry("pe_eps_book_value", 10),
//             Map.entry("box_plot", 10),
//             Map.entry("market_mood", 10),
//             Map.entry("sensex_movement_corr_calculator", 10),
//             Map.entry("compute_public_trading_activity", 10),
//             Map.entry("candle_patterns", 10),
//              Map.entry("financial_overview", 10),
//             Map.entry("balance_sheet", 10),
//             Map.entry("income_statement", 10),
//             Map.entry("cash_flow_statement", 10),
//             Map.entry("pegy", 15),
//             Map.entry("financial_ratios", 10)
            
//     );

//     public void submitRating(String plotType, Integer userId, String userType, Integer rating) {
//         Optional<PlotRating> existing = plotRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType);
//         PlotRating plotRating;

//         if (existing.isPresent()) {
//             // Update existing rating
//             plotRating = existing.get();
//             plotRating.setRating(rating);
//             plotRating.setTimestamp(LocalDateTime.now());
//             // Do not modify earned_point, keep the original value
//         } else {
//             // Create new rating
//             plotRating = new PlotRating();
//             plotRating.setPlotType(plotType);
//             plotRating.setUserId(userId);
//             plotRating.setUserType(userType);
//             plotRating.setRating(rating);
//             plotRating.setTimestamp(LocalDateTime.now());

//             // Award points based on plot type (default to 10 if not found)
//             Integer points = pointsPerPlot.getOrDefault(plotType, 10);
//             plotRating.setEarnedPoint(points);

//             // TODO: Integrate with offer points system to credit points to user
//             // e.g., offerPointService.awardPoints(userId, userType, points);
//         }

//         plotRatingRepository.save(plotRating);
//     }

//     public Double getAverage(String plotType) {
//         List<PlotRating> ratings = plotRatingRepository.findByPlotType(plotType);
//         if (ratings.isEmpty()) {
//             return 0.0;
//         }
//         return ratings.stream().mapToInt(PlotRating::getRating).average().orElse(0.0);
//     }

//     public Integer getUserRating(String plotType, Integer userId, String userType) {
//         return plotRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType)
//                 .map(PlotRating::getRating)
//                 .orElse(0);
//     }
// }




//                                earned points 


package com.example.prog.service;

import com.example.prog.entity.PlotRating;
import com.example.prog.interceptor.PointsTrackingInterceptor;
import com.example.prog.repository.PlotRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private PlotRatingRepository plotRatingRepository;

    // ADD THIS - Points tracking interceptor
    @Autowired
    private PointsTrackingInterceptor pointsTrackingInterceptor;

    // Map for points per plot type (configurable)
    private final Map<String, Integer> pointsPerPlot = Map.ofEntries(
            Map.entry("candle_chronicle", 10),
            Map.entry("shareholding_summary", 10),
            Map.entry("shareholding_overall", 10),
            Map.entry("breach_busters", 15),
            Map.entry("price_trend", 10),
            Map.entry("trend_tapestry", 15),
            Map.entry("macd", 10),
            Map.entry("sensex_stock_fluctuations", 15),
            Map.entry("sensex_symphony", 10),
            Map.entry("performance_heatmap", 15),
            Map.entry("pe_eps_book_value", 10),
            Map.entry("box_plot", 15),
            Map.entry("market_mood", 10),
            Map.entry("sensex_movement_corr_calculator", 15),
            Map.entry("compute_public_trading_activity", 10),
            Map.entry("candle_patterns", 10),
            Map.entry("financial_overview", 10),
            Map.entry("balance_sheet", 10),
            Map.entry("income_statement", 10),
            // Map.entry("fin_ov", 10),
            // Map.entry("balance_sheet", 10),
            // Map.entry("income_state", 10),
            Map.entry("cash_flow_statement", 10),
            Map.entry("pegy", 15),
            Map.entry("financial_ratios", 10)
            
    );

    public void submitRating(String plotType, Integer userId, String userType, Integer rating) {
        Optional<PlotRating> existing = plotRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType);
        PlotRating plotRating;
        boolean isNewRating = false;
        Integer earnedPoints = 0;

        if (existing.isPresent()) {
            // Update existing rating
            plotRating = existing.get();
            plotRating.setRating(rating);
            plotRating.setTimestamp(LocalDateTime.now());
            // Do not modify earned_point, keep the original value
            earnedPoints = plotRating.getEarnedPoint(); // Use existing points
        } else {
            // Create new rating
            plotRating = new PlotRating();
            plotRating.setPlotType(plotType);
            plotRating.setUserId(userId);
            plotRating.setUserType(userType);
            plotRating.setRating(rating);
            plotRating.setTimestamp(LocalDateTime.now());

            // Award points based on plot type (default to 10 if not found)
            earnedPoints = pointsPerPlot.getOrDefault(plotType, 10);
            plotRating.setEarnedPoint(earnedPoints);

            isNewRating = true;
        }

        plotRatingRepository.save(plotRating);

        // ADD THIS - Track points in the new system (only for new ratings)
        if (isNewRating) {
            pointsTrackingInterceptor.trackEquityRating(
                userId.longValue(), 
                rating, 
                plotType, 
                plotType // Using plotType as entity name
            );
        }
    }

    public Double getAverage(String plotType) {
        List<PlotRating> ratings = plotRatingRepository.findByPlotType(plotType);
        if (ratings.isEmpty()) {
            return 0.0;
        }
        return ratings.stream().mapToInt(PlotRating::getRating).average().orElse(0.0);
    }

    public Integer getUserRating(String plotType, Integer userId, String userType) {
        return plotRatingRepository.findByPlotTypeAndUserIdAndUserType(plotType, userId, userType)
                .map(PlotRating::getRating)
                .orElse(0);
    }
}