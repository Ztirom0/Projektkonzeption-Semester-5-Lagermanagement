package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneCategoryDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Zonenkategorien
// Verwaltet Kategorien zur Klassifizierung von Lagerzonen
@RestController
@RequestMapping("/api/zone-categories")
public class ZoneCategoryController {

    private final ZoneCategoryService service;

    public ZoneCategoryController(ZoneCategoryService service) {
        this.service = service;
    }

    // Gibt alle Zonenkategorien zurück (GET /api/zone-categories)
    @GetMapping
    public List<ZoneCategoryDTO> getAllCategories() {
        return service.getAllCategories();
    }

    // Erstellt eine neue Zonenkategorie (POST /api/zone-categories)
    @PostMapping
    public ZoneCategoryDTO addCategory(@RequestBody ZoneCategoryDTO dto) {
        return service.addCategory(dto);
    }
}
