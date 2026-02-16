package com.moritz.lagerverwaltungssystem.dto;

public class PlaceDTO {
    private Long id;
    private String code;
    private Integer capacity;
    private Long itemId;
    private String itemName;
    private Integer quantity;

    public PlaceDTO() {}

    public PlaceDTO(Long id, String code, Integer capacity) {
        this.id = id;
        this.code = code;
        this.capacity = capacity;
    }

    public PlaceDTO(Long id, String code, Integer capacity, Long itemId, String itemName, Integer quantity) {
        this.id = id;
        this.code = code;
        this.capacity = capacity;
        this.itemId = itemId;
        this.itemName = itemName;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}

