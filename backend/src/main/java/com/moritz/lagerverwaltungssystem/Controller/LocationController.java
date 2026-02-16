package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.LocationDTO;
import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.service.LocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Lagerverwaltung
// Verwaltet Lagerstandorte und deren Speichertypen
@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // Gibt alle Lagerstandorte zurück (GET /api/locations)
    @GetMapping
    public List<LocationDTO> getAllLocations() {
        return locationService.getAllLocations();
    }

    // Erstellt einen neuen Lagerstandort (POST /api/locations)
    @PostMapping
    public LocationDTO createLocation(@RequestBody LocationDTO dto) {
        return locationService.createLocation(dto);
    }

    // Erstellt einen neuen Speichertyp und ordnet ihn einem Lagerstandort zu (POST /api/locations/{id}/storage-types)
    @PostMapping("/{id}/storage-types")
    public StorageTypeDTO createStorageType(@PathVariable Long id, @RequestBody StorageTypeDTO dto) {
        return locationService.createStorageTypeForLocation(id, dto);
    }
}
