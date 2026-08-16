package com.examly.springapp.controller;

import com.examly.springapp.model.Restaurant;
import com.examly.springapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantRestController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        System.out.println("Found " + restaurants.size() + " restaurants");
        return restaurants;
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Long id) {
        return restaurantRepository.findById(id).orElse(null);
    }
}