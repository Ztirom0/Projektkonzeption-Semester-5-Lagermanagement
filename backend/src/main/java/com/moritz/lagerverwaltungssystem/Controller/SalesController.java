package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.SaleDTO;
import com.moritz.lagerverwaltungssystem.service.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/sales")
public class SalesController {

    private final SaleService service;

    public SalesController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SaleDTO>> getSales() {
        return ResponseEntity.ok(service.getSales());
    }
}
