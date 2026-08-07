package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/customer")
public class CustomerController {

    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private OrderRepository orderRepository;

    @GetMapping("/menu")
    public String viewMenu(Model model) {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        List<MenuItem> menuItems = menuItemRepository.findByStockGreaterThan(0);
        model.addAttribute("restaurants", restaurants);
        model.addAttribute("menuItems", menuItems);
        return "customer/menu";
    }

    @GetMapping("/orders")
    public String viewOrders(HttpSession session, Model model) {
        Long customerId = (Long) session.getAttribute("userId");
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        model.addAttribute("orders", orders);
        return "customer/orders";
    }

    @GetMapping("/order")
    public String orderPage(Model model) {
        List<MenuItem> menuItems = menuItemRepository.findByStockGreaterThan(0);
        model.addAttribute("menuItems", menuItems);
        return "customer/order";
    }
}