package com.moritz.lagerverwaltungssystem.dto;

public class ItemDTO {
    private Long id;
    private String name;
    private String sku;
    private String unit;
    private Integer minQuantity;

    public ItemDTO() {}

    public ItemDTO(Long id, String name, String sku, String unit, Integer minQuantity) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.unit = unit;
        this.minQuantity = minQuantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Integer getMinQuantity() { return minQuantity; }
    public void setMinQuantity(Integer minQuantity) { this.minQuantity = minQuantity; }
}
