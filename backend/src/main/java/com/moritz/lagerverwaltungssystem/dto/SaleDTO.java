package com.moritz.lagerverwaltungssystem.dto;

import java.time.LocalDate;

public class SaleDTO {

    private Long itemId;
    private LocalDate date;
    private Integer soldQuantity;

    public SaleDTO(Long itemId, LocalDate date, Integer soldQuantity) {
        this.itemId = itemId;
        this.date = date;
        this.soldQuantity = soldQuantity;
    }

    public Long getItemId() { return itemId; }
    public LocalDate getDate() { return date; }
    public Integer getSoldQuantity() { return soldQuantity; }
}
