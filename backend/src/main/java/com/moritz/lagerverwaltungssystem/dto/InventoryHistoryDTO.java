package com.moritz.lagerverwaltungssystem.dto;

import java.time.LocalDate;

public class InventoryHistoryDTO {
    private Long itemId;
    private LocalDate date;
    private Integer quantity;

    public InventoryHistoryDTO() {}

    public InventoryHistoryDTO(Long itemId, LocalDate date, Integer quantity) {
        this.itemId = itemId;
        this.date = date;
        this.quantity = quantity;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
