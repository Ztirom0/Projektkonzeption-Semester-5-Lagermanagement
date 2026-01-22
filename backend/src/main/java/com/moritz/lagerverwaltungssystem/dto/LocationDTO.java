package com.moritz.lagerverwaltungssystem.dto;

import java.util.List;

public class LocationDTO {

    private Long id;
    private String name;
    private String address;
    private List<StorageTypeDTO> storageTypes;

    public LocationDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<StorageTypeDTO> getStorageTypes() {
        return storageTypes;
    }

    public void setStorageTypes(List<StorageTypeDTO> storageTypes) {
        this.storageTypes = storageTypes;
    }
}
