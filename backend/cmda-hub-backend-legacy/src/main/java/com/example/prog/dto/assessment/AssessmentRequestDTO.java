package com.example.prog.dto.assessment;

import java.util.List;

public class AssessmentRequestDTO {
    private Integer userId;
    private boolean isCorporateUser; // Optional: helps if user can be either type
    private List<AnswerDTO> answers;
    
    
	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public boolean isCorporateUser() {
		return isCorporateUser;
	}
	public void setCorporateUser(boolean isCorporateUser) {
		this.isCorporateUser = isCorporateUser;
	}
	public List<AnswerDTO> getAnswers() {
		return answers;
	}
	public void setAnswers(List<AnswerDTO> answers) {
		this.answers = answers;
	}
    
    
}
