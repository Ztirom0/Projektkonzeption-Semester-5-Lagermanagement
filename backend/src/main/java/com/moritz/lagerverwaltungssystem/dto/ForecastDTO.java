package com.moritz.lagerverwaltungssystem.dto;

import java.time.LocalDate;

public class ForecastDTO {

    private Long itemId;
    private Integer predictedDemand;
    private LocalDate recommendedReorderDate;
    private Double confidence;

    public ForecastDTO(Long itemId, Integer predictedDemand, LocalDate recommendedReorderDate, Double confidence) {
        this.itemId = itemId;
        this.predictedDemand = predictedDemand;
        this.recommendedReorderDate = recommendedReorderDate;
        this.confidence = confidence;
    }

    public Long getItemId() { return itemId; }
    public Integer getPredictedDemand() { return predictedDemand; }
    public LocalDate getRecommendedReorderDate() { return recommendedReorderDate; }
    public Double getConfidence() { return confidence; }
}
