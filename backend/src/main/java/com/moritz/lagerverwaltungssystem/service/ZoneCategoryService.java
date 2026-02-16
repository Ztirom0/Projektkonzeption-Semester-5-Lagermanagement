package com.moritz.lagerverwaltungssystem.service;

import com.moritz.lagerverwaltungssystem.dto.ZoneCategoryDTO;
import com.moritz.lagerverwaltungssystem.entity.ZoneCategory;
import com.moritz.lagerverwaltungssystem.repository.ZoneCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// Service für Zonenkategorien
// Verwaltet Kategorien zur Klassifizierung von Lagerzonen
@Service
public class ZoneCategoryService {

    private final ZoneCategoryRepository repository;

    public ZoneCategoryService(ZoneCategoryRepository repository) {
        this.repository = repository;
    }

    // Gibt alle Zonenkategorien zurück
    public List<ZoneCategoryDTO> getAllCategories() {
        return repository.findAll()
                .stream()
                .map(cat -> new ZoneCategoryDTO(cat.getId(), cat.getName()))
                .collect(Collectors.toList());
    }

    // Erstellt eine neue Zonenkategorie
    public ZoneCategoryDTO addCategory(ZoneCategoryDTO dto) {
        ZoneCategory category = new ZoneCategory(dto.getName());
        ZoneCategory saved = repository.save(category);
        return new ZoneCategoryDTO(saved.getId(), saved.getName());
    }
}
