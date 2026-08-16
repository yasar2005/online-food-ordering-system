package com.examly.springapp.controller;

import com.examly.springapp.model.Coupon;
import com.examly.springapp.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/coupons")
public class CouponRestController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCoupon(@RequestBody Map<String, Object> body) {
        Map<String, Object> response = new HashMap<>();
        String code = (String) body.get("code");
        BigDecimal orderTotal = new BigDecimal(body.get("orderTotal").toString());

        return couponRepository.findByCodeAndActiveTrue(code).map(coupon -> {
            if (coupon.getMinOrderAmount() != null && orderTotal.compareTo(coupon.getMinOrderAmount()) < 0) {
                response.put("success", false);
                response.put("message", "Minimum order amount ₹" + coupon.getMinOrderAmount() + " required");
                return ResponseEntity.ok(response);
            }
            BigDecimal discount;
            if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                discount = orderTotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else {
                discount = coupon.getDiscountValue();
            }
            response.put("success", true);
            response.put("discount", discount);
            response.put("description", coupon.getDescription());
            return ResponseEntity.ok(response);
        }).orElseGet(() -> {
            response.put("success", false);
            response.put("message", "Invalid or expired coupon code");
            return ResponseEntity.ok(response);
        });
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponRepository.save(coupon));
    }
}
