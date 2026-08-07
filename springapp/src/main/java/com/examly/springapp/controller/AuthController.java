package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

import java.util.Locale;

@Controller
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password, HttpSession session, Model model) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPasswordHash().equals(password)) {
            session.setAttribute("userId", user.getId());
            session.setAttribute("userRole", user.getRole());
            
            switch (user.getRole()) {
                case ADMIN: return "redirect:/admin/dashboard";
                case RESTAURANT_OWNER: return "redirect:/restaurant/dashboard";
                case CUSTOMER: return "redirect:/customer/menu";
            }
        }
        model.addAttribute("error", "Invalid credentials");
        return "login";
    }

    @PostMapping("/signup")
    public String signup(@RequestParam String name, @RequestParam String email, @RequestParam String password, Model model) {
        String normalizedName = name == null ? "" : name.trim();
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        String normalizedPassword = password == null ? "" : password.trim();

        if (normalizedName.isEmpty() || normalizedEmail.isEmpty() || normalizedPassword.isEmpty()) {
            model.addAttribute("error", "Name, email and password are required");
            return "signup";
        }

        if (userRepository.findByEmail(normalizedEmail) != null) {
            model.addAttribute("error", "Email already exists");
            return "signup";
        }

        userRepository.save(new User(normalizedName, normalizedEmail, normalizedPassword, User.Role.CUSTOMER));
        return "redirect:/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
