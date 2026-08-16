-- Admin
INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES 
(1, 'Admin User', 'admin@food.com', 'admin123', 'ADMIN');

-- Restaurant owners
INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES 
(2, 'Spice Garden Owner', 'spice@owner.com', 'owner123', 'RESTAURANT_OWNER'),
(3, 'Burger Bros Owner', 'burger@owner.com', 'owner123', 'RESTAURANT_OWNER'),
(4, 'Pizza House Owner', 'pizza@owner.com', 'owner123', 'RESTAURANT_OWNER'),
(5, 'Biryani Palace Owner', 'biryani@owner.com', 'owner123', 'RESTAURANT_OWNER'),
(6, 'Wok Express Owner', 'wok@owner.com', 'owner123', 'RESTAURANT_OWNER');
-- Customers
INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES 
(7, 'Foodie Customer', 'customer@food.com', 'customer123', 'CUSTOMER');
-- Restaurants
INSERT IGNORE INTO restaurants (id, user_id, name, address, cuisine, rating, delivery_time, image_url) VALUES 
(1, 2, 'Spice Garden', 'HSR Layout, Bengaluru', 'North Indian', 4.5, 30, '/images/restaurant-spice-garden.svg'),
(2, 3, 'Burger Bros', 'Koramangala, Bengaluru', 'American', 4.3, 25, '/images/restaurant-burger-bros.svg'),
(3, 4, 'Pizza House', 'Indiranagar, Bengaluru', 'Italian', 4.6, 35, '/images/restaurant-pizza-house.svg'),
(4, 5, 'Biryani Palace', 'Banjara Hills, Hyderabad', 'Hyderabadi', 4.7, 40, '/images/restaurant-biryani-palace.svg'),
(5, 6, 'Wok Express', 'Jubilee Hills, Hyderabad', 'Chinese', 4.2, 30, '/images/restaurant-wok-express.svg');

-- Spice Garden menu (restaurant_id = 1)
INSERT IGNORE INTO menu_items (id, name, description, price, restaurant_id, stock, category, rating, image_url) VALUES 
(1, 'Butter Chicken', 'Tender chicken in rich tomato-butter gravy, served with naan', 299, 1, 30, 'Indian', 4.6, '/images/butter-chicken.svg'),
(2, 'Paneer Tikka', 'Grilled cottage cheese marinated in spiced yogurt', 249, 1, 25, 'Indian', 4.4, '/images/paneer-tikka.svg'),
(3, 'Dal Makhani', 'Slow-cooked black lentils with butter and cream', 199, 1, 40, 'Indian', 4.3, '/images/dal-makhani.svg'),
(4, 'Chicken Biryani', 'Fragrant basmati rice cooked with spiced chicken', 319, 1, 20, 'Biryani', 4.7, '/images/biryani.svg'),
(5, 'Garlic Naan', 'Soft leavened bread with garlic and butter', 59, 1, 50, 'Indian', 4.2, '/images/garlic-naan.svg');

-- Burger Bros menu (restaurant_id = 2)
INSERT IGNORE INTO menu_items (id, name, description, price, restaurant_id, stock, category, rating, image_url) VALUES 
(6, 'Smash Burger', 'Double smashed beef patty with cheddar and pickles', 279, 2, 25, 'Burger', 4.5, '/images/burger.svg'),
(7, 'Crispy Chicken Burger', 'Fried chicken fillet with slaw and sriracha mayo', 259, 2, 30, 'Burger', 4.4, '/images/burger.svg'),
(8, 'Veggie Burger', 'Black bean patty with avocado and lettuce', 229, 2, 20, 'Burger', 4.1, '/images/burger.svg'),
(9, 'Loaded Fries', 'Crispy fries with cheese sauce, jalapeños and bacon bits', 179, 2, 35, 'Burger', 4.3, '/images/loaded-fries.svg'),
(10, 'Milkshake', 'Thick vanilla, chocolate or strawberry shake', 149, 2, 40, 'Burger', 4.5, '/images/milkshake.svg');

