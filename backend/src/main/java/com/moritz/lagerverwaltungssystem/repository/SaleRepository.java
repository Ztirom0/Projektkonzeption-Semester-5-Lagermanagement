package com.moritz.lagerverwaltungssystem.repository;

import com.moritz.lagerverwaltungssystem.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByItemIdOrderByDateAsc(Long itemId);
}
