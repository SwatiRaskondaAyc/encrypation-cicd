//package com.example.prog.service;
//
//import com.example.prog.repository.mconsole.UserActivityRepository;
//import com.example.prog.repository.mconsole.MconsoleUserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class ManagementConsoleService {
//
//    @Autowired
//    private MconsoleUserRepository mconsoleUserRepository;
//
//    @Autowired
//    private UserActivityRepository userActivityRepository;
//
//    @Autowired
//    private TokenStoreService tokenStoreService;
//
//    public Map<String, Object> getUserStatistics() {
//        Map<String, Object> stats = new HashMap<>();
//
//        stats.put("individualActiveUsers", mconsoleUserRepository.countActiveUsersByType("INDIVIDUAL"));
//        stats.put("individualInactiveUsers", mconsoleUserRepository.countInactiveUsersByType("INDIVIDUAL"));
//        stats.put("corporateActiveUsers", mconsoleUserRepository.countActiveUsersByType("CORPORATE"));
//        stats.put("corporateInactiveUsers", mconsoleUserRepository.countInactiveUsersByType("CORPORATE"));
//
//        stats.put("individualRegisteredUsers", mconsoleUserRepository.countRegisteredUsersByType("INDIVIDUAL"));
//        stats.put("corporateRegisteredUsers", mconsoleUserRepository.countRegisteredUsersByType("CORPORATE"));
//
//        stats.put("individualLiveUsers", tokenStoreService.countActiveUsersByType("INDIVIDUAL"));
//        stats.put("corporateLiveUsers", tokenStoreService.countActiveUsersByType("CORPORATE"));
//
//        return stats;
//    }
//
//    public Map<String, Object> getDailyUserVisits() {
//        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
//        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
//
//        List<Map<String, Object>> dailyVisits = userActivityRepository.countDailyVisitorsByType(startOfDay, endOfDay);
//
//        Map<String, Object> visitStats = new HashMap<>();
//        visitStats.put("individualDailyVisits", 0L);
//        visitStats.put("corporateDailyVisits", 0L);
//
//        for (Map<String, Object> visit : dailyVisits) {
//            String userType = (String) visit.get("userType");
//            Long count = (Long) visit.get("count");
//            if ("INDIVIDUAL".equals(userType)) {
//                visitStats.put("individualDailyVisits", count);
//            } else if ("CORPORATE".equals(userType)) {
//                visitStats.put("corporateDailyVisits", count);
//            }
//        }
//
//        return visitStats;
//    }
//}

// package com.example.prog.service;

// import com.example.prog.repository.mconsole.MconsoleRepository;
// import com.example.prog.repository.mconsole.UserActivityRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.time.LocalTime;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class ManagementConsoleService {

//     private static final Logger logger = LoggerFactory.getLogger(ManagementConsoleService.class);

//     @Autowired
//     private MconsoleRepository muserRepository;

//     @Autowired
//     private UserActivityRepository userActivityRepository;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//      @Autowired
//     private SystemMetricsService systemMetricsService;

//     public Map<String, Object> getUserStatistics() {
//         Map<String, Object> stats = new HashMap<>();

//         try {
//             stats.put("individualActiveUsers", muserRepository.countActiveIndividualUsers());
//             stats.put("individualInactiveUsers", muserRepository.countInactiveIndividualUsers());
//             stats.put("corporateActiveUsers", muserRepository.countActiveCorporateUsers());
//             stats.put("corporateInactiveUsers", muserRepository.countInactiveCorporateUsers());
//             stats.put("individualRegisteredUsers", muserRepository.countRegisteredIndividualUsers());
//             stats.put("corporateRegisteredUsers", muserRepository.countRegisteredCorporateUsers());
//         } catch (Exception e) {
//             logger.error("Failed to fetch database user statistics: {}", e.getMessage());
//         }

//         try {
//             long individualLiveUsers = tokenStoreService.countActiveUsersByType("INDIVIDUAL");
//             stats.put("individualLiveUsers", individualLiveUsers);
//             logger.debug("individualLiveUsers count: {}", individualLiveUsers);
//         } catch (Exception e) {
//             stats.put("individualLiveUsers", 0L);
//             logger.error("Failed to count individual live users: {}", e.getMessage());
//         }
//         try {
//             long corporateLiveUsers = tokenStoreService.countActiveUsersByType("CORPORATE");
//             stats.put("corporateLiveUsers", corporateLiveUsers);
//             logger.debug("corporateLiveUsers count: {}", corporateLiveUsers);
//         } catch (Exception e) {
//             stats.put("corporateLiveUsers", 0L);
//             logger.error("Failed to count corporate live users: {}", e.getMessage());
//         }

