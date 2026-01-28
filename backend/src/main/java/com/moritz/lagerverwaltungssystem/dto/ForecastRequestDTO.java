package com.moritz.lagerverwaltungssystem.dto;

public class ForecastRequestDTO {
    private Long itemId;
    private String method; // "moving-average", "linear-regression", etc.
    private Integer days; // Forecast period in days

    public ForecastRequestDTO() {}

    public ForecastRequestDTO(Long itemId, String method, Integer days) {
        this.itemId = itemId;
        this.method = method;
        this.days = days;
    }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
}
