package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ForecastDTO;
import com.moritz.lagerverwaltungssystem.dto.ForecastRequestDTO;
import com.moritz.lagerverwaltungssystem.repository.SaleRepository;
import com.moritz.lagerverwaltungssystem.entity.Sale;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
public class ForecastService {

    private final SaleRepository saleRepository;

    public ForecastService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public ForecastDTO calculateForecast(ForecastRequestDTO req) {

        List<Sale> sales = saleRepository.findByItemIdOrderByDateAsc(req.getItemId());

        int window = 3;
        double avg = sales.stream()
                .skip(Math.max(0, sales.size() - window))
                .mapToInt(Sale::getSoldQuantity)
                .average()
                .orElse(0);

        return new ForecastDTO(
                req.getItemId(),
                (int) avg,
                LocalDate.now().plusDays(7),
                0.87
        );
    }
}
