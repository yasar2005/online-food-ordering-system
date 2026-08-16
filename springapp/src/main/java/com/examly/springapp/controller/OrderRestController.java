package com.examly.springapp.controller;

import com.examly.springapp.model.Order;
import com.examly.springapp.model.OrderItem;
import com.examly.springapp.repository.OrderRepository;
import com.examly.springapp.repository.OrderItemRepository;
import com.examly.springapp.dto.OrderRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/orders")
public class OrderRestController {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderRepository.findByCustomerId(customerId);
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

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return orderRepository.findById(id).map(order -> {
            if (order.getStatus() == Order.Status.PENDING) {
                order.setStatus(Order.Status.CANCELLED);
                orderRepository.save(order);
                response.put("success", true);
            } else {
                response.put("success", false);
                response.put("message", "Only PENDING orders can be cancelled");
            }
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
            
            // Create order
            Order order = new Order(
                request.getCustomerId(),
                request.getRestaurantId(),
                request.getTotalPrice(),
                Order.Status.PENDING
            );
            order.setPaymentMethod(request.getPaymentMethod());
            if (request.getPaymentDetails() != null) {
                ObjectMapper mapper = new ObjectMapper();
                order.setPaymentDetails(mapper.writeValueAsString(request.getPaymentDetails()));
            }
            order.setDeliveryAddress(request.getDeliveryAddress());
            order.setDiscountAmount(request.getDiscountAmount());
            Order savedOrder = orderRepository.save(order);
            
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