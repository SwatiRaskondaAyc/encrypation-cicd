package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.prog.entity.Support;

@Repository
public interface SupportRepo extends JpaRepository<Support, Long>
{
	
	
}

