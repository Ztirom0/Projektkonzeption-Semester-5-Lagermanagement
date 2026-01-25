package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.LocationDTO;
import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.entity.Location;
import com.moritz.lagerverwaltungssystem.entity.StorageType;
import com.moritz.lagerverwaltungssystem.repository.LocationRepository;
import com.moritz.lagerverwaltungssystem.repository.StorageTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;
    private final StorageTypeRepository storageTypeRepository;

    public LocationService(LocationRepository locationRepository, StorageTypeRepository storageTypeRepository) {
        this.locationRepository = locationRepository;
        this.storageTypeRepository = storageTypeRepository;
    }

    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public LocationDTO createLocation(LocationDTO dto) {
        Location location = new Location();
        location.setName(dto.getName());
        location.setAddress(dto.getAddress());

        Location saved = locationRepository.save(location);
        return toDTO(saved);
    }

    public void assignStorageType(Long locationId, Long storageTypeId) {
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        StorageType type = storageTypeRepository.findById(storageTypeId)
                .orElseThrow(() -> new RuntimeException("StorageType not found"));

        location.getStorageTypes().add(type);
        locationRepository.save(location);
    }

    private LocationDTO toDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setId(location.getId());
        dto.setName(location.getName());
        dto.setAddress(location.getAddress());

        dto.setStorageTypes(
                location.getStorageTypes().stream()
                        .map(st -> {
                            StorageTypeDTO s = new StorageTypeDTO();
                            s.setId(st.getId());
                            s.setName(st.getName());
                            s.setDescription(st.getDescription());
                            return s;
                        })
                        .collect(Collectors.toList())
        );

        return dto;
    }
}
