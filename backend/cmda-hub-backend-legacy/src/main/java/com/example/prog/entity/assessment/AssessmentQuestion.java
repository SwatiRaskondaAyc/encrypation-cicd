package com.example.prog.entity.assessment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


    
@Entity
@Table(name = "Assessment_Question")
public class AssessmentQuestion {

    @Id
    @Column(name = "Ques_ID", length = 25)
    private String quesId;

    @Column(name = "Question_Category", nullable = false, length = 100)
    private String questionCategory;

    @Column(name = "Question", nullable = false)
    private String question;

    @Column(name = "Option_A", nullable = false)
    private String optionA;

    @Column(name = "Option_B", nullable = false)
    private String optionB;

    @Column(name = "Option_C", nullable = false)
    private String optionC;

    @Column(name = "Option_D", nullable = false)
    private String optionD;

    @Column(name = "CorrectAns", nullable = false)
    private String correctAns;

	public String getQuesId() {
		return quesId;
	}

	public void setQuesId(String quesId) {
		this.quesId = quesId;
	}

	public String getQuestionCategory() {
		return questionCategory;
	}

	public void setQuestionCategory(String questionCategory) {
		this.questionCategory = questionCategory;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getOptionA() {
		return optionA;
	}

	public void setOptionA(String optionA) {
		this.optionA = optionA;
	}

	public String getOptionB() {
		return optionB;
	}

	public void setOptionB(String optionB) {
		this.optionB = optionB;
	}

	public String getOptionC() {
		return optionC;
	}

	public void setOptionC(String optionC) {
		this.optionC = optionC;
	}

	public String getOptionD() {
		return optionD;
	}

	public void setOptionD(String optionD) {
		this.optionD = optionD;
	}

	public String getCorrectAns() {
		return correctAns;
	}

	public void setCorrectAns(String correctAns) {
		this.correctAns = correctAns;
	}

    
}