-- Pizza House menu (restaurant_id = 3)
INSERT IGNORE INTO menu_items (id, name, description, price, restaurant_id, stock, category, rating, image_url) VALUES 
(11, 'Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 349, 3, 20, 'Pizza', 4.6, '/images/margherita.svg'),
(12, 'Pepperoni Pizza', 'Classic pepperoni with mozzarella and oregano', 399, 3, 18, 'Pizza', 4.7, '/images/pizza.svg'),
(13, 'BBQ Chicken Pizza', 'Smoky BBQ sauce, grilled chicken, red onion', 429, 3, 15, 'Pizza', 4.5, '/images/pizza.svg'),
(14, 'Pasta Arrabiata', 'Penne in spicy tomato sauce with garlic', 249, 3, 25, 'Pizza', 4.2, '/images/pasta.svg'),
(15, 'Garlic Bread', 'Toasted baguette with herb butter and cheese', 129, 3, 40, 'Pizza', 4.3, '/images/garlic-bread.svg');

-- Biryani Palace menu (restaurant_id = 4)
INSERT IGNORE INTO menu_items (id, name, description, price, restaurant_id, stock, category, rating, image_url) VALUES 
(16, 'Hyderabadi Dum Biryani', 'Slow-cooked mutton biryani with saffron and fried onions', 389, 4, 20, 'Biryani', 4.8, '/images/biryani.svg'),
(17, 'Chicken 65 Biryani', 'Spicy fried chicken tossed with biryani rice', 359, 4, 25, 'Biryani', 4.6, '/images/biryani.svg'),
(18, 'Veg Biryani', 'Aromatic rice with mixed vegetables and whole spices', 269, 4, 30, 'Biryani', 4.3, '/images/biryani.svg'),
(19, 'Raita', 'Chilled yogurt with cucumber and cumin', 59, 4, 60, 'Indian', 4.1, '/images/raita.svg'),
(20, 'Gulab Jamun', 'Soft milk-solid dumplings in rose syrup', 99, 4, 50, 'Indian', 4.7, '/images/gulab-jamun.svg');

-- Wok Express menu (restaurant_id = 5)
INSERT IGNORE INTO menu_items (id, name, description, price, restaurant_id, stock, category, rating, image_url) VALUES 
(21, 'Kung Pao Chicken', 'Wok-tossed chicken with peanuts and chilli', 289, 5, 25, 'Chinese', 4.4, '/images/butter-chicken.svg'),
(22, 'Vegetable Fried Rice', 'Classic wok-fried rice with eggs and veggies', 219, 5, 30, 'Chinese', 4.2, '/images/fried-rice.svg'),
(23, 'Hakka Noodles', 'Stir-fried noodles with soy and sesame', 229, 5, 30, 'Chinese', 4.3, '/images/noodles.svg'),
(24, 'Dim Sum Basket', 'Steamed pork and prawn dumplings (6 pcs)', 259, 5, 20, 'Chinese', 4.5, '/images/dim-sum.svg'),
(25, 'Manchurian', 'Crispy veggie balls in tangy Indo-Chinese sauce', 199, 5, 35, 'Chinese', 4.1, '/images/manchurian.svg');

-- Coupons
INSERT IGNORE INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, active) VALUES
(1, 'WELCOME20', '20% off on your first order', 'PERCENTAGE', 20, 200, true),
(2, 'FLAT50', 'Flat ₹50 off on orders above ₹300', 'FLAT', 50, 300, true),
(3, 'PIZZA10', '10% off on Pizza orders', 'PERCENTAGE', 10, 100, true),
(4, 'BIRYANI30', 'Flat ₹30 off on Biryani orders', 'FLAT', 30, 250, true),
(5, 'SAVE100', 'Flat ₹100 off on orders above ₹500', 'FLAT', 100, 500, true);
