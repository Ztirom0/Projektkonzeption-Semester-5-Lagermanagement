package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.SaleDTO;
import com.moritz.lagerverwaltungssystem.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Verkaufsverwaltung
// Verwaltet Verkaufsaufzeichnungen
@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SaleService service;

    public SalesController(SaleService service) {
        this.service = service;
    }

    // Gibt alle erfassten Verkäufe zurück (GET /api/sales)
    @GetMapping
    public List<SaleDTO> getSales() {
        return service.getSales();
    }
}
