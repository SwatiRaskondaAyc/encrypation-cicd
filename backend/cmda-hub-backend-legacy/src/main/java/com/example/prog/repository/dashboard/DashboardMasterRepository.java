// package com.example.prog.repository.dashboard;




// import org.springframework.data.jpa.repository.JpaRepository;

// import com.example.prog.entity.dashboard.DashboardMaster;

// import java.util.List;
// import java.util.Optional;

// public interface DashboardMasterRepository extends JpaRepository<DashboardMaster, Integer> {
//     List<DashboardMaster> findByUserId(int userId);
//     Optional<DashboardMaster> findByShareToken(String shareToken);
// }



// package com.example.prog.repository.dashboard;




// import org.springframework.data.jpa.repository.JpaRepository;

// import com.example.prog.entity.dashboard.DashboardMaster;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;

// import java.util.List;

// public interface DashboardMasterRepository extends JpaRepository<DashboardMaster, Integer> {
//     List<DashboardMaster> findByUserId(int userId);
//     @Modifying
//     @Transactional
//     @Query("UPDATE DashboardMaster d SET d.screenshotPath = null WHERE d.dashId = :dashId")
//     void clearScreenshotPath(@Param("dashId") int dashId);


// }



// package com.example.prog.repository.dashboard;

// import com.example.prog.entity.dashboard.DashboardMaster;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;

// import java.util.List;
// import java.util.Optional;

// public interface DashboardMasterRepository extends JpaRepository<DashboardMaster, Integer> {

//     List<DashboardMaster> findByUserId(int userId);

//     // @Modifying
//     // @Transactional
//     // @Query("UPDATE DashboardMaster d SET d.screenshotPath = null WHERE d.dashId = :dashId")
//     // void clearScreenshotPath(@Param("dashId") int dashId);

//     // ✅ Custom query to fetch DashboardMaster by dashId
//     @Query("SELECT d FROM DashboardMaster d WHERE d.dashId = :dashId")
//     Optional<DashboardMaster> getDashboardByDashId(@Param("dashId") int dashId);
// }


package com.example.prog.repository.dashboard;

import com.example.prog.entity.dashboard.DashboardMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DashboardMasterRepository extends JpaRepository<DashboardMaster, Integer> {

    List<DashboardMaster> findByUserId(int userId);

    // Uncommented and enabled to clear screenshotPath
    @Modifying
    @Transactional
    @Query("UPDATE DashboardMaster d SET d.screenshotPath = null WHERE d.dashId = :dashId")
    void clearScreenshotPath(@Param("dashId") int dashId);

    // Custom query to fetch DashboardMaster by dashId
    @Query("SELECT d FROM DashboardMaster d WHERE d.dashId = :dashId")
    Optional<DashboardMaster> getDashboardByDashId(@Param("dashId") int dashId);
}
