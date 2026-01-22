package com.moritz.lagerverwaltungssystem.dto;

public class AlertDTO {

    private Long itemId;
    private Long placeId;
    private Integer quantity;
    private Integer minQuantity;
    private String alert;

    public AlertDTO(Long itemId, Long placeId, Integer quantity, Integer minQuantity, String alert) {
        this.itemId = itemId;
        this.placeId = placeId;
        this.quantity = quantity;
        this.minQuantity = minQuantity;
        this.alert = alert;
    }

    public Long getItemId() { return itemId; }
    public Long getPlaceId() { return placeId; }
    public Integer getQuantity() { return quantity; }
    public Integer getMinQuantity() { return minQuantity; }
    public String getAlert() { return alert; }
}
