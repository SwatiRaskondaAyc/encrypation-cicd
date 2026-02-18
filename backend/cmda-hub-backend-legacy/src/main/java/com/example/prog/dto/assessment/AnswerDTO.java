package com.example.prog.dto.assessment;

public class AnswerDTO {
    private String questionId;
    private String selectedOption;
    
	public String getQuestionId() {
		return questionId;
	}
	public void setQuestionId(String questionId) {
		this.questionId = questionId;
	}
	public String getSelectedOption() {
		return selectedOption;
	}
	public void setSelectedOption(String selectedOption) {
		this.selectedOption = selectedOption;
	}
    
    
}