package com.moritz.lagerverwaltungssystem.dto;

public class InventoryDTO {
    private Long id;
    private Long itemId;
    private Long placeId;
    private Integer quantity;
    private Integer minQuantity;

    public InventoryDTO() {}

    public InventoryDTO(Long id, Long itemId, Long placeId, Integer quantity, Integer minQuantity) {
        this.id = id;
        this.itemId = itemId;
        this.placeId = placeId;
        this.quantity = quantity;
        this.minQuantity = minQuantity;
    }

    public Long getId() { return id; }
    public Long getItemId() { return itemId; }
    public Long getPlaceId() { return placeId; }
    public Integer getQuantity() { return quantity; }
    public Integer getMinQuantity() { return minQuantity; }

    public void setId(Long id) { this.id = id; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setPlaceId(Long placeId) { this.placeId = placeId; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setMinQuantity(Integer minQuantity) { this.minQuantity = minQuantity; }
}
