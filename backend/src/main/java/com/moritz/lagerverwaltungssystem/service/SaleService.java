package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.SaleDTO;
import com.moritz.lagerverwaltungssystem.repository.SaleRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class SaleService {

    private final SaleRepository repository;

    public SaleService(SaleRepository repository) {
        this.repository = repository;
    }

    public List<SaleDTO> getSales() {
        return repository.findAll().stream()
                .map(s -> new SaleDTO(
                        s.getItem().getId(),
                        s.getDate(),
                        s.getSoldQuantity()
                ))
                .toList();
    }
}
