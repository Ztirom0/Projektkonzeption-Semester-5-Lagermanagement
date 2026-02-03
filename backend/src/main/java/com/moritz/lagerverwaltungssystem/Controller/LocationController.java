package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.LocationDTO;
import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.service.LocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<LocationDTO> getAllLocations() {
        return locationService.getAllLocations();
    }

    @PostMapping
    public LocationDTO createLocation(@RequestBody LocationDTO dto) {
        return locationService.createLocation(dto);
    }

    @PostMapping("/{id}/storage-types")
    public StorageTypeDTO createStorageType(@PathVariable Long id, @RequestBody StorageTypeDTO dto) {
        return locationService.createStorageTypeForLocation(id, dto);
    }
}
