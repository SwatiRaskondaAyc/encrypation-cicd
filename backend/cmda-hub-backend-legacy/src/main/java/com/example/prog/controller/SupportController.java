
	

	package com.example.prog.controller;

	import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.*;
	import com.example.prog.entity.Support;
	import com.example.prog.service.SupportService;

	@RestController
	
	@RequestMapping("/api/support")
	
	

	public class SupportController 

	{
		
		 @Value("${frontend.url}") // Inject frontend URL
		 private String frontendUrl;

	    @Autowired
	    private SupportService supportService;
	    
	    @GetMapping("/")
	    public String support()
	    {
	        return "support"; 
	    }
//	    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
	    @CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
	    @PostMapping("/support")
	    public ResponseEntity<String> submitSupport(@RequestBody Support support) {
	        Support savedSupport = supportService.saveSupport(support);
	        return new ResponseEntity<>("Support request saved with ID: " + savedSupport.hashCode(), HttpStatus.CREATED);
	    }
	}



