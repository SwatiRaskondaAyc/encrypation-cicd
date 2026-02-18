package com.example.prog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.prog.entity.ActivityLog;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {}

