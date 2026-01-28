package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ZoneCategoryDTO;
import com.moritz.lagerverwaltungssystem.service.ZoneCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zone-categories")
public class ZoneCategoryController {

    private final ZoneCategoryService service;

    public ZoneCategoryController(ZoneCategoryService service) {
        this.service = service;
    }

    // GET /zone-categories
    @GetMapping
    public List<ZoneCategoryDTO> getAllCategories() {
        return service.getAllCategories();
    }

    // POST /zone-categories
    @PostMapping
    public ZoneCategoryDTO addCategory(@RequestBody ZoneCategoryDTO dto) {
        return service.addCategory(dto);
    }
}
