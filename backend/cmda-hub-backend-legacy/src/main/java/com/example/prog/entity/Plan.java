package com.example.prog.entity;

import org.springframework.context.annotation.Primary;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Primary
@Entity
@Table(name="orders")
public class Plan {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long myOrderid;
	private String orderId;
	private String amount;
	private String receipt;
	private String status;
	
	@ManyToOne
	private UserDtls user;
	
	private String paymentId;
	private String planType;
	
	
	public Long getMyOrderid() {
		return myOrderid;
	}

	public void setMyOrderid(Long myOrderid) {
		this.myOrderid = myOrderid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getReceipt() {
		return receipt;
	}

	public void setReceipt(String receipt) {
		this.receipt = receipt;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public UserDtls getUser() {
		return user;
	}

	public void setUser(UserDtls user) {
		this.user = user;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	
}
