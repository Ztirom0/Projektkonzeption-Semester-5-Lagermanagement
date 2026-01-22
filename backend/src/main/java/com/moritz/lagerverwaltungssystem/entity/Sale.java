package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Item item;

    private LocalDate date;
    private Integer soldQuantity;

    public Sale() {}

    public Sale(Item item, LocalDate date, Integer soldQuantity) {
        this.item = item;
        this.date = date;
        this.soldQuantity = soldQuantity;
    }

    public Long getId() { return id; }
    public Item getItem() { return item; }
    public LocalDate getDate() { return date; }
    public Integer getSoldQuantity() { return soldQuantity; }
}
