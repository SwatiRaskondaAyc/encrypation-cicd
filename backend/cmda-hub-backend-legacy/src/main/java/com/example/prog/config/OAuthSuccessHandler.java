// package com.example.prog.config;

// import java.io.IOException;
// import java.util.UUID;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.security.web.DefaultRedirectStrategy;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
// import org.springframework.stereotype.Component;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.token.JwtUtil;

// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

//     @Autowired
//     private JwtUtil jwtUtil ;


//     @Override
//     public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                         Authentication authentication) throws IOException {
//     	OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
//         String token = jwtUtil.generateToken(oauthUser.getAttribute("email"));

//         response.sendRedirect("http://147.93.107.167:5174/oauth2/redirect?token=" + token);
//     }

	
// }

// package com.example.prog.config;

// import java.io.IOException;
// import java.util.UUID;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.security.web.DefaultRedirectStrategy;
// import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
// import org.springframework.stereotype.Component;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.token.JwtUtil;

// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

//     @Autowired
//     private JwtUtil jwtUtil ;


// //     @Override
// //     public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
// //                                         Authentication authentication) throws IOException {
// //     	OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
// //         String token = jwtUtil.generateToken(oauthUser.getAttribute("email"));

// //         System.out.println("redirect token ="+ token);

// //     //    response.sendRedirect("https://cmda.aycanalytics.com/oauth2/redirect?token=" + token);
// //           response.sendRedirect("https://cmda.aycanalytics.com/oauth2/redirect?token=" + token);

// // System.out.println("responce token="+ response);

// //     }

// @Override
// public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                     Authentication authentication) throws IOException {
//     OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
//     String email = oauthUser.getAttribute("email");
//     String token = jwtUtil.generateToken(email);
//     System.out.println("JWT token being sent: " + token);

//     System.out.println("OAuthSuccessHandler invoked for email: " + email + ", token: " + token);
//     response.sendRedirect("https://cmda.aycanalytics.com/oauth/redirect?token=" + token);
//     System.out.println("Redirecting to: https://cmda.aycanalytics.com/oauth/redirect?token=" + token);
// }

	
// }

// @Component
// @RequiredArgsConstructor
// public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Override
//     public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                         Authentication authentication) throws IOException {
//         OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
//         String token = jwtUtil.generateToken(oauthUser.getAttribute("email"));
//         System.out.println("Redirect token: " + token);
//         response.sendRedirect("https://cmda.aycanalytics.com/oauth/redirect?token=" + token);
//     }
// }