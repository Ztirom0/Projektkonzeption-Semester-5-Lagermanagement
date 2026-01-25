package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.AlertDTO;
import com.moritz.lagerverwaltungssystem.repository.InventoryRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class AlertService {

    private final InventoryRepository inventoryRepository;

    public AlertService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<AlertDTO> getAlerts() {
        return inventoryRepository.findAll().stream()
                .filter(inv -> inv.getQuantity() < inv.getMinQuantity())
                .map(inv -> new AlertDTO(
                        inv.getItem().getId(),
                        inv.getPlace().getId(),
                        inv.getQuantity(),
                        inv.getMinQuantity(),
                        "Unterschreitung"
                ))
                .toList();
    }
}
