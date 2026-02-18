package com.example.prog.webinar.mapper;



import com.example.prog.entity.UserDtls;
import com.example.prog.webinar.dto.common.UserSummaryDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserSummaryDTO toSummary(UserDtls user) {
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getUserID());
        dto.setFullname(user.getFullname());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
