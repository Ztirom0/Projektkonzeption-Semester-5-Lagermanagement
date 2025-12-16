package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.service.StorageTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage-types")
public class StorageTypeController {

    private final StorageTypeService storageTypeService;

    public StorageTypeController(StorageTypeService storageTypeService) {
        this.storageTypeService = storageTypeService;
    }

    @GetMapping
    public List<StorageTypeDTO> getAll() {
        return storageTypeService.getAllStorageTypes();
    }

    @PostMapping
    public StorageTypeDTO create(@RequestBody StorageTypeDTO dto) {
        return storageTypeService.createStorageType(dto);
    }
}
