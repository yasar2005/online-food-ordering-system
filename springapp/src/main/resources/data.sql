-- Admin
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@food.com', 'admin123', 'ADMIN');

-- Restaurant owners
INSERT IGNORE INTO users (name, email, password_hash, role) VALUES 
('Spice Garden Owner', 'spice@owner.com', 'owner123', 'RESTAURANT_OWNER'),
('Burger Bros Owner', 'burger@owner.com', 'owner123', 'RESTAURANT_OWNER'),
('Pizza House Owner', 'pizza@owner.com', 'owner123', 'RESTAURANT_OWNER'),
('Biryani Palace Owner', 'biryani@owner.com', 'owner123', 'RESTAURANT_OWNER'),
('Wok Express Owner', 'wok@owner.com', 'owner123', 'RESTAURANT_OWNER');

-- Restaurants
INSERT IGNORE INTO restaurants (user_id, name, address) VALUES 
(2, 'Spice Garden', 'HSR Layout, Bengaluru'),
(3, 'Burger Bros', 'Koramangala, Bengaluru'),
(4, 'Pizza House', 'Indiranagar, Bengaluru'),
(5, 'Biryani Palace', 'Banjara Hills, Hyderabad'),
(6, 'Wok Express', 'Jubilee Hills, Hyderabad');

-- Spice Garden menu (restaurant_id = 1)
INSERT IGNORE INTO menu_items (name, description, price, restaurant_id, stock) VALUES 
('Butter Chicken', 'Tender chicken in rich tomato-butter gravy, served with naan', 299, 1, 30),
('Paneer Tikka', 'Grilled cottage cheese marinated in spiced yogurt', 249, 1, 25),
('Dal Makhani', 'Slow-cooked black lentils with butter and cream', 199, 1, 40),
('Chicken Biryani', 'Fragrant basmati rice cooked with spiced chicken', 319, 1, 20),
('Garlic Naan', 'Soft leavened bread with garlic and butter', 59, 1, 50);

-- Burger Bros menu (restaurant_id = 2)
INSERT IGNORE INTO menu_items (name, description, price, restaurant_id, stock) VALUES 
('Smash Burger', 'Double smashed beef patty with cheddar and pickles', 279, 2, 25),
('Crispy Chicken Burger', 'Fried chicken fillet with slaw and sriracha mayo', 259, 2, 30),
('Veggie Burger', 'Black bean patty with avocado and lettuce', 229, 2, 20),
('Loaded Fries', 'Crispy fries with cheese sauce, jalapeños and bacon bits', 179, 2, 35),
('Milkshake', 'Thick vanilla, chocolate or strawberry shake', 149, 2, 40);

-- Pizza House menu (restaurant_id = 3)
INSERT IGNORE INTO menu_items (name, description, price, restaurant_id, stock) VALUES 
('Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 349, 3, 20),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella and oregano', 399, 3, 18),
('BBQ Chicken Pizza', 'Smoky BBQ sauce, grilled chicken, red onion', 429, 3, 15),
('Pasta Arrabiata', 'Penne in spicy tomato sauce with garlic', 249, 3, 25),
('Garlic Bread', 'Toasted baguette with herb butter and cheese', 129, 3, 40);

-- Biryani Palace menu (restaurant_id = 4)
INSERT IGNORE INTO menu_items (name, description, price, restaurant_id, stock) VALUES 
('Hyderabadi Dum Biryani', 'Slow-cooked mutton biryani with saffron and fried onions', 389, 4, 20),
('Chicken 65 Biryani', 'Spicy fried chicken tossed with biryani rice', 359, 4, 25),
('Veg Biryani', 'Aromatic rice with mixed vegetables and whole spices', 269, 4, 30),
('Raita', 'Chilled yogurt with cucumber and cumin', 59, 4, 60),
('Gulab Jamun', 'Soft milk-solid dumplings in rose syrup', 99, 4, 50);

-- Wok Express menu (restaurant_id = 5)
INSERT IGNORE INTO menu_items (name, description, price, restaurant_id, stock) VALUES 
('Kung Pao Chicken', 'Wok-tossed chicken with peanuts and chilli', 289, 5, 25),
('Vegetable Fried Rice', 'Classic wok-fried rice with eggs and veggies', 219, 5, 30),
('Hakka Noodles', 'Stir-fried noodles with soy and sesame', 229, 5, 30),
('Dim Sum Basket', 'Steamed pork and prawn dumplings (6 pcs)', 259, 5, 20),
('Manchurian', 'Crispy veggie balls in tangy Indo-Chinese sauce', 199, 5, 35);
