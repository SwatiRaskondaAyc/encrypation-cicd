package com.example.prog.zoho.service;


import com.example.prog.entity.ZohoUser;
import com.example.prog.zoho.serviceImpl.ZohoUserDTO;

import org.json.JSONException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

public interface ZohoUserService {

    String getZohoLoginUrl();

    ZohoUser getAccessToken(String code) throws IOException, InterruptedException;

    String getEmployeeData(String accessToken) throws IOException, InterruptedException;

    String extractEmailFromZohoResponse(String response);

    String extractAccountIdFromZohoResponse(String response) throws JSONException;

    ZohoUser findByUserName(String userName);

    ZohoUser findByMailId(String mailId);

    ZohoUser findByEmpId(String empId);

    boolean existsByMailId(String mailId);

    void save(ZohoUser user);

    List<ZohoUserDTO> getAllEmployees();

    ZohoUserDTO updatePermission(String empId, String permission);

    List<ZohoUserDTO> getEmployeesByPermission(String permission);

    List<ZohoUserDTO> getEmployeesByRole(String role);

    List<ZohoUserDTO> searchEmployeesByName(String name);

    long countEmployeesByPermission(String permission);

    List<ZohoUserDTO> getEmployeesByJoinDateRange(LocalDateTime startDate, LocalDateTime endDate);
}
