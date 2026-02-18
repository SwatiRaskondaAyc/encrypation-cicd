package com.example.prog.entity.portfolio;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity(name = "trade_file_RecordHash")
public class TradeFileRecordHash {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int userId;

    private String platform;

    private String tradeFileHash;
    
    @Column(name = "uploadId")
    private String uploadId;
    // Constructors, Getters & Setters
    public TradeFileRecordHash() {}

    public TradeFileRecordHash(int userId, String platform, String tradeFileHash, String uploadId) {
        this.userId = userId;
        this.platform = platform;
        this.tradeFileHash = tradeFileHash;        
        this.uploadId = uploadId;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getPlatform() {
		return platform;
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public String getTradeFileHash() {
		return tradeFileHash;
	}

	public void setTradeFileHash(String tradeFileHash) {
		this.tradeFileHash = tradeFileHash;
	}
    
	public String getUploadId() {
		return uploadId;
	}
	
	public void setUploadId(String uploadId) {
		this.uploadId = uploadId;
	}

}
