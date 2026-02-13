package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDetailDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneService;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import com.moritz.lagerverwaltungssystem.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// REST-Endpoint für Lagerzonen und Lagerplätze
// Verwaltet Zonen, Lagerplätze und deren Inventory
@RestController
@RequestMapping("/api/storage-zones")
public class StorageZoneController {

    private final ZoneService zoneService;
    private final PlaceService placeService;
    private final InventoryService inventoryService;

    public StorageZoneController(ZoneService zoneService, PlaceService placeService,
                                 InventoryService inventoryService) {
        this.zoneService = zoneService;
        this.placeService = placeService;
        this.inventoryService = inventoryService;
    }

    // Gibt alle Zonen eines Speichertyps zurück (GET /api/storage-zones/{id}/zone)
    @GetMapping("/{id}/zone")
    public List<ZoneDTO> getZones(@PathVariable Long id) {
        return zoneService.getZonesByStorageType(id);
    }

    // Erstellt eine neue Zone (POST /api/storage-zones/{id}/zones)
    @PostMapping("/{id}/zones")
    public ZoneDTO addZone(@PathVariable Long id,
                                           @RequestBody ZoneDTO zoneRequest) {
        ZoneDTO created = zoneService.addZone(id, zoneRequest);
        return created;
    }

    // Erstellt einen neuen Lagerplatz (POST /api/storage-zones/zone/{id}/places)
    @PostMapping("/zone/{id}/places")
    public PlaceDTO addPlace(@PathVariable Long id,
                                             @RequestBody PlaceDTO placeRequest) {
        PlaceDTO created = placeService.addPlace(id, placeRequest);
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

