package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.StorageTypeDTO;
import com.moritz.lagerverwaltungssystem.entity.StorageType;
import com.moritz.lagerverwaltungssystem.repository.StorageTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StorageTypeService {

    private final StorageTypeRepository storageTypeRepository;

    public StorageTypeService(StorageTypeRepository storageTypeRepository) {
        this.storageTypeRepository = storageTypeRepository;
    }

    public List<StorageTypeDTO> getAllStorageTypes() {
        return storageTypeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public StorageTypeDTO createStorageType(StorageTypeDTO dto) {
        StorageType type = new StorageType();
        type.setName(dto.getName());
        type.setDescription(dto.getDescription());

        StorageType saved = storageTypeRepository.save(type);
        return toDTO(saved);
    }

    private StorageTypeDTO toDTO(StorageType type) {
        StorageTypeDTO dto = new StorageTypeDTO();
        dto.setId(type.getId());
        dto.setName(type.getName());
        dto.setDescription(type.getDescription());
        return dto;
    }
}
