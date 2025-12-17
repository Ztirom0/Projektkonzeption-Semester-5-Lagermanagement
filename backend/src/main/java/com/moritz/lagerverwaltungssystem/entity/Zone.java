package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "zones")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "category_id")
    private ZoneCategory category;

    @ManyToOne
    @JoinColumn(name = "storage_type_id")
    private StorageType storageType;

    @OneToMany(mappedBy = "zone", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Place> places = new HashSet<>();

    public Zone() {}

    public Zone(String name, ZoneCategory category, StorageType storageType) {
        this.name = name;
        this.category = category;
        this.storageType = storageType;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ZoneCategory getCategory() { return category; }
    public void setCategory(ZoneCategory category) { this.category = category; }
    public StorageType getStorageType() { return storageType; }
    public void setStorageType(StorageType storageType) { this.storageType = storageType; }
    public Set<Place> getPlaces() { return places; }
    public void setPlaces(Set<Place> places) { this.places = places; }
}
