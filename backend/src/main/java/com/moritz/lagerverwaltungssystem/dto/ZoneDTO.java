package com.moritz.lagerverwaltungssystem.dto;

import java.util.List;

public class ZoneDTO {
    private Long id;
    private String name;
    private ZoneCategoryDTO category;
    private List<PlaceDTO> places;

    public ZoneDTO() {}

    public ZoneDTO(Long id, String name, ZoneCategoryDTO category, List<PlaceDTO> places) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.places = places;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ZoneCategoryDTO getCategory() { return category; }
    public void setCategory(ZoneCategoryDTO category) { this.category = category; }

    public List<PlaceDTO> getPlaces() { return places; }
    public void setPlaces(List<PlaceDTO> places) { this.places = places; }
}
