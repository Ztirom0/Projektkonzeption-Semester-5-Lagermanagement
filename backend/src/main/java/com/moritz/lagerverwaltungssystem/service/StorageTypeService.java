package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.entity.StorageType;
import com.moritz.lagerverwaltungssystem.repository.StorageTypeRepository;
import com.moritz.lagerverwaltungssystem.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service für Speichertypen
// Verwaltet verschiedene Lagerungsarten und deren Zonen
@Service
public class StorageTypeService {

    private final StorageTypeRepository storageTypeRepository;
    private final ZoneRepository zoneRepository;
    private final ZoneService zoneService;

    public StorageTypeService(StorageTypeRepository storageTypeRepository, ZoneRepository zoneRepository, ZoneService zoneService) {
        this.storageTypeRepository = storageTypeRepository;
        this.zoneRepository = zoneRepository;
        this.zoneService = zoneService;
    }

    // Gibt alle Speichertypen zurück
    public List<StorageTypeDTO> getAllStorageTypes() {
        return storageTypeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Erstellt einen neuen Speichertyp
    public StorageTypeDTO createStorageType(StorageTypeDTO dto) {
        StorageType type = new StorageType();
        type.setName(dto.getName());
        type.setDescription(dto.getDescription());

        StorageType saved = storageTypeRepository.save(type);
        return toDTO(saved);
    }

    // Gibt alle Zonen eines Speichertyps zurück
    public List<ZoneDTO> getZonesById(Long storageTypeId) {
        return zoneService.getZonesByStorageType(storageTypeId);
    }

    // Hilfsmethode: konvertiert StorageType-Entity zu DTO
    private StorageTypeDTO toDTO(StorageType type) {
        StorageTypeDTO dto = new StorageTypeDTO();
        dto.setId(type.getId());
        dto.setName(type.getName());
        dto.setDescription(type.getDescription());
        return dto;
    }
}
