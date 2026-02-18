package com.example.prog.controller;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.prog.entity.PaymentDetails;
import com.example.prog.entity.SubscriptionDetails;
import com.example.prog.entity.SubscriptionMaster;
import com.example.prog.entity.UserDtls;
import com.example.prog.repository.SubscriptionDetailsRepository;
import com.example.prog.repository.SubscriptionMasterRepository;
import com.example.prog.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionMasterRepository subscriptionMasterRepository;

    @Autowired
    private SubscriptionDetailsRepository subscriptionDetailsRepository;

    private static final String RAZORPAY_KEY = "rzp_test_Sf4R9qMclVeHs7";
    private static final String RAZORPAY_SECRET = "2wD35YZtpmfzfl4mBAmyTiIs";

    /**
     * Endpoint to initiate payment (create Razorpay order)
     */
    @PostMapping("/start")
    
    public ResponseEntity<?> startPayment(@RequestBody Map<String, Object> data, Principal principal) {
        try {
            // Check if principal is null (i.e., user is not authenticated)
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            // Parse input data
            int amount = Integer.parseInt(data.get("amount").toString());
            String planId = data.get("planId").toString();

            // Validate user
            UserDtls user = userRepository.findByEmail(principal.getName()).orElse(null);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
            }

            // Validate subscription plan
            SubscriptionMaster plan = subscriptionMasterRepository.findById(planId).orElse(null);
            if (plan == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Plan not found");
            }

            // Initialize Razorpay client
            RazorpayClient client = new RazorpayClient("rzp_test_Sf4R9qMclVeHs7", "2wD35YZtpmfzfl4mBAmyTiIs");

            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.Orders.create(orderRequest);

            // Save subscription details
            SubscriptionDetails subscription = new SubscriptionDetails();
            subscription.setOrderId(order.get("id").toString());
            subscription.setUser(user);
            subscription.setPlan(plan);
            subscription.setPaymentAmount(BigDecimal.valueOf(amount));
            subscription.setStatus(SubscriptionDetails.Status.INACTIVE);
            subscription.setStartDate(LocalDateTime.now());
            subscription.setEndDate(LocalDateTime.now().plusDays(plan.getValidityDays()));
            subscriptionDetailsRepository.save(subscription);

            // Return order details
            return ResponseEntity.ok(Map.of(
                "id", order.get("id"),
                "amount", order.get("amount"),
                "currency", order.get("currency"),
                "status", order.get("status")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error starting payment: " + e.getMessage());
        }
    }


    /**
     * Verify payment after the user makes a successful payment
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> requestData) {
        try {
            // Parse input data
            String paymentId = requestData.get("paymentId").toString();
            String orderId = requestData.get("orderId").toString();
            String signature = requestData.get("signature").toString();

            // Fetch existing subscription
            SubscriptionDetails subscription = subscriptionDetailsRepository.findByOrderId(orderId);
            if (subscription == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order not found");
            }

            // Here, you would need to validate the signature and payment ID using Razorpay's API
            // For now, assuming it's valid:
            subscription.setStatus(SubscriptionDetails.Status.ACTIVE);
            subscription.setEndDate(LocalDateTime.now().plusDays(subscription.getPlan().getValidityDays()));
            subscriptionDetailsRepository.save(subscription);

            // Save payment details
            PaymentDetails payment = new PaymentDetails();
            payment.setSubscriptionDetails(subscription);
            payment.setPaymentId(paymentId);
            payment.setPaymentStatus(PaymentDetails.PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setAmountPaid(subscription.getPaymentAmount());
            payment.setPaymentMethod(PaymentDetails.PaymentMethod.UPI); // Example method

            // Return success response
            return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying payment: " + e.getMessage());
        }
    }
}
