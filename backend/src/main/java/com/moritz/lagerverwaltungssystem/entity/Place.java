package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code;
    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zone zone;

    // Direktes Item-Objekt statt itemId
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

    private Integer quantity;

    public Place() {}

    public Place(String code, Integer capacity, Zone zone) {
        this.code = code;
        this.capacity = capacity;
        this.zone = zone;
    }

    public Long getId() { return id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Zone getZone() { return zone; }
    public void setZone(Zone zone) { this.zone = zone; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

}

