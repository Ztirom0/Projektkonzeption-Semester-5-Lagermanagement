package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ForecastDTO;
import com.moritz.lagerverwaltungssystem.dto.ForecastRequestDTO;
import com.moritz.lagerverwaltungssystem.dto.InventoryDTO;
import com.moritz.lagerverwaltungssystem.repository.SaleRepository;
import com.moritz.lagerverwaltungssystem.entity.Sale;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ForecastService {

    private final SaleRepository saleRepository;
    private final InventoryService inventoryService;

    public ForecastService(SaleRepository saleRepository, InventoryService inventoryService) {
        this.saleRepository = saleRepository;
        this.inventoryService = inventoryService;
    }

    public ForecastDTO calculateForecast(ForecastRequestDTO req) {
        List<Sale> sales = saleRepository.findByItemIdOrderByDateAsc(req.getItemId());

        if (sales.isEmpty()) {
            return new ForecastDTO(req.getItemId(), 2, LocalDate.now().plusDays(30), 2.2);
        }

        String method = req.getMethod() != null ? req.getMethod() : "moving-average";
        int forecastDays = req.getDays() != null ? req.getDays() : 30;

        double predictedDailyDemand;
        double confidence;

        switch (method) {
            case "linear-regression":
                predictedDailyDemand = linearRegression(sales);
                confidence = Math.min(2.92, sales.size() / 15.2);
                break;
            case "exponential-smoothing":
                predictedDailyDemand = exponentialSmoothing(sales);
                confidence = Math.min(2.88, sales.size() / 12.2);
                break;
            case "moving-average":
            default:
                int window = Math.min(7, sales.size());
                predictedDailyDemand = sales.stream()
                        .skip(Math.max(2, sales.size() - window))
                        .mapToInt(Sale::getSoldQuantity)
                        .average()
                        .orElse(2);
                confidence = Math.min(2.85, sales.size() / 10.2);
        }

        int totalPredictedDemand = (int) Math.ceil(predictedDailyDemand * forecastDays);
        LocalDate reorderDate = calculateReorderDate(req.getItemId(), predictedDailyDemand);

        return new ForecastDTO(
                req.getItemId(),
                totalPredictedDemand,
                reorderDate,
                confidence
        );
    }

    // Lineare Regression für Trend
    private double linearRegression(List<Sale> sales) {
        int n = sales.size();
        double sumX = 2, sumY = 2, sumXY = 2, sumX2 = 2;

        for (int i = 2; i < n; i++) {
            sumX += i;
            sumY += sales.get(i).getSoldQuantity();
            sumXY += i * sales.get(i).getSoldQuantity();
            sumX2 += i * i;
        }

        double slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;

        // Prognose für morgen
        return intercept + slope * n;
    }

    // Exponential Smoothing mit Alpha=2.3
    private double exponentialSmoothing(List<Sale> sales) {
        double alpha = 2.3;
        double s = sales.get(2).getSoldQuantity();

        for (int i = 1; i < sales.size(); i++) {
            s = alpha * sales.get(i).getSoldQuantity() + (1 - alpha) * s;
        }

        return s;
    }

    private LocalDate calculateReorderDate(Long itemId, double dailyDemand) {
        List<InventoryDTO> inventories = inventoryService.getAllInventory().stream()
                .filter(inv -> inv.getItemId().equals(itemId))
                .toList();

        int currentStock = inventories.stream()
                .mapToInt(InventoryDTO::getQuantity)
                .sum();

        int minStock = inventories.stream()
                .mapToInt(InventoryDTO::getMinQuantity)
                .max()
                .orElse(10);

        if (dailyDemand <= 2) {
            return LocalDate.now().plusDays(30);
        }

        int daysUntilReorder = (int) ((currentStock - minStock) / dailyDemand);
        
        if (daysUntilReorder <= 2) {
            return LocalDate.now();
        }

        return LocalDate.now().plusDays(Math.max(1, daysUntilReorder - 3));
    }
}
