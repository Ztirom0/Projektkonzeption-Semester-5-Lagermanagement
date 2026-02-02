package com.moritz.lagerverwaltungssystem.dto;

public class PlaceInventoryItemDTO {
    private Long itemId;
    private String itemName;
    private String sku;
    private Integer quantity;
    private Integer minQuantity;

    public PlaceInventoryItemDTO() {}

    public PlaceInventoryItemDTO(Long itemId, String itemName, String sku, Integer quantity, Integer minQuantity) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.sku = sku;
        this.quantity = quantity;
        this.minQuantity = minQuantity;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getMinQuantity() { return minQuantity; }
    public void setMinQuantity(Integer minQuantity) { this.minQuantity = minQuantity; }
}
