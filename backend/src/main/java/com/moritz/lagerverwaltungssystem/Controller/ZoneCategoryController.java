package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneCategoryDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/zone-categories")
public class ZoneCategoryController {

    private final ZoneCategoryService service;

    public ZoneCategoryController(ZoneCategoryService service) {
        this.service = service;
    }

    // GET /zone-categories
    @GetMapping
    public ResponseEntity<List<ZoneCategoryDTO>> getAllCategories() {
        List<ZoneCategoryDTO> categories = service.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // POST /zone-categories
    @PostMapping
    public ResponseEntity<ZoneCategoryDTO> addCategory(@RequestBody ZoneCategoryDTO dto) {
        ZoneCategoryDTO created = service.addCategory(dto);
        return ResponseEntity.ok(created);
    }
}
