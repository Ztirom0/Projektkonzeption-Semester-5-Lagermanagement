package com.moritz.lagerverwaltungssystem;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/products")
public class DummyController {

    public DummyController() {}

    @GetMapping("/all")
    public String test() {
        return "Test test test fom Backend";
    }
}