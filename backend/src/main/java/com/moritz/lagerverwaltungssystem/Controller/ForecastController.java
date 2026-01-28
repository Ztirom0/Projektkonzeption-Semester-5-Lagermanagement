package com.moritz.lagerverwaltungssystem.controller;

import com.moritz.lagerverwaltungssystem.dto.ForecastDTO;
import com.moritz.lagerverwaltungssystem.dto.ForecastRequestDTO;
import com.moritz.lagerverwaltungssystem.service.ForecastService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService service;

    public ForecastController(ForecastService service) {
        this.service = service;
    }

    @PostMapping
    public ForecastDTO forecast(@RequestBody ForecastRequestDTO request) {
        return service.calculateForecast(request);
    }
}
