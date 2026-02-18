//package com.example.prog.otp;
//
//
//
//
//
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.Map;
//
//@Service
//public class OtpStorageService {
//
//    private static final int OTP_EXPIRY_MINUTES = 5; // OTP Validity: 5 minutes
//
//    private static class OtpDetails {
//        String otp;
//        LocalDateTime expiryTime;
//
//        OtpDetails(String otp, LocalDateTime expiryTime) {
//            this.otp = otp;
//            this.expiryTime = expiryTime;
//        }
//    }
//
//    private Map<String, OtpDetails> otpData = new ConcurrentHashMap<>();
//
//    // Store OTP with expiry time
//    public void storeOtp(String email, String otp) {
//        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
//        otpData.put(email, new OtpDetails(otp, expiryTime));
//    }
//
//    // Validate OTP (Checks expiry and correctness)
//    public boolean validateOtp(String email, String otp) {
//        OtpDetails otpDetails = otpData.get(email);
//        
//        if (otpDetails == null) {
//            return false; // No OTP found
//        }
//
//        // Check if OTP is expired
//        if (LocalDateTime.now().isAfter(otpDetails.expiryTime)) {
//            otpData.remove(email); // Remove expired OTP
//            return false;
//        }
//
//        // Check if OTP matches
//        return otpDetails.otp.equals(otp);
//    }
//
//    // Remove OTP after successful validation
//    public void removeOtp(String email) {
//        otpData.remove(email);
//    }
//
//    public boolean isOtpVerified(String email) {
//        return otpMap.containsKey(email) && otpMap.get(email).isVerified();
//    }
//
//}
//


package com.example.prog.otp;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class OtpStorageService {

    private static final int OTP_EXPIRY_MINUTES = 5; // OTP Validity: 5 minutes

    private static class OtpDetails {
        String otp;
        LocalDateTime expiryTime;
        boolean verified; // Added flag for verification

        OtpDetails(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
            this.verified = false; // Default to false
        }
    }

    private Map<String, OtpDetails> otpData = new ConcurrentHashMap<>();

    // Store OTP with expiry time
    public void storeOtp(String email, String otp) {
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
        otpData.put(email, new OtpDetails(otp, expiryTime));
    }

    // Validate OTP (Checks expiry and correctness)
    public boolean validateOtp(String email, String otp) {
        OtpDetails otpDetails = otpData.get(email);
        
        if (otpDetails == null) {
            return false; // No OTP found
        }

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otpDetails.expiryTime)) {
            otpData.remove(email); // Remove expired OTP
            return false;
        }

        // Check if OTP matches
        if (otpDetails.otp.equals(otp)) {
            otpDetails.verified = true; // Mark as verified
            return true;
        }

        return false;
    }

    // Remove OTP after successful validation
    public void removeOtp(String email) {
        otpData.remove(email);
    }

    // Check if OTP was verified before registration
    public boolean isOtpVerified(String email) {
        OtpDetails otpDetails = otpData.get(email);
        return otpDetails != null && otpDetails.verified;
    }
}

