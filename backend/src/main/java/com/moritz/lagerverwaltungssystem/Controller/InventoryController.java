package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.InventoryDTO;
import com.moritz.lagerverwaltungssystem.dto.InventoryHistoryDTO;
import com.moritz.lagerverwaltungssystem.dto.InventoryStatusDTO;
import com.moritz.lagerverwaltungssystem.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// REST-Endpoint für Bestandsverwaltung
// Verwaltet Bestandsdaten, Historie und Status
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Gibt alle aktuellen Bestände zurück (GET /api/inventory)
    @GetMapping
    public List<InventoryDTO> getInventory() {
        return inventoryService.getAllInventory();
    }

    // Erstellt einen neuen Bestandseintrag (POST /api/inventory)
    @PostMapping
    public InventoryDTO createInventory(@RequestBody Map<String, Object> request) {
        Long placeId = ((Number) request.get("placeId")).longValue();
        Long itemId = ((Number) request.get("itemId")).longValue();
        int quantity = ((Number) request.get("quantity")).intValue();
        int minQuantity = ((Number) request.get("minQuantity")).intValue();
        
        return inventoryService.createInventory(placeId, itemId, quantity, minQuantity);
    }

    // Gibt die Bestandshistorie eines Artikels zurück (GET /api/inventory/history/{itemId})
    @GetMapping("/history/{itemId}")
    public List<InventoryHistoryDTO> getInventoryHistory(
            @PathVariable Long itemId,
            @RequestParam(defaultValue = "180") int days) {
        return inventoryService.getInventoryHistory(itemId, days);
    }

    // Gibt den Status eines Artikels mit Verkaufsrate und Nachbestelldatum zurück (GET /api/inventory/status/{itemId})
    @GetMapping("/status/{itemId}")
    public InventoryStatusDTO getInventoryStatus(@PathVariable Long itemId) {
        return inventoryService.getInventoryStatus(itemId);
    }
}
