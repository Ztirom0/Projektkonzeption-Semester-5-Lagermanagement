package com.moritz.lagerverwaltungssystem.repository;

import com.moritz.lagerverwaltungssystem.entity.ZoneCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ZoneCategoryRepository extends JpaRepository<ZoneCategory, Long> {
}
