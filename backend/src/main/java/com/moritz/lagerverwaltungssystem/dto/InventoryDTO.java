package com.moritz.lagerverwaltungssystem.dto;

public class InventoryDTO {
    private Long placeId;
    private Long itemId;
    private Integer quantity;

    public InventoryDTO() {}

    public InventoryDTO(Long placeId, Long itemId, Integer quantity) {
        this.placeId = placeId;
        this.itemId = itemId;
        this.quantity = quantity;
    }

    public Long getPlaceId() { return placeId; }
    public Long getItemId() { return itemId; }
    public Integer getQuantity() { return quantity; }

    public void setPlaceId(Long placeId) { this.placeId = placeId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
