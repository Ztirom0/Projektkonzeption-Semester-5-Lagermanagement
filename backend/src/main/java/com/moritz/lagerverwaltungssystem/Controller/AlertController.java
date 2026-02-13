package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.AlertDTO;
import com.moritz.lagerverwaltungssystem.service.AlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Endpoint für Bestandswarnungen
// Stellt API-Endpunkte zur Abfrage von Unterbeständen zur Verfügung
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService service;

    public AlertController(AlertService service) {
        this.service = service;
    }

    // Gibt alle aktuellen Warnungen ab (GET /api/alerts)
    @GetMapping
    public List<AlertDTO> getAlerts() {
        return service.getAlerts();
    }
}
