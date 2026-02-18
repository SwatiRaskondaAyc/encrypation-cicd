package com.example.prog.service;



import org.springframework.security.core.userdetails.User;

import com.example.prog.entity.UserDtls;




public interface HomeService {

    /**
     * Saves a user after encrypting the password.
     *
     * @param user the user details
     * @return the saved user
     */
  UserDtls saveUser(UserDtls user);

    /**
     * Checks if a user exists by email.
     *
     * @param email the email to check
     * @return true if the user exists, false otherwise
     */
    boolean userExists(String email);

    /**
     * Finds a user by their email.
     *
     * @param email the email to search for
     * @return the user details, or null if not found
     */
    UserDtls findUserByEmail(String email);

	UserDtls findUserByResetToken(String token);

	User loadUserByUsername(String email);
			


}



