package com.example.prog.serviceimpl;

import com.example.prog.entity.CorporateUser;
import com.example.prog.entity.MconsoleUser;
import com.example.prog.entity.UserDtls;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class CustomUserDetails implements UserDetails, Serializable {

    private int id;
    private String email;
    private String userType;
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean active;

    public CustomUserDetails(CorporateUser user) {
        this.id = user.getId();
        this.userType = "CORPORATE";
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.active = user.getStatus() == 1;
        String role = user.getRole();
        this.authorities = role != null ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)) : Collections.emptyList();
    }

    public CustomUserDetails(UserDtls user) {
        this.id = user.getUserID();
        this.userType = "INDIVIDUAL";
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.active = user.getStatus() == 1;
        String role = user.getRole();
        this.authorities = role != null ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)) : Collections.emptyList();
    }

    public CustomUserDetails(MconsoleUser user) {
        this.id = user.getId();
        this.userType = user.getUserType() != null ? user.getUserType().toUpperCase() : "UNKNOWN";
        this.username = user.getEmail();
        this.password = user.getPassword();
        this.active = user.isActive();
        String role = user.getRole();
        this.authorities = role != null ? Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)) : Collections.emptyList();
    }

    public int getId() {
        return id;
    }

    public String getUserType() {
        return userType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

	public String getEmail() {
		// TODO Auto-generated method stub
		return email;
	}
}