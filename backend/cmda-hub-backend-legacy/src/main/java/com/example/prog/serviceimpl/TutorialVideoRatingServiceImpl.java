// package com.example.prog.serviceimpl;

// import com.example.prog.entity.TutorialVideoRating;
// // import com.example.prog.repository.TutorialVideoRatingRepository;
// import com.example.prog.service.TutorialVideoRatingService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;

// @Service
// public class TutorialVideoRatingServiceImpl implements TutorialVideoRatingService {

//     private static final List<String> VALID_VIDEOS = Arrays.asList(
//         "Introduction to Search Features",
//         "Market Mood",
//         "Box Plot",
//         "Trend Tapestry",
//         "Sensex & Stock Fluctuation",
//         "Sensex Impact Calculator",
//         "MACD Indicator",
//         "Sensex Symphony",
//         "Breach Busters",
//         "PE vs EPS vs Book Value",
//         "Performance HeatMap"
//     );

//     @Autowired
//     private TutorialVideoRatingRepository ratingRepository;

//     @Override
//     public TutorialVideoRating rateVideo(String videoName, Integer userId, String userType, Integer rating) throws Exception {
//         // Validate video name
//         if (!VALID_VIDEOS.contains(videoName)) {
//             throw new Exception("Invalid video name");
//         }

//         // Validate rating
//         if (rating < 1 || rating > 5) {
//             throw new Exception("Rating must be between 1 and 5");
//         }

//         // Check if user already rated this video
//         TutorialVideoRating existingRating = ratingRepository.findByUserIdAndVideoName(userId, videoName)
//                 .orElse(null);

//         TutorialVideoRating ratingEntity = existingRating != null ? existingRating : new TutorialVideoRating();
//         ratingEntity.setVideoName(videoName);
//         ratingEntity.setUserId(userId);
//         ratingEntity.setUserType(userType);
//         ratingEntity.setRating(rating);
//         ratingEntity.setTimestamp(LocalDateTime.now());
//         if (existingRating == null) {
//             ratingEntity.setEarnedPoint(10); // 10 points for first-time rating
//         } // If existing rating, earnedPoint remains unchanged

//         return ratingRepository.save(ratingEntity);
//     }

//     @Override
//     public Double getAverageRating(String videoName) {
//         if (!VALID_VIDEOS.contains(videoName)) {
//             return 0.0;
//         }
//         List<TutorialVideoRating> ratings = ratingRepository.findByVideoName(videoName);
//         if (ratings.isEmpty()) {
//             return 0.0;
//         }
//         double sum = ratings.stream().mapToInt(TutorialVideoRating::getRating).sum();
//         return sum / ratings.size();
//     }

//     @Override
//     public Integer getUserRating(String videoName, Integer userId, String userType) {
//         if (!VALID_VIDEOS.contains(videoName)) {
//             return 0;
//         }
//         return ratingRepository.findByUserIdAndVideoName(userId, videoName)
//                 .map(TutorialVideoRating::getRating)
//                 .orElse(0);
//     }
// }



// --------------------user points service impl --------------------



// package com.example.prog.serviceimpl;

// import com.example.prog.entity.TutorialVideoRating;
// import com.example.prog.interceptor.PointsTrackingInterceptor;
// import com.example.prog.repository.TutorialVideoRatingRepository;
// import com.example.prog.service.TutorialVideoRatingService;
// import com.example.prog.service.userpoints.PointsTrackingService;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDateTime;
// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// @Service
// public class TutorialVideoRatingServiceImpl implements TutorialVideoRatingService {

  

//     private static final List<String> VALID_VIDEOS = Arrays.asList(
//         "Introduction to Search Features",
//         "Market Mood",
//         "Box Plot",
//         "Trend Tapestry",
//         "Sensex & Stock Fluctuation",
//         "Sensex Impact Calculator",
//         "MACD Indicator",
//         "Sensex Symphony",
//         "Breach Busters",
//         "PE vs EPS vs Book Value",
//         "Performance HeatMap",
//         "Pegy Worm Plot Analysis"
//     );

//     @Autowired
//     private TutorialVideoRatingRepository ratingRepository;

//      @Autowired
//     private PointsTrackingInterceptor pointsTrackingInterceptor; 

