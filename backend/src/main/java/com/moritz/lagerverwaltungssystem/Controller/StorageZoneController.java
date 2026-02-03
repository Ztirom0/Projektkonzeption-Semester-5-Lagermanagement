package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDetailDTO;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import com.moritz.lagerverwaltungssystem.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    // POST /zones/{zoneId}/places
    @PostMapping("/zones/{zoneId}/places")
    public PlaceDTO addPlace(@PathVariable Long zoneId,
                            @RequestBody PlaceDTO placeRequest) {
        PlaceDTO created = placeService.addPlace(zoneId, placeRequest);
        return created;
    }

    // POST /places/{id}/items - Zuordnung von Item zu Place über Inventory
    @PostMapping("/places/{id}/items")
    public PlaceDTO assignItemToPlace(@PathVariable Long id,
                                      @RequestBody Map<String, Object> request) {
        Long itemId = ((Number) request.get("itemId")).longValue();
        Integer quantity = ((Number) request.get("quantity")).intValue();
        PlaceDTO updated = placeService.assignItemToPlace(id, itemId, quantity);
        return updated;
    }

    // GET /places/{id}/details - Platz-Details mit Inventory-Informationen
    @GetMapping("/places/{id}/details")
    public PlaceDetailDTO getPlaceDetails(@PathVariable Long id) {
        return inventoryService.getPlaceDetails(id);
    }
}