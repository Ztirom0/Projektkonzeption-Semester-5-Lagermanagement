package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ItemDTO;
import com.moritz.lagerverwaltungssystem.entity.Item;
import com.moritz.lagerverwaltungssystem.repository.ItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

// Service für Artikelverwaltung
// Verwaltung von Produkten und deren Eigenschaften
@Service
public class ItemService {

    private final ItemRepository repository;

    public ItemService(ItemRepository repository) {
        this.repository = repository;
    }

    // Gibt alle Artikel zurück
    public List<ItemDTO> getAllItems() {
        return repository.findAll()
                .stream()
                .map(item -> new ItemDTO(item.getId(), item.getName(), item.getSku(), item.getUnit(), item.getMinQuantity()))
                .collect(Collectors.toList());
    }

    // Erstellt einen neuen Artikel
    public ItemDTO addItem(ItemDTO dto) {
        // Normalisiere SKU (Großbuchstaben, keine Leerzeichen)
        String normalizedSku = dto.getSku() == null ? null : dto.getSku().toUpperCase().trim();
        if (normalizedSku == null || normalizedSku.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU ist erforderlich");
        }
        // Prüfe auf Duplikate
        if (repository.existsBySku(normalizedSku)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU ist bereits vergeben");
        }

        Item item = new Item(dto.getName(), normalizedSku, dto.getUnit(), dto.getMinQuantity());
        Item saved = repository.save(item);
        return new ItemDTO(saved.getId(), saved.getName(), saved.getSku(), saved.getUnit(), saved.getMinQuantity());
    }
}
