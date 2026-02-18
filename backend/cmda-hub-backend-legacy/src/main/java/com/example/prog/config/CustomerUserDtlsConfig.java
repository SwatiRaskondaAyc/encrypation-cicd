// package com.example.prog.config;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;
// import com.example.prog.entity.UserDtls;
// import com.example.prog.repository.UserRepository;

// @Service
// public class CustomerUserDtlsConfig implements UserDetailsService {

//     @Autowired
//     private UserRepository repo;

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//         UserDtls user = repo.findByEmail(email).orElse(null);
//         if (user == null) {
//             throw new UsernameNotFoundException("No User Found with email: " + email);
//         }
//         return new CustomerUserDtls(user);  // Ensure CustomerUserDtls implements UserDetails
//     }
// }

package com.example.prog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;

@Service
public class CustomerUserDtlsConfig implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserDtls user = repo.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UsernameNotFoundException("No User Found with email: " + email);
        }
        if (user.getStatus() == 0) {
            throw new UsernameNotFoundException("User account is deactivated: " + email);
        }
        return new CustomerUserDtls(user);  // Ensure CustomerUserDtls implements UserDetails
    }
}
