package com.moritz.lagerverwaltungssystem.initializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moritz.lagerverwaltungssystem.dto.*;
import com.moritz.lagerverwaltungssystem.entity.*;
import com.moritz.lagerverwaltungssystem.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Component
public class WarehouseInitializer implements ApplicationRunner {

    private final ItemRepository itemRepository;
    private final LocationRepository locationRepository;
    private final StorageTypeRepository storageTypeRepository;
    private final ZoneCategoryRepository zoneCategoryRepository;
    private final ZoneRepository zoneRepository;
    private final PlaceRepository placeRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final SaleRepository saleRepository;

    public WarehouseInitializer(ItemRepository itemRepository,
                                LocationRepository locationRepository,
                                StorageTypeRepository storageTypeRepository,
                                ZoneCategoryRepository zoneCategoryRepository,
                                ZoneRepository zoneRepository,
                                PlaceRepository placeRepository,
                                InventoryRepository inventoryRepository,
                                InventoryHistoryRepository inventoryHistoryRepository,
                                SaleRepository saleRepository) {
        this.itemRepository = itemRepository;
        this.locationRepository = locationRepository;
        this.storageTypeRepository = storageTypeRepository;
        this.zoneCategoryRepository = zoneCategoryRepository;
        this.zoneRepository = zoneRepository;
        this.placeRepository = placeRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryHistoryRepository = inventoryHistoryRepository;
        this.saleRepository = saleRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        if (itemRepository.count() > 0) return;

        ObjectMapper mapper = new ObjectMapper();
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("Initializer/Data.txt");
        WarehouseData data = mapper.readValue(inputStream, WarehouseData.class);

        Map<String, Item> itemMap = new HashMap<>();
        for (ItemData d : data.items) {
            Item item = new Item(d.name, d.sku, d.unit, d.minQuantity);
            itemRepository.save(item);
            itemMap.put(d.sku, item);
        }

        Map<String, StorageType> storageTypeMap = new HashMap<>();
        for (StorageTypeData d : data.storageTypes) {
            StorageType st = new StorageType();
            st.setName(d.name);
            st.setDescription(d.description);
            storageTypeRepository.save(st);
            storageTypeMap.put(d.name, st);
        }

        Map<String, ZoneCategory> categoryMap = new HashMap<>();
        for (ZoneCategoryData d : data.zoneCategories) {
            ZoneCategory cat = new ZoneCategory(d.name);
            zoneCategoryRepository.save(cat);
            categoryMap.put(d.name, cat);
        }

        Map<String, Location> locationMap = new HashMap<>();
        for (LocationData d : data.locations) {
            Location loc = new Location();
            loc.setName(d.name);
            loc.setAddress(d.address);
            locationRepository.save(loc);
            locationMap.put(d.name, loc);
        }

        if (data.locationStorageTypes != null) {
        for (LocationStorageTypeData d : data.locationStorageTypes) {

            Location loc = locationMap.get(d.location);
            if (loc == null) {
                System.out.println("WARN: Location not found: " + d.location);
                continue;
            }

            for (String stName : d.storageTypes) {
                StorageType st = storageTypeMap.get(stName);
                if (st == null) {
                    System.out.println("WARN: StorageType not found: " + stName);
                    continue;
                }

                loc.getStorageTypes().add(st);
            }

            locationRepository.save(loc);
        }
    }


        Map<String, Zone> zoneMap = new HashMap<>();
        for (ZoneData d : data.zones) {
            Zone zone = new Zone(d.name, categoryMap.get(d.category), storageTypeMap.get(d.storageType));
            zoneRepository.save(zone);
            zoneMap.put(d.name, zone);
        }

        Map<String, Place> placeMap = new HashMap<>();
        for (PlaceData d : data.places) {
            Place place = new Place(d.code, d.capacity, zoneMap.get(d.zone));
            placeRepository.save(place);
            placeMap.put(d.code, place);
        }

        Map<Long, Inventory> inventoryByPlaceId = new HashMap<>();
        for (InventoryData d : data.inventory) {
            Item item = itemMap.get(d.itemSku);
            Place place = placeMap.get(d.placeCode);
            
            if (place == null || item == null) {
                System.out.println("WARN: Place or Item not found for inventory: " + d.placeCode + " / " + d.itemSku);
                continue;
            }

            Long placeId = place.getId();
            if (placeId == null) {
                System.out.println("WARN: Place has no id for inventory: " + d.placeCode);
                continue;
            }

            Inventory existing = inventoryByPlaceId.get(placeId);
            if (existing != null) {
                System.out.println("WARN: Duplicate inventory for place " + d.placeCode + ". Overriding item/quantity.");
                existing.setItem(item);
                existing.setQuantity(d.quantity);
                continue;
            }
            
            Inventory inv = new Inventory(place, item, d.quantity);
            inventoryRepository.save(inv);
            inventoryByPlaceId.put(placeId, inv);
        }

        for (SaleData d : data.sales) {
            Item item = itemMap.get(d.itemSku);
            if (item == null) { System.out.println("WARN: Item not found for SKU " + d.itemSku); continue; }
            LocalDate date = LocalDate.parse(d.date);
            Sale sale = new Sale(item, date, d.soldQuantity);
            saleRepository.save(sale);
        }

        if (data.inventoryHistory != null) {
            for (InventoryHistoryData d : data.inventoryHistory) {
                Item item = itemMap.get(d.itemSku);
                if (item == null) { System.out.println("WARN: Item not found for SKU " + d.itemSku); continue; }
                LocalDate date = LocalDate.parse(d.date);
                InventoryHistory history = new InventoryHistory(item, date, d.quantity);
                inventoryHistoryRepository.save(history);
            }
        }
    }
}
