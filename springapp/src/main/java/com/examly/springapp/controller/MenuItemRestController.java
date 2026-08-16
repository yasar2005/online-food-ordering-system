package com.examly.springapp.controller;

import com.examly.springapp.model.MenuItem;
import com.examly.springapp.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemRestController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    @GetMapping("/available")
    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByStockGreaterThan(0);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuItemsByRestaurant(@PathVariable Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem item) {
        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem updated) {
        Map<String, Object> response = new HashMap<>();
        return menuItemRepository.findById(id).map(item -> {
            item.setName(updated.getName());
            item.setDescription(updated.getDescription());
            item.setPrice(updated.getPrice());
            item.setStock(updated.getStock());
            item.setCategory(updated.getCategory());
            item.setImageUrl(updated.getImageUrl());
            menuItemRepository.save(item);
            response.put("success", true);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            response.put("success", false);
            return ResponseEntity.notFound().build();
        });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMenuItem(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        menuItemRepository.deleteById(id);
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}