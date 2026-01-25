package com.moritz.lagerverwaltungssystem.initializer;

import com.moritz.lagerverwaltungssystem.entity.*;
import com.moritz.lagerverwaltungssystem.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class WarehouseInitializer implements ApplicationRunner {

    private final ItemRepository itemRepository;
    private final LocationRepository locationRepository;
    private final StorageTypeRepository storageTypeRepository;
    private final ZoneCategoryRepository zoneCategoryRepository;
    private final ZoneRepository zoneRepository;
    private final PlaceRepository placeRepository;
    private final InventoryRepository inventoryRepository;

    public WarehouseInitializer(ItemRepository itemRepository,
                                LocationRepository locationRepository,
                                StorageTypeRepository storageTypeRepository,
                                ZoneCategoryRepository zoneCategoryRepository,
                                ZoneRepository zoneRepository,
                                PlaceRepository placeRepository,
                                InventoryRepository inventoryRepository) {
        this.itemRepository = itemRepository;
        this.locationRepository = locationRepository;
        this.storageTypeRepository = storageTypeRepository;
        this.zoneCategoryRepository = zoneCategoryRepository;
        this.zoneRepository = zoneRepository;
        this.placeRepository = placeRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public void run(ApplicationArguments args) {

        if (itemRepository.count() > 0) return;

        List<Item> items = List.of(
                new Item("Hammer", "SKU001", "Stück", 10),
                new Item("Schraubenzieher", "SKU002", "Stück", 5),
                new Item("Bohrmaschine", "SKU003", "Stück", 2),
                new Item("Druckerpapier", "SKU004", "Paket", 20),
                new Item("Toner", "SKU005", "Stück", 3),
                new Item("Ordner", "SKU006", "Stück", 15),
                new Item("Klebeband", "SKU007", "Rolle", 10),
                new Item("Etiketten", "SKU008", "Packung", 25),
                new Item("Schutzbrille", "SKU009", "Stück", 5),
                new Item("Handschuhe", "SKU010", "Paar", 10)
        );
        itemRepository.saveAll(items);

        Location loc1 = new Location();
        loc1.setName("Stuttgart");
        loc1.setAddress("Stuttgart");

        Location loc2 = new Location();
        loc2.setName("Heilbronn");
        loc2.setAddress("Heilbronn");

        locationRepository.saveAll(List.of(loc1, loc2));

        StorageType st1 = new StorageType();
        st1.setName("Hochregal");
        st1.setDescription("Für schwere Artikel");

        StorageType st2 = new StorageType();
        st2.setName("Kleinteilelager");
        st2.setDescription("Für Bürobedarf");

        storageTypeRepository.saveAll(List.of(st1, st2));

        loc1.setStorageTypes(Set.of(st1, st2));
        loc2.setStorageTypes(Set.of(st1));
        locationRepository.saveAll(List.of(loc1, loc2));

        ZoneCategory cat1 = new ZoneCategory("A-Artikel");
        ZoneCategory cat2 = new ZoneCategory("Kühlbereich");

        zoneCategoryRepository.saveAll(List.of(cat1, cat2));

        Zone z1 = new Zone("Zone A", cat1, st1);
        Zone z2 = new Zone("Zone B", cat2, st2);
        Zone z3 = new Zone("Zone C", cat1, st1);
        Zone z4 = new Zone("Zone D", cat2, st2);
        Zone z5 = new Zone("Zone E", cat1, st2);

        zoneRepository.saveAll(List.of(z1, z2, z3, z4, z5));

        Place p1 = new Place("A-01-01", 100, z1);
        Place p2 = new Place("B-01-01", 80, z2);
        Place p3 = new Place("C-01-01", 60, z3);
        Place p4 = new Place("D-01-01", 40, z4);
        Place p5 = new Place("E-01-01", 50, z5);

        placeRepository.saveAll(List.of(p1, p2, p3, p4, p5));

        List<Inventory> inventories = List.of(
                new Inventory(items.get(0), p1, 50, items.get(0).getMinQuantity()),
                new Inventory(items.get(1), p1, 30, items.get(1).getMinQuantity()),
                new Inventory(items.get(2), p1, 10, items.get(2).getMinQuantity()),
                new Inventory(items.get(3), p2, 40, items.get(3).getMinQuantity()),
                new Inventory(items.get(4), p2, 15, items.get(4).getMinQuantity()),
                new Inventory(items.get(5), p2, 25, items.get(5).getMinQuantity()),
                new Inventory(items.get(6), p3, 35, items.get(6).getMinQuantity()),
                new Inventory(items.get(7), p3, 20, items.get(7).getMinQuantity()),
                new Inventory(items.get(8), p4, 12, items.get(8).getMinQuantity()),
                new Inventory(items.get(9), p5, 18, items.get(9).getMinQuantity())
        );

        inventoryRepository.saveAll(inventories);
    }
}
