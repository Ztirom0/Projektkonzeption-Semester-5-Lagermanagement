package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    private Integer quantity;
    private Integer minQuantity;

    public Inventory() {}

    public Inventory(Item item, Place place, Integer quantity, Integer minQuantity) {
        this.item = item;
        this.place = place;
        this.quantity = quantity;
        this.minQuantity = minQuantity;
    }

    public Long getId() { return id; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public Place getPlace() { return place; }
    public void setPlace(Place place) { this.place = place; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getMinQuantity() { return minQuantity; }
    public void setMinQuantity(Integer minQuantity) { this.minQuantity = minQuantity; }
}
