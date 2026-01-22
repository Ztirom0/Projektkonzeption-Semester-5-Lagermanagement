package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.RecommendationDTO;
import com.moritz.lagerverwaltungssystem.repository.InventoryRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class RecommendationService {

    private final InventoryRepository inventoryRepository;

    public RecommendationService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<RecommendationDTO> getRecommendations() {
        return inventoryRepository.findAll().stream()
                .filter(inv -> inv.getQuantity() < inv.getMinQuantity())
                .map(inv -> new RecommendationDTO(
                        inv.getItem().getId(),
                        inv.getMinQuantity() - inv.getQuantity(),
                        "Mindestbestand unterschritten"
                ))
                .toList();
    }
}
