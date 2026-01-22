package com.moritz.lagerverwaltungssystem.dto;

public class ForecastRequestDTO {

    private Long itemId;
    private String method;

    public ForecastRequestDTO() {}

    public Long getItemId() { return itemId; }
    public String getMethod() { return method; }
}
