package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Locale;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String name = normalize(request.get("name"));
            String email = normalize(request.get("email"));
            String password = request.get("password");

            if (name == null || email == null || password == null || password.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Name, email and password are required");
                return ResponseEntity.badRequest().body(response);
            }

            email = email.toLowerCase(Locale.ROOT);

            if (!EMAIL_PATTERN.matcher(email).matches()) {
                response.put("success", false);
                response.put("message", "Please enter a valid email address");
                return ResponseEntity.badRequest().body(response);
            }

            if (password.trim().length() < 6) {
                response.put("success", false);
                response.put("message", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(response);
            }

            if (userRepository.findByEmail(email) != null) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            User user = new User(name, email, password, User.Role.CUSTOMER);
            userRepository.save(user);

            response.put("success", true);
            response.put("message", "Account created successfully");
            return ResponseEntity.ok(response);

        } catch (DataIntegrityViolationException e) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Unable to create account right now");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String email = request.get("email");
        String password = request.get("password");
        
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPasswordHash().equals(password)) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole().toString());
            
            response.put("success", true);
            response.put("user", userData);
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return userRepository.findAll().stream().map(user -> {
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("role", user.getRole().toString());
            return userData;
        }).toList();
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
