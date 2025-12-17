package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.entity.Item;
import com.moritz.lagerverwaltungssystem.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository repository;

    public ItemService(ItemRepository repository) {
        this.repository = repository;
    }

    public List<ItemDTO> getAllItems() {
        return repository.findAll()
                .stream()
                .map(item -> new ItemDTO(item.getId(), item.getName(), item.getSku(), item.getUnit(), item.getMinQuantity()))
                .collect(Collectors.toList());
    }

    public ItemDTO addItem(ItemDTO dto) {
        Item item = new Item(dto.getName(), dto.getSku(), dto.getUnit(), dto.getMinQuantity());
        Item saved = repository.save(item);
        return new ItemDTO(saved.getId(), saved.getName(), saved.getSku(), saved.getUnit(), saved.getMinQuantity());
    }
}
