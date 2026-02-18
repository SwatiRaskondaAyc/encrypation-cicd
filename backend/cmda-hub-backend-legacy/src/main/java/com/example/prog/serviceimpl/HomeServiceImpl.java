// package com.example.prog.serviceimpl;

// import java.util.ArrayList;
// import java.util.Optional;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;
// import com.example.prog.service.HomeService;
// @Service
// public class HomeServiceImpl implements HomeService 
// {


// 	 @Autowired
// 	    private UserRepository repo;

// 	    @Autowired
// 	    private BCryptPasswordEncoder bp;
	    
	    
// 	    private UserDtls saveddUser;

// 	    /**
// 	     * Saves a user after encrypting the password.
// 	     *
// 	     * @param user the user details
// 	     * @return the saved user
// 	     */
// 	    @Transactional
// 	    @Override
// 	    public UserDtls saveUser(UserDtls user)
// 	    {
// 	        // Check if user is null
// 	        if (user == null) {
// 	            throw new IllegalArgumentException("User cannot be null");
// 	        }

// 	        // Encrypt the user's password
// 	        user.setPassword(bp.encode(user.getPassword()));

// 	        // Set a default role if not provided
// 	        if (user.getRole() == null || user.getRole().isEmpty()) {
// 	            user.setRole("ROLE_USER");
// 	        }

// 	        // Save the user and handle any potential exceptions
// 	        try {
// 	            return repo.save(user);
// 	        } catch (Exception e) {
// 	            throw new RuntimeException("Error saving user: " + e.getMessage(), e);
// 	        }
// 	    }
// //	   
// //	    public UserDtls saveUser(UserDtls user) {
// //	    	
// //	    	 UserDtls savedUser = null;
// //			try {
// //				savedUser = HomeService.saveUser(saveUser(null));
// //			} catch (Exception e) {
// //				// TODO Auto-generated catch block
// //				e.printStackTrace();
// //			}
// //	 	    if (savedUser == null) {
// //	 	        throw new RuntimeException("User not saved!");
// //	 	    }
// //
// //	        // Encrypt the user's password
// //	        user.setPassword(bp.encode(user.getPassword()));
// //
// //	        // Set a default role if not provided
// //	        if (user.getRole() == null || user.getRole().isEmpty()) {
// //	            user.setRole("ROLE_USER");
// //	        }
// //
// //	        // Save the user to the repository
// //	        return repo.save(user);
// //	    }

// 	    @Override
// 	    public UserDtls findUserByResetToken(String token) {
	    	
// //	    	 Optional<UserDtls> user = repo.findByResetToken(token);
// //	         return user.orElse(null);
// 	        return repo.findByResetToken(token);
// 	    }
 
// //	    @Override
// //	    public void saveUser(UserDtls user)
// //	    {
// //	       repo.save(user);
// //	    }
	    
	    
	   
// 	    /**
// 	     * Checks if a user exists by email.
// 	     *
// 	     * @param email the email to check
// 	     * @return true if the user exists, false otherwise
// 	     */
// 	    @Override
// 	    public boolean userExists(String email) {
// 	        return repo.findByEmail(email) != null;
// 	    }

// 	    /**
// 	     * Finds a user by their email.
// 	     *
// 	     * @param email the email to search for
// 	     * @return the user details, or null if not found
// 	     */
// 	    @Override
// 	    public UserDtls findUserByEmail(String email) {
// 	        return repo.findByEmail(email).orElse(saveddUser);
// 	    }
// 	    @Override
// 	    public User loadUserByUsername(String email) throws UsernameNotFoundException {
// 	    	UserDtls user = repo.findByEmail(email).orElse(saveddUser);
// 	        if (user == null) {
// 	            throw new UsernameNotFoundException("User not found with email: " + email);
// 	        }
// 	        return new org.springframework.security.core.userdetails.User(
// 	                user.getEmail(),
// 	                user.getPassword(),
// 	                new ArrayList<>() // Add roles if needed
// 	        );
// 	    }


	  
	    

		
		
// 	}


package com.example.prog.serviceimpl;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;
import com.example.prog.service.HomeService;

@Service
public class HomeServiceImpl implements HomeService {
    @Autowired
    private UserRepository repo;

    @Autowired
    private BCryptPasswordEncoder bp;

    private UserDtls saveddUser;

    @Transactional
    @Override
    public UserDtls saveUser(UserDtls user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        // Only encode password if it’s not already a hash (e.g., during registration)
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(bp.encode(user.getPassword()));
        }

        // Set a default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }

        try {
            return repo.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Error saving user: " + e.getMessage(), e);
        }
    }

    @Override
    public UserDtls findUserByResetToken(String token) {
        return repo.findByResetToken(token);
    }

    @Override
    public boolean userExists(String email) {
        return repo.findByEmail(email) != null;
    }

    @Override
    public UserDtls findUserByEmail(String email) {
        return repo.findByEmail(email).orElse(null); // Remove saveddUser fallback
    }

    @Override
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDtls user = repo.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Add roles if needed
        );
    }
}




