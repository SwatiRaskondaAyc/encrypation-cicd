package com.example.prog.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.context.annotation.Primary;

@Primary
@Entity
@Table(name = "PaymentDetails")
public class PaymentDetails {

    @Id
    @Column(name = "PaymentID", nullable = false, unique = true)
    private String paymentId; // Razorpay's payment ID

    @ManyToOne
    @JoinColumn(name = "OrderID", nullable = false)
    private SubscriptionDetails subscriptionDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentMethod", columnDefinition = "ENUM('Credit Card', 'UPI', 'Bank Transfer', 'Other')")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentStatus", columnDefinition = "ENUM('Success', 'Pending', 'Failed', 'Refunded') DEFAULT 'Success'")
    private PaymentStatus paymentStatus = PaymentStatus.SUCCESS;

    @Column(name = "AmountPaid", nullable = false)
    private BigDecimal amountPaid;

    @Column(name = "PaymentDate")
    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "RefundStatus", columnDefinition = "ENUM('Not Refunded', 'Refunded') DEFAULT 'Not Refunded'")
    private RefundStatus refundStatus = RefundStatus.NOT_REFUNDED;

    public enum PaymentMethod {
        CREDIT_CARD, UPI, BANK_TRANSFER, OTHER
    }

    public enum PaymentStatus {
        SUCCESS, PENDING, FAILED, REFUNDED
    }

    public enum RefundStatus {
        NOT_REFUNDED, REFUNDED
    }

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}

	public SubscriptionDetails getSubscriptionDetails() {
		return subscriptionDetails;
	}

	public void setSubscriptionDetails(SubscriptionDetails subscriptionDetails) {
		this.subscriptionDetails = subscriptionDetails;
	}

	public PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public BigDecimal getAmountPaid() {
		return amountPaid;
	}

	public void setAmountPaid(BigDecimal amountPaid) {
		this.amountPaid = amountPaid;
	}

	public LocalDateTime getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}

	public RefundStatus getRefundStatus() {
		return refundStatus;
	}

	public void setRefundStatus(RefundStatus refundStatus) {
		this.refundStatus = refundStatus;
	}
}


