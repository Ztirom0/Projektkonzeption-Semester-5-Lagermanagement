package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.InventoryDTO;
import com.moritz.lagerverwaltungssystem.entity.Place;
import com.moritz.lagerverwaltungssystem.repository.PlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final PlaceRepository placeRepository;

    public InventoryService(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    public List<InventoryDTO> getAllInventory() {
        return placeRepository.findAll().stream()
                .filter(p -> p.getItem() != null) // nur belegte Plätze
                .map(p -> new InventoryDTO(
                        p.getId(),
                        p.getItem().getId(),
                        p.getId(),
                        p.getQuantity(),
                        p.getItem().getMinQuantity()
                ))
                .collect(Collectors.toList());
    }
}
