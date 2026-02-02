package com.moritz.lagerverwaltungssystem.dto;

import java.util.List;

public class PlaceDetailDTO {
    private Long id;
    private String code;
    private Integer capacity;
    private Integer usedCapacity;
    private Double utilizationPercentage;
    private List<PlaceInventoryItemDTO> items;

    public PlaceDetailDTO() {}

    public PlaceDetailDTO(Long id, String code, Integer capacity, Integer usedCapacity, 
                         Double utilizationPercentage, List<PlaceInventoryItemDTO> items) {
        this.id = id;
        this.code = code;
        this.capacity = capacity;
        this.usedCapacity = usedCapacity;
        this.utilizationPercentage = utilizationPercentage;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getUsedCapacity() { return usedCapacity; }
    public void setUsedCapacity(Integer usedCapacity) { this.usedCapacity = usedCapacity; }

    public Double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(Double utilizationPercentage) { 
        this.utilizationPercentage = utilizationPercentage; 
    }

    public List<PlaceInventoryItemDTO> getItems() { return items; }
    public void setItems(List<PlaceInventoryItemDTO> items) { this.items = items; }
}
