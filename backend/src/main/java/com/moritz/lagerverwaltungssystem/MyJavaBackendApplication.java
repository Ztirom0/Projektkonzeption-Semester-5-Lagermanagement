package com.moritz.lagerverwaltungssystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class MyJavaBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyJavaBackendApplication.class, args);
    }
}
