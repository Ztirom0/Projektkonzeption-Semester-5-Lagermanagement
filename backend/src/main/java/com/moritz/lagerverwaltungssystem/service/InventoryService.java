package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.InventoryDTO;
import com.moritz.lagerverwaltungssystem.dto.InventoryHistoryDTO;
import com.moritz.lagerverwaltungssystem.dto.InventoryStatusDTO;
import com.moritz.lagerverwaltungssystem.entity.Inventory;
import com.moritz.lagerverwaltungssystem.entity.InventoryHistory;
import com.moritz.lagerverwaltungssystem.entity.Item;
import com.moritz.lagerverwaltungssystem.entity.Place;
import com.moritz.lagerverwaltungssystem.entity.Sale;
import com.moritz.lagerverwaltungssystem.repository.InventoryRepository;
import com.moritz.lagerverwaltungssystem.repository.InventoryHistoryRepository;
import com.moritz.lagerverwaltungssystem.repository.ItemRepository;
import com.moritz.lagerverwaltungssystem.repository.PlaceRepository;
import com.moritz.lagerverwaltungssystem.repository.SaleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final PlaceRepository placeRepository;
    private final ItemRepository itemRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final SaleRepository saleRepository;
    private static final int REORDER_LEAD_TIME_DAYS = 5; // Nachbestellpuffer in Tagen

    public InventoryService(PlaceRepository placeRepository, ItemRepository itemRepository, 
                           InventoryRepository inventoryRepository, InventoryHistoryRepository inventoryHistoryRepository,
                           SaleRepository saleRepository) {
        this.placeRepository = placeRepository;
        this.itemRepository = itemRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryHistoryRepository = inventoryHistoryRepository;
        this.saleRepository = saleRepository;
    }

    public List<InventoryDTO> getAllInventory() {
        return inventoryRepository.findAll().stream()
                .map(inv -> new InventoryDTO(
                        inv.getId(),
                        inv.getItem().getId(),
                        inv.getPlace().getId(),
                        inv.getQuantity(),
                        inv.getMinQuantity()
                ))
                .collect(Collectors.toList());
    }

    public InventoryDTO createInventory(Long placeId, Long itemId, int quantity, int minQuantity) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Place not found"));
        
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Inventory inventory = new Inventory(item, place, quantity, minQuantity);
        Inventory saved = inventoryRepository.save(inventory);

        return new InventoryDTO(saved.getId(), item.getId(), place.getId(), quantity, minQuantity);
    }

    public List<InventoryHistoryDTO> getInventoryHistory(Long itemId, int days) {
        // Verify item exists
        itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Fetch ALL historical data for this item, sorted by date
        return inventoryHistoryRepository
                .findByItemIdOrderByDateAsc(itemId)
                .stream()
                .map(h -> new InventoryHistoryDTO(h.getItem().getId(), h.getDate(), h.getQuantity()))
                .collect(Collectors.toList());
    }

    public InventoryStatusDTO getInventoryStatus(Long itemId) {
        // Get item
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Get current inventory (sum of all places for this item)
        Integer currentQuantity = inventoryRepository.findAll().stream()
                .filter(inv -> inv.getItem().getId().equals(itemId))
                .mapToInt(Inventory::getQuantity)
                .sum();

        // Get sales from last 7 days to calculate daily rate
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        List<Sale> recentSales = saleRepository.findByItemIdOrderByDateAsc(itemId).stream()
                .filter(s -> s.getDate().isAfter(sevenDaysAgo))
                .toList();

        double dailySalesRate = recentSales.stream()
                .mapToInt(Sale::getSoldQuantity)
                .sum() / 7.0; // Average over 7 days

        // Calculate days remaining
        int daysRemaining = 0;
        if (dailySalesRate > 0) {
            daysRemaining = (int) Math.floor(currentQuantity / dailySalesRate);
        }

        // Reorder recommended if less than lead time days remaining
        boolean reorderRecommended = daysRemaining <= REORDER_LEAD_TIME_DAYS;
        LocalDate reorderDate = LocalDate.now().plusDays(Math.max(0, daysRemaining - REORDER_LEAD_TIME_DAYS));

        return new InventoryStatusDTO(
                itemId,
                item.getName(),
                item.getSku(),
                currentQuantity,
                dailySalesRate,
                daysRemaining,
                reorderRecommended,
                reorderDate
        );
    }
}