//         logger.debug("Returning user statistics: {}", stats);
//         return stats;
//     }

//  public Map<String, Object> getDailyUserVisits() {
//         LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
//         LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
//         System.out.println("Fetching daily visits from " + startOfDay + " to " + endOfDay);

//         List<Map<String, Object>> dailyVisits = userActivityRepository.countDailyVisitorsByType(startOfDay, endOfDay);
//         System.out.println("Raw daily visits data: " + dailyVisits);

//         Map<String, Object> visitStats = new HashMap<>();
//         visitStats.put("individualDailyVisits", 0L);
//         visitStats.put("corporateDailyVisits", 0L);

//         for (Map<String, Object> visit : dailyVisits) {
//             String userType = (String) visit.get("userType");
//             Long count = (Long) visit.get("count");
//             if ("INDIVIDUAL".equals(userType)) {
//                 visitStats.put("individualDailyVisits", count);
//             } else if ("CORPORATE".equals(userType)) {
//                 visitStats.put("corporateDailyVisits", count);
//             }
//         }

//         System.out.println("Returning visit stats: " + visitStats);
//         return visitStats;
//     }

//       public Map<String, Object> getSystemMetrics() {
//         return systemMetricsService.getSystemMetrics();
//     }
// }

// package com.example.prog.service;

// import com.example.prog.repository.mconsole.MconsoleRepository;
// import com.example.prog.repository.mconsole.UserActivityRepository;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.time.LocalTime;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @Service
// public class ManagementConsoleService {

//     private static final Logger logger = LoggerFactory.getLogger(ManagementConsoleService.class);

//     @Autowired
//     private MconsoleRepository muserRepository;

//     @Autowired
//     private UserActivityRepository userActivityRepository;

//     @Autowired
//     private TokenStoreService tokenStoreService;

//     @Autowired
//     private SystemMetricsService systemMetricsService;

//     public Map<String, Object> getUserStatistics() {
//         Map<String, Object> stats = new HashMap<>();

//         try {
//             stats.put("individualActiveUsers", muserRepository.countActiveIndividualUsers());
//             stats.put("individualInactiveUsers", muserRepository.countInactiveIndividualUsers());
//             stats.put("corporateActiveUsers", muserRepository.countActiveCorporateUsers());
//             stats.put("corporateInactiveUsers", muserRepository.countInactiveCorporateUsers());
//             stats.put("individualRegisteredUsers", muserRepository.countRegisteredIndividualUsers());
//             stats.put("corporateRegisteredUsers", muserRepository.countRegisteredCorporateUsers());
//         } catch (Exception e) {
//             logger.error("Failed to fetch database user statistics: {}", e.getMessage());
//         }

//         try {
//             long individualLiveUsers = tokenStoreService.countActiveUsersByType("INDIVIDUAL");
//             stats.put("individualLiveUsers", individualLiveUsers);
//             logger.info("Successfully counted individualLiveUsers: {}", individualLiveUsers);
//         } catch (Exception e) {
//             stats.put("individualLiveUsers", 0L);
//             logger.error("Failed to count individual live users: {}", e.getMessage(), e);
//         }

//         try {
//             long corporateLiveUsers = tokenStoreService.countActiveUsersByType("CORPORATE");
//             stats.put("corporateLiveUsers", corporateLiveUsers);
//             logger.info("Successfully counted corporateLiveUsers: {}", corporateLiveUsers);
//         } catch (Exception e) {
//             stats.put("corporateLiveUsers", 0L);
//             logger.error("Failed to count corporate live users: {}", e.getMessage(), e);
//         }

//         try {
//             long adminLiveUsers = tokenStoreService.countActiveUsersByType("ADMIN");
//             stats.put("adminLiveUsers", adminLiveUsers);
//             logger.info("Successfully counted adminLiveUsers: {}", adminLiveUsers);
//         } catch (Exception e) {
//             stats.put("adminLiveUsers", 0L);
//             logger.error("Failed to count admin live users: {}", e.getMessage(), e);
//         }

//         logger.debug("Returning user statistics: {}", stats);
//         return stats;
//     }

//     public Map<String, Object> getDailyUserVisits() {
//         LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
//         LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
//         System.out.println("Fetching daily visits from " + startOfDay + " to " + endOfDay);

//         List<Map<String, Object>> dailyVisits = userActivityRepository.countDailyVisitorsByType(startOfDay, endOfDay);
//         System.out.println("Raw daily visits data: " + dailyVisits);

//         Map<String, Object> visitStats = new HashMap<>();
//         visitStats.put("individualDailyVisits", 0L);
//         visitStats.put("corporateDailyVisits", 0L);

