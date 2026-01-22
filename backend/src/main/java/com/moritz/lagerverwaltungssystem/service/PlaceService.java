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

    public PlaceDTO assignItemToPlace(Long placeId, PlaceDTO dto) {
    Place place = placeRepository.findById(placeId)
            .orElseThrow(() -> new RuntimeException("Place not found"));

    // Item aus DB holen
    Item item = itemRepository.findById(dto.getItem().getId())
            .orElseThrow(() -> new RuntimeException("Item not found"));

    place.setItem(item);
    place.setQuantity(dto.getQuantity());

    Place saved = placeRepository.save(place);

    // Entity → DTO konvertieren
    ItemDTO itemDTO = new ItemDTO(
            item.getId(),
            item.getName(),
            item.getSku(),
            item.getUnit(),
            item.getMinQuantity()
    );

    return new PlaceDTO(
            saved.getId(),
            saved.getCode(),
            saved.getCapacity(),
            itemDTO,                // hier statt saved.getItem()
            saved.getQuantity()
    );
}

public PlaceDTO addPlace(Long zoneId, PlaceDTO dto) {
    Zone zone = zoneRepository.findById(zoneId)
            .orElseThrow(() -> new RuntimeException("Zone not found"));

    Place place = new Place(dto.getCode(), dto.getCapacity(), zone);
    place.setQuantity(dto.getQuantity());

    // Falls ein Item mitgegeben wird, konvertieren
    if (dto.getItem() != null) {
        Item item = itemRepository.findById(dto.getItem().getId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        place.setItem(item);
    }

    Place saved = placeRepository.save(place);

    ItemDTO itemDTO = saved.getItem() != null
            ? new ItemDTO(saved.getItem().getId(),
                          saved.getItem().getName(),
                          saved.getItem().getSku(),
                          saved.getItem().getUnit(),
                          saved.getItem().getMinQuantity())
            : null;

    return new PlaceDTO(saved.getId(),
                        saved.getCode(),
                        saved.getCapacity(),
                        itemDTO,
                        saved.getQuantity());
}


}
