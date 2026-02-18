package com.example.prog.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.prog.entity.UserDtls;
import com.example.prog.repository.UserRepository;

@Controller
@RequestMapping("/user")
public class HomeController {
	
	@Autowired
	private UserRepository repo;

	@GetMapping("/home")
	public String home(Principal p, Model m) 
	{
		String email = p.getName();
	    UserDtls user = repo.findByEmail(email).orElse(null);

	    if (user != null) {
	        m.addAttribute("fullName", user.getFullname());
	        m.addAttribute("em", user.getEmail());
	    }
	    return "home";
	}
}
