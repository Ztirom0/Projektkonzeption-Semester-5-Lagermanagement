package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDetailDTO;
import com.moritz.lagerverwaltungssystem.dto.ZoneCategoryDTO;
import com.moritz.lagerverwaltungssystem.dto.ZoneDTO;
import com.moritz.lagerverwaltungssystem.entity.Item;
import com.moritz.lagerverwaltungssystem.entity.Place;
import com.moritz.lagerverwaltungssystem.entity.StorageType;
import com.moritz.lagerverwaltungssystem.entity.Zone;
import com.moritz.lagerverwaltungssystem.entity.ZoneCategory;
import com.moritz.lagerverwaltungssystem.repository.StorageTypeRepository;
import com.moritz.lagerverwaltungssystem.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service für Zonenverwaltung
// Verwaltet Lagerzonen, ihre Kategorien und enthaltenen Lagerplätze
@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final StorageTypeRepository storageTypeRepository;
    private final InventoryService inventoryService;

    public ZoneService(ZoneRepository zoneRepository, StorageTypeRepository storageTypeRepository,
                       InventoryService inventoryService) {
        this.zoneRepository = zoneRepository;
        this.storageTypeRepository = storageTypeRepository;
        this.inventoryService = inventoryService;
    }

    // Gibt alle Zonen eines Speichertyps mit ihren Plätzen und Details zurück
    public List<ZoneDTO> getZonesByStorageType(Long storageTypeId) {
        return zoneRepository.findByStorageTypeId(storageTypeId)
                .stream()
                .map(zone -> new ZoneDTO(
                        zone.getId(),
                        zone.getName(),
                        mapCategory(zone.getCategory()), // Entity → DTO
                        zone.getPlaces().stream()
                                .map(this::mapPlaceWithDetails) // Entity → DTO with details
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
    }

    // Erstellt eine neue Zone in einem Speichertyp
    public ZoneDTO addZone(Long storageTypeId, ZoneDTO dto) {
        StorageType storageType = storageTypeRepository.findById(storageTypeId)
                .orElseThrow(() -> new RuntimeException("StorageType not found"));

        ZoneCategory categoryEntity = dto.getCategory() != null
                ? new ZoneCategory(dto.getCategory().getName())
                : null;

        Zone zone = new Zone(dto.getName(), categoryEntity, storageType);
        Zone saved = zoneRepository.save(zone);

        return new ZoneDTO(saved.getId(), saved.getName(), mapCategory(saved.getCategory()), List.of());
    }

    // Hilfsmethode: konvertiert Place-Entity zu DTO
    private PlaceDTO mapPlaceWithDetails(Place place) {
        // Für ZoneDTO verwenden wir weiterhin einfache PlaceDTO
        // Die Detail-Info wird über einen separaten Endpoint geholt
        return new PlaceDTO(place.getId(), place.getCode(), place.getCapacity());
    }

    // Hilfsmethode: konvertiert ZoneCategory-Entity zu DTO
    private ZoneCategoryDTO mapCategory(ZoneCategory category) {
        return category != null
                ? new ZoneCategoryDTO(category.getId(), category.getName())
                : null;
    }
}

