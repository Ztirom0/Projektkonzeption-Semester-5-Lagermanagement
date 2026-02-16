package com.moritz.lagerverwaltungssystem.repository;

import com.moritz.lagerverwaltungssystem.entity.InventoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, Long> {
    List<InventoryHistory> findByItemIdOrderByDateAsc(Long itemId);
}
