package com.moritz.lagerverwaltungssystem.dto;

import java.time.LocalDate;

public class InventoryStatusDTO {
    private Long itemId;
    private String itemName;
    private String sku;
    private Integer currentQuantity;
    private Double dailySalesRate;
    private Integer daysRemaining;
    private Boolean reorderRecommended;
    private LocalDate reorderDate;

    public InventoryStatusDTO() {}

    public InventoryStatusDTO(Long itemId, String itemName, String sku, Integer currentQuantity,
                             Double dailySalesRate, Integer daysRemaining,
                             Boolean reorderRecommended, LocalDate reorderDate) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.sku = sku;
        this.currentQuantity = currentQuantity;
        this.dailySalesRate = dailySalesRate;
        this.daysRemaining = daysRemaining;
        this.reorderRecommended = reorderRecommended;
        this.reorderDate = reorderDate;
    }

    // Getters and Setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Integer getCurrentQuantity() { return currentQuantity; }
    public void setCurrentQuantity(Integer currentQuantity) { this.currentQuantity = currentQuantity; }

    public Double getDailySalesRate() { return dailySalesRate; }
    public void setDailySalesRate(Double dailySalesRate) { this.dailySalesRate = dailySalesRate; }

    public Integer getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(Integer daysRemaining) { this.daysRemaining = daysRemaining; }

    public Boolean getReorderRecommended() { return reorderRecommended; }
    public void setReorderRecommended(Boolean reorderRecommended) { this.reorderRecommended = reorderRecommended; }

    public LocalDate getReorderDate() { return reorderDate; }
    public void setReorderDate(LocalDate reorderDate) { this.reorderDate = reorderDate; }
}
