package com.examly.springapp.controller;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.service.FoodOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-orders")
@CrossOrigin(origins = "http://localhost:8081")
public class FoodOrderController {

    @Autowired
    private FoodOrderService foodOrderService;

    // 🔹 Get all orders
    @GetMapping
    public List<FoodOrder> getAllOrders() {
        return foodOrderService.getAllOrders();
    }

    // 🔹 Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<FoodOrder> getOrderById(@PathVariable Long id) {
        FoodOrder order = foodOrderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    // 🔹 Create new order
    @PostMapping
    public ResponseEntity<FoodOrder> createOrder(@RequestBody FoodOrder order) {
        FoodOrder savedOrder = foodOrderService.saveOrder(order); // ✅ Using saveOrder for test
        return ResponseEntity.ok(savedOrder);
    }

    // 🔹 Update order
    @PutMapping("/{id}")
    public ResponseEntity<FoodOrder> updateOrder(@PathVariable Long id, @RequestBody FoodOrder order) {
        FoodOrder updatedOrder = foodOrderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }

    // 🔹 Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        foodOrderService.deleteOrder(id);
        return ResponseEntity.ok().build(); // ✅ Test case expects 200 OK
    }
}
