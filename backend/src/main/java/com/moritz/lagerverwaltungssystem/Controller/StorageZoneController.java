package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDetailDTO;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import com.moritz.lagerverwaltungssystem.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// REST-Endpoint für Lagerplätze und deren Inventory
// Verwaltet Lagerplätze und Artikel-Zuordnungen
@RestController
@RequestMapping("/api")
public class StorageZoneController {

    private final PlaceService placeService;
    private final InventoryService inventoryService;

    public StorageZoneController(PlaceService placeService,
                                 InventoryService inventoryService) {
        this.placeService = placeService;
        this.inventoryService = inventoryService;
    }

    // Erstellt einen neuen Lagerplatz in einer Zone (POST /api/zones/{zoneId}/places)
    @PostMapping("/zones/{zoneId}/places")
    public PlaceDTO addPlace(@PathVariable Long zoneId,
                            @RequestBody PlaceDTO placeRequest) {
        PlaceDTO created = placeService.addPlace(zoneId, placeRequest);
        return created;
    }

    // Ordnet einen Artikel einem Lagerplatz zu (POST /api/storage-zones/places/{id}/items)
    @PostMapping("/places/{id}/items")
    public PlaceDTO assignItemToPlace(@PathVariable Long id,
                                      @RequestBody Map<String, Object> request) {
        Long itemId = ((Number) request.get("itemId")).longValue();
        Integer quantity = ((Number) request.get("quantity")).intValue();
        PlaceDTO updated = placeService.assignItemToPlace(id, itemId, quantity);
        return updated;
    }

    // Gibt Details eines Lagerplatzes mit Bestandsinformationen zurück (GET /api/storage-zones/places/{id}/details)
    @GetMapping("/places/{id}/details")
    public PlaceDetailDTO getPlaceDetails(@PathVariable Long id) {
        return inventoryService.getPlaceDetails(id);
    }
}