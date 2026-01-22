package com.moritz.lagerverwaltungssystem.repository;

import com.moritz.lagerverwaltungssystem.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}
