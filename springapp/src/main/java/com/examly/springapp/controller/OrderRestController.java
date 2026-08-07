package com.examly.springapp.controller;

import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.OrderItemRepository;
import com.examly.springapp.dto.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:8081")
public class OrderRestController {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        List<Order> allOrders = orderRepository.findAll();
        System.out.println("Total orders in database: " + allOrders.size());
        for (Order order : allOrders) {
            System.out.println("Order ID: " + order.getId() + ", Customer ID: " + order.getCustomerId());
        }
        return allOrders;
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        System.out.println("Fetching orders for customer ID: " + customerId);
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        System.out.println("Found " + orders.size() + " orders for customer " + customerId);
        return orders;
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Order> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        return orderRepository.findById(id).map(order -> {
            order.setStatus(Order.Status.valueOf(body.get("status")));
            orderRepository.save(order);
            response.put("success", true);
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            response.put("success", false);
            return ResponseEntity.notFound().build();
        });
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("Creating order for customer ID: " + request.getCustomerId());
            System.out.println("Order total: " + request.getTotalPrice());
            
            // Create order
            Order order = new Order(
                request.getCustomerId(),
                request.getRestaurantId(),
                request.getTotalPrice(),
                Order.Status.PENDING
            );
            Order savedOrder = orderRepository.save(order);
            System.out.println("Order saved with ID: " + savedOrder.getId());
            
            // Create order items
            if (request.getItems() != null) {
                for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
                    OrderItem orderItem = new OrderItem(
                        savedOrder.getId(),
                        itemRequest.getMenuItemId(),
                        itemRequest.getQuantity()
                    );
                    orderItemRepository.save(orderItem);
                }
            }
            
            response.put("success", true);
            response.put("orderId", savedOrder.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create order");
            return ResponseEntity.badRequest().body(response);
        }
    }
}