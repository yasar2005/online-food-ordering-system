package com.examly.springapp.service;

import com.examly.springapp.model.FoodOrder;
import com.examly.springapp.repository.FoodOrderRepository;
import com.examly.springapp.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodOrderService {

    @Autowired
    private FoodOrderRepository foodOrderRepository;

    // 🔹 Get all orders
    public List<FoodOrder> getAllOrders() {
        return foodOrderRepository.findAll();
    }

    // 🔹 Get order by ID
    public FoodOrder getOrderById(Long id) {
        return foodOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    // 🔹 Save Order (for test case compatibility)
    public FoodOrder saveOrder(FoodOrder order) {
        return foodOrderRepository.save(order);
    }

    // 🔹 Create new order (alias for saveOrder)
    public FoodOrder createOrder(FoodOrder order) {
        return saveOrder(order);
    }

    // 🔹 Update existing order
    public FoodOrder updateOrder(Long id, FoodOrder updatedOrder) {
        FoodOrder existingOrder = getOrderById(id);
        existingOrder.setRestaurantName(updatedOrder.getRestaurantName());
        existingOrder.setCuisineType(updatedOrder.getCuisineType());
        existingOrder.setMenuItemName(updatedOrder.getMenuItemName());
        existingOrder.setMenuItemDescription(updatedOrder.getMenuItemDescription());
        existingOrder.setMenuItemPrice(updatedOrder.getMenuItemPrice());
        existingOrder.setQuantity(updatedOrder.getQuantity());
        existingOrder.setOrderStatus(updatedOrder.getOrderStatus());
        return foodOrderRepository.save(existingOrder);
    }

    // 🔹 Delete order
    public void deleteOrder(Long id) {
        FoodOrder order = getOrderById(id);
        foodOrderRepository.delete(order);
    }
}