//         for (Map<String, Object> visit : dailyVisits) {
//             String userType = (String) visit.get("userType");
//             Long count = (Long) visit.get("count");
//             if ("INDIVIDUAL".equals(userType)) {
//                 visitStats.put("individualDailyVisits", count);
//             } else if ("CORPORATE".equals(userType)) {
//                 visitStats.put("corporateDailyVisits", count);
//             }
//         }

//         System.out.println("Returning visit stats: " + visitStats);
//         return visitStats;
//     }

//     public Map<String, Object> getSystemMetrics() {
//         return systemMetricsService.getSystemMetrics();
//     }
// }


package com.example.prog.service;

import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;
import com.example.prog.repository.mconsole.MconsoleRepository;
import com.example.prog.repository.mconsole.UserActivityRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ManagementConsoleService {

    private static final Logger logger = LoggerFactory.getLogger(ManagementConsoleService.class);

    @Autowired
    private MconsoleRepository muserRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private TokenStoreService tokenStoreService;

    @Autowired
    private SystemMetricsService systemMetricsService;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();

        try {
            stats.put("individualActiveUsers", muserRepository.countActiveIndividualUsers());
            stats.put("individualInactiveUsers", muserRepository.countInactiveIndividualUsers());
            stats.put("corporateActiveUsers", muserRepository.countActiveCorporateUsers());
            stats.put("corporateInactiveUsers", muserRepository.countInactiveCorporateUsers());
            stats.put("individualRegisteredUsers", muserRepository.countRegisteredIndividualUsers());
            stats.put("corporateRegisteredUsers", muserRepository.countRegisteredCorporateUsers());
        } catch (Exception e) {
            logger.error("Failed to fetch database user statistics: {}", e.getMessage());
        }

        try {
            long individualLiveUsers = tokenStoreService.countActiveUsersByType("INDIVIDUAL");
            stats.put("individualLiveUsers", individualLiveUsers);
            logger.info("Successfully counted individualLiveUsers: {}", individualLiveUsers);
        } catch (Exception e) {
            stats.put("individualLiveUsers", 0L);
            logger.error("Failed to count individual live users: {}", e.getMessage(), e);
        }

        try {
            long corporateLiveUsers = tokenStoreService.countActiveUsersByType("CORPORATE");
            stats.put("corporateLiveUsers", corporateLiveUsers);
            logger.info("Successfully counted corporateLiveUsers: {}", corporateLiveUsers);
        } catch (Exception e) {
            stats.put("corporateLiveUsers", 0L);
            logger.error("Failed to count corporate live users: {}", e.getMessage(), e);
        }

        try {
            long adminLiveUsers = tokenStoreService.countActiveUsersByType("ADMIN");
            stats.put("adminLiveUsers", adminLiveUsers);
            logger.info("Successfully counted adminLiveUsers: {}", adminLiveUsers);
        } catch (Exception e) {
            stats.put("adminLiveUsers", 0L);
            logger.error("Failed to count admin live users: {}", e.getMessage(), e);
        }

        logger.debug("Returning user statistics: {}", stats);
        return stats;
    }

    public Map<String, Object> getDailyUserVisits() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        System.out.println("Fetching daily visits from " + startOfDay + " to " + endOfDay);

        List<Map<String, Object>> dailyVisits = userActivityRepository.countDailyVisitorsByType(startOfDay, endOfDay);
        System.out.println("Raw daily visits data: " + dailyVisits);

        Map<String, Object> visitStats = new HashMap<>();
        visitStats.put("individualDailyVisits", 0L);
        visitStats.put("corporateDailyVisits", 0L);

        for (Map<String, Object> visit : dailyVisits) {
            String userType = (String) visit.get("userType");
            Long count = (Long) visit.get("count");
            if ("INDIVIDUAL".equals(userType)) {
                visitStats.put("individualDailyVisits", count);
            } else if ("CORPORATE".equals(userType)) {
                visitStats.put("corporateDailyVisits", count);
            }
        }

        System.out.println("Returning visit stats: " + visitStats);
        return visitStats;
    }

    public List<UserDtls> getIndividualRegularUsers() {
        return userRepository.findByGoogleUserIDIsNullAndUserType("individual");
    }

    public List<UserDtls> getIndividualGoogleUsers() {
        return userRepository.findByGoogleUserIDIsNotNullAndUserType("individual");
    }

    public List<UserDtls> getCorporateUsers() {
        return userRepository.findByUserType("corporate");
    }

    public Map<String, Object> getSystemMetrics() {
        return systemMetricsService.getSystemMetrics();
    }
}