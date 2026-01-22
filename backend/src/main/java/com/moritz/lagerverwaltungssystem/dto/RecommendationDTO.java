package com.moritz.lagerverwaltungssystem.dto;

public class RecommendationDTO {

    private Long itemId;
    private Integer recommendedOrder;
    private String reason;

    public RecommendationDTO(Long itemId, Integer recommendedOrder, String reason) {
        this.itemId = itemId;
        this.recommendedOrder = recommendedOrder;
        this.reason = reason;
    }

    public Long getItemId() { return itemId; }
    public Integer getRecommendedOrder() { return recommendedOrder; }
    public String getReason() { return reason; }
}
