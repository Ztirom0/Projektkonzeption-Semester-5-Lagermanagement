package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ForecastDTO;
import com.moritz.lagerverwaltungssystem.dto.ForecastRequestDTO;
import com.moritz.lagerverwaltungssystem.dto.RecommendationDTO;
import com.moritz.lagerverwaltungssystem.entity.Inventory;
import com.moritz.lagerverwaltungssystem.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final InventoryRepository inventoryRepository;
    private final ForecastService forecastService;

    public RecommendationService(InventoryRepository inventoryRepository, ForecastService forecastService) {
        this.inventoryRepository = inventoryRepository;
        this.forecastService = forecastService;
    }

    public List<RecommendationDTO> getRecommendations() {
        List<Inventory> allInventory = inventoryRepository.findAll();
        
        // Group by itemId to get total stock per item
        Map<Long, List<Inventory>> byItem = allInventory.stream()
                .collect(Collectors.groupingBy(inv -> inv.getItem().getId()));

        List<RecommendationDTO> recommendations = new ArrayList<>();

        byItem.forEach((itemId, inventories) -> {
            int totalStock = inventories.stream().mapToInt(Inventory::getQuantity).sum();
            int minStock = inventories.stream().mapToInt(Inventory::getMinQuantity).max().orElse(0);

            if (totalStock < minStock) {
                // Critical: below minimum
                recommendations.add(new RecommendationDTO(
                        itemId,
                        minStock - totalStock + 10, // Add buffer
                        "Kritisch: Mindestbestand unterschritten"
                ));
            } else if (totalStock < minStock * 1.5) {
                // Low: approaching minimum
                try {
                    ForecastRequestDTO req = new ForecastRequestDTO(itemId, "moving-average", 14);
                    ForecastDTO forecast = forecastService.calculateForecast(req);
                    
                    int recommendedOrder = Math.max(0, forecast.getPredictedDemand() - totalStock + minStock);
                    
                    if (recommendedOrder > 0) {
                        recommendations.add(new RecommendationDTO(
                                itemId,
                                recommendedOrder,
                                "Prognose-basiert: Nachfrage steigt, Bestand niedrig"
                        ));
                    }
                } catch (Exception e) {
                    // Fallback if forecast fails
                    recommendations.add(new RecommendationDTO(
                            itemId,
                            (int) (minStock * 0.5),
                            "Niedrig: Bestand unter 150% des Minimums"
                    ));
                }
            }
        });

        return recommendations;
    }
}