//       @Autowired
// private PointsTrackingService pointsTrackingService; // INSTEAD OF PointsTrackingInterceptor
//     @Override
//     public TutorialVideoRating rateVideo(String videoName, Integer userId, String userType, Integer rating) throws Exception {
//         // Validate video name
//         if (!VALID_VIDEOS.contains(videoName)) {
//             throw new Exception("Invalid video name");
//         }

//         // Validate rating
//         if (rating < 1 || rating > 5) {
//             throw new Exception("Rating must be between 1 and 5");
//         }

//         // Check if user already rated this video - USE THREE PARAMETER METHOD
//         Optional<TutorialVideoRating> existingRating = ratingRepository.findByUserIdAndVideoNameAndUserType(userId, videoName, userType);

//         boolean isNewRating = !existingRating.isPresent();
//         TutorialVideoRating ratingEntity;
//         Integer earnedPoints;

//         if (existingRating.isPresent()) {
//             // Update existing rating
//             ratingEntity = existingRating.get();
//             ratingEntity.setRating(rating);
//             ratingEntity.setTimestamp(LocalDateTime.now());
//             // Keep existing earned points for updates
//             earnedPoints = ratingEntity.getEarnedPoint();
//         } else {
//             // Create new rating
//             ratingEntity = new TutorialVideoRating();
//             ratingEntity.setVideoName(videoName);
//             ratingEntity.setUserId(userId);
//             ratingEntity.setUserType(userType);
//             ratingEntity.setRating(rating);
//             ratingEntity.setTimestamp(LocalDateTime.now());
//             // Award 10 points for new ratings
//             earnedPoints = 10;
//             ratingEntity.setEarnedPoint(earnedPoints);
//         }

//         TutorialVideoRating savedRating = ratingRepository.save(ratingEntity);

//         // Track points using your exact earned points logic
//         // pointsTrackingInterceptor.trackTutorialRatingWithPoints(
//         //     userId.longValue(), 
//         //     rating, 
//         //     videoName, 
//         //     earnedPoints
//         // );

//         pointsTrackingService.trackTutorialRatingWithPoints(
//     userId.longValue(), 
//     rating, 
//     videoName, 
//     earnedPoints
// );

//         return savedRating;
//     }

//     @Override
//     public Double getAverageRating(String videoName) {
//         if (!VALID_VIDEOS.contains(videoName)) {
//             return 0.0;
//         }
        
//         // Use the repository method that returns List
//         List<TutorialVideoRating> ratings = ratingRepository.findByVideoName(videoName);
//         if (ratings.isEmpty()) {
//             return 0.0;
//         }
        
//         double sum = ratings.stream().mapToInt(TutorialVideoRating::getRating).sum();
//         return sum / ratings.size();
//     }

//     @Override
//     public Integer getUserRating(String videoName, Integer userId, String userType) {
//         if (!VALID_VIDEOS.contains(videoName)) {
//             return 0;
//         }
        
//         // Use the three-parameter method for accuracy
//         Optional<TutorialVideoRating> rating = ratingRepository.findByUserIdAndVideoNameAndUserType(userId, videoName, userType);
//         return rating.map(TutorialVideoRating::getRating).orElse(0);
//     }
// }


package com.example.prog.serviceimpl;

