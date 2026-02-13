package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.RecommendationDTO;
import com.moritz.lagerverwaltungssystem.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Bestellempfehlungen
// Gibt Empfehlungen zur Nachbestellung basierend auf Bestand und Prognosen
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    // Gibt alle Bestellempfehlungen zurück (GET /api/recommendations)
    @GetMapping
    public List<RecommendationDTO> getRecommendations() {
        return service.getRecommendations();
    }
}
