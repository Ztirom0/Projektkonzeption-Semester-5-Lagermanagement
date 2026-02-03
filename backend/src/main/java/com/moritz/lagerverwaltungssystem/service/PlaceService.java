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
    private final InventoryService inventoryService;

    public PlaceService(PlaceRepository placeRepository,
                        ZoneRepository zoneRepository,
                        ItemRepository itemRepository,
                        InventoryService inventoryService) {
        this.placeRepository = placeRepository;
        this.zoneRepository = zoneRepository;
        this.itemRepository = itemRepository;
        this.inventoryService = inventoryService;
    }

    public PlaceDTO assignItemToPlace(Long placeId, Long itemId, Integer quantity) {
        System.out.println("🔄 assignItemToPlace: placeId=" + placeId + ", itemId=" + itemId + ", quantity=" + quantity);

        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        System.out.println("✅ Found place: " + place.getCode() + ", item: " + item.getName());

        // Create inventory entry
        inventoryService.createInventory(placeId, itemId, quantity);

        System.out.println("✅ Inventory created");

        // Reload place to get updated inventory
        place = placeRepository.findById(placeId).get();
        System.out.println("✅ Place reloaded, inventory: " + place.getInventory());

        PlaceDTO result = new PlaceDTO(
                place.getId(),
                place.getCode(),
                place.getCapacity(),
                item.getId(),
                item.getName(),
                quantity
        );

        System.out.println("✅ Returning PlaceDTO: id=" + result.getId() + ", itemId=" + result.getItemId() + ", itemName=" + result.getItemName());

        return result;
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

    public PlaceDTO createPlaceAndAssign(Long zoneId, PlaceDTO dto) {
        return addPlace(zoneId, dto);
    }

}
