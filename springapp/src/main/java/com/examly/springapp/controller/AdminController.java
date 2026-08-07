package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<User> users = userRepository.findAll();
        List<Restaurant> restaurants = restaurantRepository.findAll();
        model.addAttribute("users", users);
        model.addAttribute("restaurants", restaurants);
        return "admin/dashboard";
    }

    @PostMapping("/user/create")
    public String createUser(@RequestParam String name, @RequestParam String email, 
                            @RequestParam String password, @RequestParam User.Role role) {
        User user = new User(name, email, password, role);
        userRepository.save(user);
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/restaurant/create")
    public String createRestaurant(@RequestParam Long userId, @RequestParam String name, 
                                  @RequestParam String address) {
        Restaurant restaurant = new Restaurant(userId, name, address);
        restaurantRepository.save(restaurant);
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/admin/dashboard";
    }
}