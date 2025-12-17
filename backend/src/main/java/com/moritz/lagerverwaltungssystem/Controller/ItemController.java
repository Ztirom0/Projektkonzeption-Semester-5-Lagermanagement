package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    // GET /items
    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(service.getAllItems());
    }

    // POST /items
    @PostMapping
    public ResponseEntity<ItemDTO> addItem(@RequestBody ItemDTO dto) {
        ItemDTO created = service.addItem(dto);
        return ResponseEntity.ok(created);
    }
}
