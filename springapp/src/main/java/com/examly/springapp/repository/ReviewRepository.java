package com.examly.springapp.repository;

import com.examly.springapp.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);
    List<Review> findByCustomerId(Long customerId);
    boolean existsByCustomerIdAndOrderIdAndMenuItemId(Long customerId, Long orderId, Long menuItemId);
}
