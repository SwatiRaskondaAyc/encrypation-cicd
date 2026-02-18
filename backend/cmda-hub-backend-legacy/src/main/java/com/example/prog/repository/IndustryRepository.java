package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.prog.entity.Industry;

import java.util.List;

@Repository
public interface IndustryRepository extends JpaRepository<Industry, Integer> {

    @Query("SELECT i FROM Industry i JOIN i.materials m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :material, '%'))")
    List<Industry> findIndustriesByMaterial(String material);
}
