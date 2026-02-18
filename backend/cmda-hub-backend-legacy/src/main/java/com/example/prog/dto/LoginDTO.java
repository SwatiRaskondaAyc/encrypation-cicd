package com.example.prog.dto;

import lombok.Data;

@Data
public class LoginDTO {
   
    private String email;
    private String password;
     private Boolean subscribeToCMDA;
    
//    private String corporateEmail;
  
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

        	public Boolean getSubscribeToCMDA() {
		return subscribeToCMDA;
	}
	public void setSubscribeToCMDA(Boolean subscribeToCMDA) {
		this.subscribeToCMDA = subscribeToCMDA;
	}

	
//	 public String getCorporateEmail() {
//	        return corporateEmail;
//	    }
//
//	    public void setCorporateEmail(String corporateEmail) {
//	        this.corporateEmail = corporateEmail;
//	    }
	    
	
	
}

