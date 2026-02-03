package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.service.StorageTypeService;
import com.moritz.lagerverwaltungssystem.service.ZoneService;
import com.moritz.lagerverwaltungssystem.service.PlaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<StorageTypeDTO> getAll() {
        return storageTypeService.getAllStorageTypes();
    }

    @PostMapping
    public StorageTypeDTO create(@RequestBody StorageTypeDTO dto) {
        return storageTypeService.createStorageType(dto);
    }

    @GetMapping("/{id}/zones")
    public List<ZoneDTO> getZones(@PathVariable Long id) {
        return storageTypeService.getZonesById(id);
    }

    @PostMapping("/{id}/zones")
    public ZoneDTO addZone(@PathVariable Long id,
                          @RequestBody ZoneDTO zoneRequest) {
        ZoneDTO created = zoneService.addZone(id, zoneRequest);
        return created;
    }
}
