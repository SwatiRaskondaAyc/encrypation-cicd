//package com.example.prog.service.dashboard;
//
//
//
//
//import java.util.List;
//import java.util.Map;
//
//import com.example.prog.entity.dashboard.DashboardMaster;
//
//import jakarta.servlet.http.HttpServletRequest;
//
//public interface DashboardMasterService {
////	 Map<String, Object> saveDashboard(DashboardMaster dashboard, HttpServletRequest request);
//
//	    Map<String, Object> fetchDashboards(HttpServletRequest request);
//
//	    Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request);
//
//		Map<String, Object> saveDashboard(DashboardMaster dashboard, HttpServletRequest request, String symbol,
//				String companyName, String uploadId, String graphType, String platform);
////}

//package com.example.prog.service.dashboard;
//
//
//import jakarta.servlet.http.HttpServletRequest;
//import java.util.Map;
//
//import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
//
//public interface DashboardMasterService {
//
//    /**
//     * Saves a dashboard with multiple EquityHub and Portfolio plots.
//     *
//     * @param requestDTO The DTO containing dashboard metadata and lists of EquityHub and Portfolio plots.
//     * @param request The HTTP request containing user authentication details (JWT token).
//     * @return A map containing the response, including the dashboard ID and details of saved plots.
//     */
//    Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request);
//
//    /**
//     * Fetches all dashboards for the authenticated user, including their associated plots.
//     *
//     * @param request The HTTP request containing user authentication details (JWT token).
//     * @return A map containing a list of dashboards with their plots.
//     */
//    Map<String, Object> fetchDashboards(HttpServletRequest request);
//
//    /**
//     * Fetches a specific dashboard by its dashId, including its associated plots.
//     *
//     * @param dashId The ID of the dashboard to fetch.
//     * @param request The HTTP request containing user authentication details (JWT token).
//     * @return A map containing the dashboard details and its plots.
//     */
//   
//
//    /**
//     * Deletes a dashboard and its associated plots.
//     *
//     * @param dashId The ID of the dashboard to delete.
//     * @param request The HTTP request containing user authentication details (JWT token).
//     * @return A map containing the response, indicating successful deletion or an error.
//     */
//    Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request);
//
//	Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request);
//}









//----------------------swati------------------

package com.example.prog.service.dashboard;

import com.example.prog.entity.dashboard.DashboardSaveRequestDTO;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface DashboardMasterService {
    Map<String, Object> saveDashboard(DashboardSaveRequestDTO requestDTO, HttpServletRequest request);
    Map<String, Object> fetchDashboards(HttpServletRequest request);
    Map<String, Object> fetchDashboardById(int dashId, HttpServletRequest request);
    Map<String, Object> deleteDashboard(int dashId, HttpServletRequest request);
    Map<String, Object> saveSnapshot(int dashId, String base64Screenshot, HttpServletRequest request);
	Map<String, Object> fetchPublicDashboard(int dashId);
    Map<String,Object> fetchSnapshots(HttpServletRequest request);
    Map<String, Object> deleteSnapshot(int dashId, HttpServletRequest request);
}
