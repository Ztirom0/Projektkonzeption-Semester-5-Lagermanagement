package com.moritz.lagerverwaltungssystem.repository;

import com.moritz.lagerverwaltungssystem.entity.StorageType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageTypeRepository extends JpaRepository<StorageType, Long> {
}
