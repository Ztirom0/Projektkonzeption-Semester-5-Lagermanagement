package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneService;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage-zones")
public class StorageZoneController {

    private final ZoneService zoneService;
    private final PlaceService placeService;

    public StorageZoneController(ZoneService zoneService, PlaceService placeService) {
        this.zoneService = zoneService;
        this.placeService = placeService;
    }

    // GET /storage-types/{id}/zone
    @GetMapping("/{id}/zone")
    public List<ZoneDTO> getZones(@PathVariable Long id) {
        return zoneService.getZonesByStorageType(id);
    }

    // POST /storage-types/{id}/zones
    @PostMapping("/{id}/zones")
    public ZoneDTO addZone(@PathVariable Long id,
                                           @RequestBody ZoneDTO zoneRequest) {
        ZoneDTO created = zoneService.addZone(id, zoneRequest);
        return created;
    }

    // POST /zone/{id}/places
    @PostMapping("/zone/{id}/places")
    public PlaceDTO addPlace(@PathVariable Long id,
                                             @RequestBody PlaceDTO placeRequest) {
        PlaceDTO created = placeService.addPlace(id, placeRequest);
        return created;
    }

    // POST /places/{id}/items
    @PostMapping("/places/{id}/items")
    public PlaceDTO assignItemToPlace(@PathVariable Long id,
                                                      @RequestBody PlaceDTO itemRequest) {
        PlaceDTO updated = placeService.assignItemToPlace(id, itemRequest);
        return updated;
    }
}

