package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/restaurant")
public class RestaurantController {

    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Long userId = (Long) session.getAttribute("userId");
        Restaurant restaurant = restaurantRepository.findByUserId(userId);
        
        if (restaurant != null) {
            List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurant.getId());
            List<Order> orders = orderRepository.findByRestaurantId(restaurant.getId());
            model.addAttribute("restaurant", restaurant);
            model.addAttribute("menuItems", menuItems);
            model.addAttribute("orders", orders);
        }
        return "restaurant/dashboard";
    }

    @PostMapping("/menu/add")
    public String addMenuItem(@RequestParam String name, @RequestParam String description, 
                             @RequestParam BigDecimal price, @RequestParam Integer stock,
                             HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        Restaurant restaurant = restaurantRepository.findByUserId(userId);
        
        if (restaurant != null) {
            MenuItem menuItem = new MenuItem(name, description, price, restaurant.getId(), stock);
            menuItemRepository.save(menuItem);
        }
        return "redirect:/restaurant/dashboard";
    }

    @PostMapping("/menu/update/{id}")
    public String updateMenuItem(@PathVariable Long id, @RequestParam String name, 
                                @RequestParam String description, @RequestParam BigDecimal price, 
                                @RequestParam Integer stock) {
        MenuItem menuItem = menuItemRepository.findById(id).orElse(null);
        if (menuItem != null) {
            menuItem.setName(name);
            menuItem.setDescription(description);
            menuItem.setPrice(price);
            menuItem.setStock(stock);
            menuItemRepository.save(menuItem);
        }
        return "redirect:/restaurant/dashboard";
    }

    @PostMapping("/menu/delete/{id}")
    public String deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return "redirect:/restaurant/dashboard";
    }

    @PostMapping("/order/status/{id}")
    public String updateOrderStatus(@PathVariable Long id, @RequestParam Order.Status status) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order != null) {
            order.setStatus(status);
            orderRepository.save(order);
        }
        return "redirect:/restaurant/dashboard";
    }
}