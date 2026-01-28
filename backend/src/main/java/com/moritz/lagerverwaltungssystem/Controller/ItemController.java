package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.service.ItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    // GET /items
    @GetMapping
    public List<ItemDTO> getAllItems() {
        return service.getAllItems();
    }

    // POST /items
    @PostMapping
    public ItemDTO addItem(@RequestBody ItemDTO dto) {
        ItemDTO created = service.addItem(dto);
        return created;
    }
}
