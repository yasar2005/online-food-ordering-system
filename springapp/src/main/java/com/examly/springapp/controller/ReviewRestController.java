package com.examly.springapp.controller;

import com.examly.springapp.model.Review;
import com.examly.springapp.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/reviews")
public class ReviewRestController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/menu-item/{menuItemId}")
    public List<Review> getReviewsByMenuItem(@PathVariable Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Review> getReviewsByCustomer(@PathVariable Long customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody Review review) {
        Map<String, Object> response = new HashMap<>();
        if (reviewRepository.existsByCustomerIdAndOrderIdAndMenuItemId(
                review.getCustomerId(), review.getOrderId(), review.getMenuItemId())) {
            response.put("success", false);
            response.put("message", "You have already reviewed this item for this order");
            return ResponseEntity.badRequest().body(response);
        }
        Review saved = reviewRepository.save(review);
        response.put("success", true);
        response.put("reviewId", saved.getId());
        return ResponseEntity.ok(response);
    }
}
