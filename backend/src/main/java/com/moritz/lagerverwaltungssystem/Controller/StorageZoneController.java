package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneService;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/storage-types")
public class StorageZoneController {

    private final ZoneService zoneService;
    private final PlaceService placeService;

    public StorageZoneController(ZoneService zoneService, PlaceService placeService) {
        this.zoneService = zoneService;
        this.placeService = placeService;
    }

    // GET /storage-types/{id}/zone
    @GetMapping("/{id}/zone")
    public ResponseEntity<List<ZoneDTO>> getZones(@PathVariable Long id) {
        return ResponseEntity.ok(zoneService.getZonesByStorageType(id));
    }

    // POST /storage-types/{id}/zones
    @PostMapping("/{id}/zones")
    public ResponseEntity<ZoneDTO> addZone(@PathVariable Long id,
                                           @RequestBody ZoneDTO zoneRequest) {
        ZoneDTO created = zoneService.addZone(id, zoneRequest);
        return ResponseEntity.ok(created);
    }

    // POST /zone/{id}/places
    @PostMapping("/zone/{id}/places")
    public ResponseEntity<PlaceDTO> addPlace(@PathVariable Long id,
                                             @RequestBody PlaceDTO placeRequest) {
        PlaceDTO created = placeService.addPlace(id, placeRequest);
        return ResponseEntity.ok(created);
    }

    // POST /places/{id}/items
    @PostMapping("/places/{id}/items")
    public ResponseEntity<PlaceDTO> assignItemToPlace(@PathVariable Long id,
                                                      @RequestBody PlaceDTO itemRequest) {
        PlaceDTO updated = placeService.assignItemToPlace(id, itemRequest);
        return ResponseEntity.ok(updated);
    }
}

