package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "inventory")
public class Inventory implements Persistable<Long> {

    @Id
    @Column(name = "place_id")
    private Long placeId;

    @OneToOne
    @JoinColumn(name = "place_id")
    @MapsId
    private Place place;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private Integer quantity;

    @Transient
    private boolean isNew = true;

    public Inventory() {}

    public Inventory(Place place, Item item, Integer quantity) {
        this.place = place;
        this.placeId = place.getId();
        this.item = item;
        this.quantity = quantity;
        this.isNew = true;
    }

    @Override
    public Long getId() {
        return placeId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    @PostLoad
    @PostPersist
    private void markNotNew() {
        this.isNew = false;
    }

    public Long getPlaceId() { 
        return placeId; 
    }
    
    public void setPlaceId(Long placeId) { 
        this.placeId = placeId; 
    }

    public Place getPlace() { return place; }
    public void setPlace(Place place) { 
        this.place = place;
        if (place != null) {
            this.placeId = place.getId();
        }
    }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