import com.example.prog.entity.TutorialVideoRating;
import com.example.prog.repository.TutorialVideoRatingRepository;
import com.example.prog.service.TutorialVideoRatingService;
import com.example.prog.service.userpoints.PointsTrackingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TutorialVideoRatingServiceImpl implements TutorialVideoRatingService {

    private static final Logger logger = LoggerFactory.getLogger(TutorialVideoRatingServiceImpl.class);

    private static final List<String> VALID_VIDEOS = Arrays.asList(
        "Introduction to Search Features",
        "Market Mood",
        "Box Plot",
        "Trend Tapestry",
        "Sensex & Stock Fluctuation",
        "Sensex Impact Calculator",
        "MACD Indicator",
        "Sensex Symphony",
        "Breach Busters",
        "PE vs EPS vs Book Value",
        "Performance HeatMap",
        "Pegy Worm Plot Analysis",
        "Price Spread Over Time"
    );

    @Autowired
    private TutorialVideoRatingRepository ratingRepository;

    @Autowired
    private PointsTrackingService pointsTrackingService;

    @Override
    public TutorialVideoRating rateVideo(String videoName, Integer userId, String userType, Integer rating) throws Exception {
        // Validate video name
        if (!VALID_VIDEOS.contains(videoName)) {
            throw new Exception("Invalid video name: " + videoName);
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new Exception("Rating must be between 1 and 5");
        }

        logger.info("Rating video - User: {}, Video: {}, Type: {}, Rating: {}", 
                   userId, videoName, userType, rating);

        // CRITICAL: Use the explicit query method to find the specific rating
        Optional<TutorialVideoRating> existingRating = ratingRepository.findSpecificRating(userId, videoName, userType);

        TutorialVideoRating ratingEntity;
        boolean isNewRating;
        Integer earnedPoints = 0;

        if (existingRating.isPresent()) {
            // UPDATE existing rating for THIS SPECIFIC VIDEO
            ratingEntity = existingRating.get();
            logger.info("Updating existing rating ID: {} for video: {}", 
                       ratingEntity.getRatingId(), ratingEntity.getVideoName());
            
            // Verify we have the correct video (safety check)
            if (!ratingEntity.getVideoName().equals(videoName)) {
                logger.error("CRITICAL: Video mismatch! Expected: {}, Found: {}", 
                            videoName, ratingEntity.getVideoName());
                throw new Exception("Video data corruption detected");
            }
            
            ratingEntity.setRating(rating);
            ratingEntity.setTimestamp(LocalDateTime.now());
            // Keep existing earned points (no new points for updates)
            earnedPoints = ratingEntity.getEarnedPoint();
            isNewRating = false;
            
        } else {
            // CREATE new rating for THIS SPECIFIC VIDEO
            ratingEntity = new TutorialVideoRating();
            ratingEntity.setVideoName(videoName);
            ratingEntity.setUserId(userId);
            ratingEntity.setUserType(userType);
            ratingEntity.setRating(rating);
            ratingEntity.setTimestamp(LocalDateTime.now());
            // Award 10 points for new ratings only
            earnedPoints = 10;
            ratingEntity.setEarnedPoint(earnedPoints);
            isNewRating = true;
            
            logger.info("Creating new rating for video: {}", videoName);
        }

        TutorialVideoRating savedRating = ratingRepository.save(ratingEntity);
        logger.info("Saved rating - ID: {}, Video: {}, Rating: {}, Points: {}", 
                   savedRating.getRatingId(), savedRating.getVideoName(), 
                   savedRating.getRating(), savedRating.getEarnedPoint());

        // Track points only for new ratings
        if (isNewRating) {
            pointsTrackingService.trackTutorialRatingWithPoints(
                userId.longValue(), 
                rating, 
                videoName, 
                earnedPoints
            );
            logger.info("Awarded {} points for new rating of: {}", earnedPoints, videoName);
        }

        return savedRating;
    }

    @Override
    public Double getAverageRating(String videoName) {
        if (!VALID_VIDEOS.contains(videoName)) {
            return 0.0;
        }
        
        try {
            Double average = ratingRepository.findAverageRatingByVideoName(videoName);
            return average != null ? average : 0.0;
        } catch (Exception e) {
            logger.error("Error calculating average for video: {}", videoName, e);
            return 0.0;
        }
    }

    @Override
    public Integer getUserRating(String videoName, Integer userId, String userType) {
        if (!VALID_VIDEOS.contains(videoName)) {
            return 0;
        }
        
        try {
            Optional<TutorialVideoRating> rating = ratingRepository.findSpecificRating(userId, videoName, userType);
            return rating.map(TutorialVideoRating::getRating).orElse(0);
        } catch (Exception e) {
            logger.error("Error getting rating for user {} video {}", userId, videoName, e);
            return 0;
        }
    }

    /**
     * Debug method to check user's current ratings
     */
    public List<TutorialVideoRating> getUserVideoRatings(Integer userId, String videoName) {
        return ratingRepository.findByUserIdAndVideoName(userId, videoName);
    }

    /**
     * Debug method to get all user ratings
     */
    public List<TutorialVideoRating> getAllUserRatings(Integer userId) {
        return ratingRepository.findByUserId(userId);
    }
}