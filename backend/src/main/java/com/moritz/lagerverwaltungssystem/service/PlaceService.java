package com.moritz.lagerverwaltungssystem.service;

import java.util.List;
import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.dto.PlaceDTO;
import com.moritz.lagerverwaltungssystem.entity.Item;
import com.moritz.lagerverwaltungssystem.entity.Place;
import com.moritz.lagerverwaltungssystem.entity.Zone;
import com.moritz.lagerverwaltungssystem.repository.ItemRepository;
import com.moritz.lagerverwaltungssystem.repository.PlaceRepository;
import com.moritz.lagerverwaltungssystem.repository.ZoneRepository;
import org.springframework.stereotype.Service;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final ZoneRepository zoneRepository;
    private final ItemRepository itemRepository;

    public PlaceService(PlaceRepository placeRepository,
                        ZoneRepository zoneRepository,
                        ItemRepository itemRepository) {
        this.placeRepository = placeRepository;
        this.zoneRepository = zoneRepository;
        this.itemRepository = itemRepository;
    }

    public PlaceDTO assignItemToPlace(Long placeId, Long itemId, Integer quantity) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Inventory-Eintrag erstellen/aktualisieren über InventoryService
        // Die Item- und Quantity-Zuordnung erfolgt über die Inventory-Tabelle

        return new PlaceDTO(
                place.getId(),
                place.getCode(),
                place.getCapacity()
        );
    }

public PlaceDTO addPlace(Long zoneId, PlaceDTO dto) {
    Zone zone = zoneRepository.findById(zoneId)
            .orElseThrow(() -> new RuntimeException("Zone not found"));

    Place place = new Place(dto.getCode(), dto.getCapacity(), zone);
    Place saved = placeRepository.save(place);

    return new PlaceDTO(saved.getId(),
                        saved.getCode(),
                        saved.getCapacity());
}


}
