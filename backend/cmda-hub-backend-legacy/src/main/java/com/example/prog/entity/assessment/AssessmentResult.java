package com.example.prog.entity.assessment;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Assessment_Results")
public class AssessmentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Result_ID")
    private Long resultId;

    @Column(name = "User_ID", nullable = false)
    private Integer userId;

    @Column(name = "Score", nullable = false)
    private Double score;

    @Column(name = "Result_Status", nullable = false)
    private String resultStatus; // Passed or Failed

    @Column(name = "Attempted_At", columnDefinition = "DATETIME")
    private LocalDateTime attemptedAt;

	public Long getResultId() {
		return resultId;
	}

	public void setResultId(Long resultId) {
		this.resultId = resultId;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer integer) {
		this.userId = integer;
	}

	public Double getScore() {
		return score;
	}

	public void setScore(Double score) {
		this.score = score;
	}

	public String getResultStatus() {
		return resultStatus;
	}

	public void setResultStatus(String resultStatus) {
		this.resultStatus = resultStatus;
	}

	public LocalDateTime getAttemptedAt() {
		return attemptedAt;
	}

	public void setAttemptedAt(LocalDateTime attemptedAt) {
		this.attemptedAt = attemptedAt;
	}

    
    
}
