package com.example.prog.entity;

import org.springframework.context.annotation.Primary;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Primary
@Entity
@Table(name="Support")

public class Support

{
	
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY) // or another strategy if needed
private Long id;

@Column(name = "UserName",nullable = false, length = 100)
private String fullname;
	 
@Column(name = "Email", unique = true, nullable = false, length = 100)
private String email;
	 
@Column(name = "Query")
private String query;

public Long getId() {
	return id;
}


public void setId(Long id) {
	this.id = id;
}

public String getFullname() {
	return fullname;
}


public void setFullname(String fullname) {
	this.fullname = fullname;
}


public String getEmail() {
	return email;
}


public void setEmail(String email) {
	this.email = email;
}


public String getQuery() {
	return query;
}


public void setQuery(String query) {
	this.query = query;
}




@Override
public String toString() {
	return "Support [id=" + id + ", fullname=" + fullname + ", email=" + email + ", query=" + query + "]";
}





}
