package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.service.StorageTypeService;
import com.moritz.lagerverwaltungssystem.service.ZoneService;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Speichertypen
// Verwaltet verschiedene Lagerungsarten und deren Zonen
@RestController
@RequestMapping("/api/storage-types")
public class StorageTypeController {

    private final StorageTypeService storageTypeService;
    private final ZoneService zoneService;
    private final PlaceService placeService;

    public StorageTypeController(StorageTypeService storageTypeService, ZoneService zoneService, PlaceService placeService) {
        this.storageTypeService = storageTypeService;
        this.zoneService = zoneService;
        this.placeService = placeService;
    }

    // Gibt alle Speichertypen zurück (GET /api/storage-types)
    @GetMapping
    public List<StorageTypeDTO> getAll() {
        return storageTypeService.getAllStorageTypes();
    }

    // Erstellt einen neuen Speichertyp (POST /api/storage-types)
    @PostMapping
    public StorageTypeDTO create(@RequestBody StorageTypeDTO dto) {
        return storageTypeService.createStorageType(dto);
    }

    // Gibt alle Zonen eines Speichertyps zurück (GET /api/storage-types/{id}/zones)
    @GetMapping("/{id}/zones")
    public List<ZoneDTO> getZones(@PathVariable Long id) {
        return storageTypeService.getZonesById(id);
    }

    // Erstellt eine neue Zone in einem Speichertyp (POST /api/storage-types/{id}/zones)
    @PostMapping("/{id}/zones")
    public ZoneDTO addZone(@PathVariable Long id,
                          @RequestBody ZoneDTO zoneRequest) {
        ZoneDTO created = zoneService.addZone(id, zoneRequest);
        return created;
    }
}
