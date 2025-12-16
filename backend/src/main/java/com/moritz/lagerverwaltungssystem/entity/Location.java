package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "locations")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;

    @ManyToMany
    @JoinTable(
            name = "location_storage_type",
            joinColumns = @JoinColumn(name = "location_id"),
            inverseJoinColumns = @JoinColumn(name = "storage_type_id")
    )
    private Set<StorageType> storageTypes = new HashSet<>();

    public Location() {}

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<StorageType> getStorageTypes() {
        return storageTypes;
    }

    public void setStorageTypes(Set<StorageType> storageTypes) {
        this.storageTypes = storageTypes;
    }
}
