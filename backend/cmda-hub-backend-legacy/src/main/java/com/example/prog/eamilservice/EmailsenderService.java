


// package com.example.prog.eamilservice;

// import java.time.LocalDateTime;
// import java.util.UUID;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.mail.SimpleMailMessage;
// //import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.stereotype.Service;
// //import org.springframework.ui.Model;
// //import org.springframework.web.bind.annotation.RequestParam;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.service.HomeService;

// import jakarta.mail.MessagingException;
// import jakarta.mail.internet.MimeMessage;

// @Service
// public class EmailsenderService {

// 	private final JavaMailSender javaMailSender;
	
// 	  public EmailsenderService(JavaMailSender javaMailSender)
// 	  {
// 	        this.javaMailSender = javaMailSender;
// 	    }
	  
// //
// //		@Value("${frontend.url}")  // Fetching value from application.properties
// //	    private String frontendUrl;
	
//     @Autowired
//     private JavaMailSender mailSender;

//     @Autowired
//     private HomeService homeService;

//     public void sendResetEmail(String toEmail, String resetLink) {
//     	  try {
//               MimeMessage message = javaMailSender.createMimeMessage();
//               MimeMessageHelper helper = new MimeMessageHelper(message, true);
//               helper.setFrom("aycanalytics01@gmail.com"); // Replace with your sender email
//               helper.setTo(toEmail);
//               helper.setSubject("Password Reset Request");
//               helper.setText("You have requested to reset your password.\n\n" +
//                 "Click the link below to reset your password:\n" + resetLink +
//                 "\n \n If you did not request this, please ignore this email.");

//               javaMailSender.send(message);
//         System.out.println("Password reset email sent successfully.");
//     }
    	  
//     	  catch (MessagingException e) 
//     	  {
//               e.printStackTrace();
//               System.out.println("Error sending email: " + e.getMessage());
//           }
    	  
//     }	  

//     public String processForgotPassword( String email)
//     {
//         UserDtls user = homeService.findUserByEmail(email);

//         if (user == null) 
//         {
//             return "No account found with the provided email.";
//         }

//         try 
//         {
//             String resetToken = UUID.randomUUID().toString();
//             user.setResetToken(resetToken);
//             user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
//             homeService.saveUser(user);

//             String resetLink = "https://cmdahub.com/resetpassword?token=" + resetToken;
//             sendResetEmail(user.getEmail(), resetLink);
//             return "A password reset link has been sent to your email.";
//         } 
//         catch (Exception e) 
//         {
//            return  "Error processing password reset request. Please try again later.";
//         }
        
        
//     }
    
//     public void sendEmail(String toEmail, String subject, String body)
//     {
//         try 
//         {
//             // Create a simple mail message
//             SimpleMailMessage message = new SimpleMailMessage();
//             message.setTo(toEmail);
//             message.setSubject(subject);
//             message.setText(body);

//             // Send the email
//             mailSender.send(message);
//             System.out.println("Email sent successfully to: " + toEmail);
//         } 
        
//         catch (Exception e)
//         {
//             System.err.println("Error sending email: " + e.getMessage());
//             throw new RuntimeException("Failed to send email. Please try again later.");
//         }
	
    
    
// }
// }
package com.example.prog.eamilservice;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.prog.entity.UserDtls;
import com.example.prog.service.HomeService;
import com.example.prog.config.CorsConfig; // Import CorsConfig

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailsenderService {

	private final JavaMailSender javaMailSender;
	
	@Autowired
	private CorsConfig corsConfig; // Inject CorsConfig to access frontend URLs
	
	public EmailsenderService(JavaMailSender javaMailSender)
	{
		this.javaMailSender = javaMailSender;
	}
	
	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private HomeService homeService;

	public void sendResetEmail(String toEmail, String resetLink) {
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);
			helper.setFrom("aycanalytics01@gmail.com"); // Replace with your sender email
			helper.setTo(toEmail);
			helper.setSubject("Password Reset Request");
			helper.setText("You have requested to reset your password.\n\n" +
					"Click the link below to reset your password:\n" + resetLink +
					"\n \n If you did not request this, please ignore this email.");

			javaMailSender.send(message);
			System.out.println("Password reset email sent successfully.");
		}
		catch (MessagingException e) 
		{
			e.printStackTrace();
			System.out.println("Error sending email: " + e.getMessage());
		}
	}	  

	public String processForgotPassword(String email)
	{
		UserDtls user = homeService.findUserByEmail(email);

		if (user == null) 
		{
			return "No account found with the provided email.";
		}

		try 
		{
			String resetToken = UUID.randomUUID().toString();
			user.setResetToken(resetToken);
			user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
			homeService.saveUser(user);

			// Get the frontend URLs from CorsConfig
			String primaryResetLink = corsConfig.getFrontendUrl() + "resetpassword?token=" + resetToken;
			String alternateResetLink = corsConfig.getAlternateFrontendUrl() + "resetpassword?token=" + resetToken;
			System.out.println("Generated reset link (primary): " + primaryResetLink);
			System.out.println("Generated reset link (alternate): " + alternateResetLink);

			// Send email with both reset links
			String emailBody = "You have requested to reset your password.\n\n" +
					"Click one of the following links to reset your password:\n" +
					"Primary Link: " + primaryResetLink + "\n" +
					"Alternate Link: " + alternateResetLink +
					"\n \n If you did not request this, please ignore this email.";
			sendResetEmail(user.getEmail(), emailBody);

			return "A password reset link has been sent to your email.";
		} 
		catch (Exception e) 
		{
			return "Error processing password reset request. Please try again later.";
		}
	}

	public void sendEmail(String toEmail, String subject, String body)
	{
		try 
		{
			// Create a simple mail message
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(toEmail);
			message.setSubject(subject);
			message.setText(body);

			// Send the email
			mailSender.send(message);
			System.out.println("Email sent successfully to: " + toEmail);
		} 
		catch (Exception e)
		{
			System.err.println("Error sending email: " + e.getMessage());
			throw new RuntimeException("Failed to send email. Please try again later.");
		}
	}
}
