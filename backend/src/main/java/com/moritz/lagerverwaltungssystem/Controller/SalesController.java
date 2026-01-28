package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.SaleDTO;
import com.moritz.lagerverwaltungssystem.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SaleService service;

    public SalesController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public List<SaleDTO> getSales() {
        return service.getSales();
    }
}
