package com.moritz.lagerverwaltungssystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "zone_categories")
public class ZoneCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    public ZoneCategory() {}

    public ZoneCategory(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
