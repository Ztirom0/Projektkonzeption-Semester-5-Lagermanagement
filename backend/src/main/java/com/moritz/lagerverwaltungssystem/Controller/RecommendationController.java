package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.RecommendationDTO;
import com.moritz.lagerverwaltungssystem.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/recommendations")
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RecommendationDTO>> getRecommendations() {
        return ResponseEntity.ok(service.getRecommendations());
    }
}
