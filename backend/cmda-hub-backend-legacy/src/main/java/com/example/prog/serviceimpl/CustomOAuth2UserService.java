// package com.example.prog.serviceimpl;

// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
// import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
// import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
// import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
// import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
// import org.springframework.security.oauth2.core.user.OAuth2User;
// import org.springframework.stereotype.Service;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;

// import java.time.LocalDateTime;
// import java.util.Collections;
// import java.util.Map;

// @Service
// public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

//     @Autowired
//     private UserRepository userRepository;  // Your JPA repository
    
// //    @Autowired
// //    private BCryptPasswordEncoder passwordEncoder;

//     @Override
//     public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//         OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
//         Map<String, Object> attributes = oAuth2User.getAttributes();

//         String email = (String) attributes.get("email");
//         String name = (String) attributes.get("name");
//         String picture = (String) attributes.get("picture");
        

//         if (email == null) {
//             throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
//         }

//         UserDtls user = userRepository.findByEmail(email).orElse(new UserDtls());

//         user.setEmail(email);
//         user.setFullname(name);
//         user.setProfilePictureUrl(picture);

//         if (user.getUserID() == 0) {
//             user.setRole("ROLE_USER");
//             user.setCreatedAt(LocalDateTime.now());
//         }

//         user.setUpdatedAt(LocalDateTime.now());

//         UserDtls savedUser = userRepository.save(user);
//         System.out.println("User saved successfully: " + savedUser);

//         return oAuth2User;
//     } 	
// }

package com.example.prog.serviceimpl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserRepository userRepository;  // Your JPA repository
    
//    @Autowired
//    private BCryptPasswordEncoder passwordEncoder;

//     @Override
//     public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
//         OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
//         Map<String, Object> attributes = oAuth2User.getAttributes();

//         String email = (String) attributes.get("email");
//         String name = (String) attributes.get("name");
//         String picture = (String) attributes.get("picture");
        

//         if (email == null) {
//             throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
//         }

//         UserDtls user = userRepository.findByEmail(email).orElse(new UserDtls());

//         user.setEmail(email);
//         user.setFullname(name);
//         user.setProfilePictureUrl(picture);

//         if (user.getUserID() == 0) {
//             user.setRole("ROLE_USER");
//             user.setCreatedAt(LocalDateTime.now());
//         }

//         user.setUpdatedAt(LocalDateTime.now());

//         UserDtls savedUser = userRepository.save(user);
//         System.out.println("User saved successfully: " + savedUser);

//         return oAuth2User;
//     } 	
// }

@Override
public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
    Map<String, Object> attributes = oAuth2User.getAttributes();
    String email = (String) attributes.get("email");
    String name = (String) attributes.get("name");
    String picture = (String) attributes.get("picture");
    System.out.println("Processing OAuth user: email=" + email + ", name=" + name);

    if (email == null) {
        throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
    }

    UserDtls user = userRepository.findByEmail(email).orElse(new UserDtls());
    user.setEmail(email);
    user.setFullname(name);
    user.setProfilePicture(picture);

    if (user.getUserID() == 0) {
        user.setRole("ROLE_USER");
        user.setCreatedAt(LocalDateTime.now());
    }
    user.setUpdatedAt(LocalDateTime.now());

    try {
        UserDtls savedUser = userRepository.save(user);
        System.out.println("User saved successfully: " + savedUser);
    } catch (Exception e) {
        System.err.println("Failed to save user: " + e.getMessage());
        throw new OAuth2AuthenticationException("Failed to save user to database");
    }

    return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                attributes,
                "email"
        );
}
}

