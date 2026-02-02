package com.moritz.lagerverwaltungssystem.dto;

public class PlaceDTO {
    private Long id;
    private String code;
    private Integer capacity;

    public PlaceDTO() {}

    public PlaceDTO(Long id, String code, Integer capacity) {
        this.id = id;
        this.code = code;
        this.capacity = capacity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

}

