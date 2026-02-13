package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.AlertDTO;
import com.moritz.lagerverwaltungssystem.repository.InventoryRepository;
import org.springframework.stereotype.Service;


import java.util.List;

// Service zur Verwaltung von Bestandswarnungen
// Prüft, ob Artikel unter der Mindestmenge liegen und erstellt Meldungen
@Service
public class AlertService {

    private final InventoryRepository inventoryRepository;

    public AlertService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // Gibt alle Warnungen für unterbestände zurück
    // Filtert alle Bestände und zeigt die, die unter Minimum sind an
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
