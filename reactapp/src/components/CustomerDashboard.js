import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../dashboard.css';

const CustomerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: '🎉 Welcome to FoodieHub!', type: 'welcome' },
    { id: 2, message: '🔥 20% off on Pizza Palace today!', type: 'offer' }
  ]);

  useEffect(() => {
    fetchRestaurants();
    fetchMenuItems();
    fetchOrders();
    loadFavorites();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchRestaurants = async () => {
    try {
      console.log('Fetching restaurants...');
      const response = await axios.get('http://localhost:8080/api/restaurants');
      console.log('Restaurants response:', response.data);
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setRestaurants([]);
    }
  };

  const fetchMenuItems = async () => {
    try {
      console.log('Fetching menu items...');
      const response = await axios.get('http://localhost:8080/api/menu-items');
      console.log('Menu items response:', response.data);
      setMenuItems(response.data || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems([]);
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for user ID:', user.id);
      const response = await axios.get(`http://localhost:8080/api/orders/customer/${user.id}`);
      console.log('Orders response:', response.data);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem(`favorites_${user.id}`);
    if (saved) setFavorites(JSON.parse(saved));
  };

  const toggleFavorite = (itemId) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(newFavorites);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    
    // Add success notification
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: `✅ ${item.name} added to cart!`,
      type: 'success'
    }]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const orderData = {
        customerId: user.id,
        restaurantId: cart[0].restaurantId || 1, // Default to first restaurant
        totalPrice: parseFloat(getCartTotal()),
        status: 'PENDING',
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };
      
      console.log('Placing order with data:', orderData);
      console.log('User object:', user);
      
      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      
      if (response.data) {
        // Clear cart and show success
        setCart([]);
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: '🎉 Order placed successfully!',
          type: 'success'
        }]);
        
        // Force immediate refresh
        setTimeout(async () => {
          await fetchOrders();
          setActiveTab('orders');
        }, 1000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: '❌ Failed to place order. Please try again.',
        type: 'error'
      }]);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           item.name.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const categories = ['all', 'pizza', 'burger', 'chicken', 'veggie'];

  return (
    <div className="dashboard">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            <span>{notif.message}</span>
            <button onClick={() => dismissNotification(notif.id)}>×</button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>{getGreeting()}, {user.name}! 🍽️</h1>
          <p className="subtitle">What are you craving today?</p>
        </div>
        <div className="header-right">
          <div className="user-stats">
            <div className="stat">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="stat">
              <span className="stat-number">{favorites.length}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {[
          { id: 'explore', label: '🔍 Explore', icon: '🔍' },
          { id: 'cart', label: `🛒 Cart (${cart.length})`, icon: '🛒' },
          { id: 'orders', label: '📋 Orders', icon: '📋' },
          { id: 'favorites', label: '❤️ Favorites', icon: '❤️' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        {activeTab === 'explore' && (
          <div className="explore-section">
            {/* Search and Filters */}
            <div className="search-filters">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="🔍 Search for food..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? '🍽️ All' : 
                     category === 'pizza' ? '🍕 Pizza' :
                     category === 'burger' ? '🍔 Burger' :
                     category === 'chicken' ? '🍗 Chicken' : '🥗 Veggie'}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="menu-grid">
              {filteredMenuItems.length === 0 ? (
                <div className="no-items-message">
                  <p>No menu items available. Loading...</p>
                </div>
              ) : (
                filteredMenuItems.map(item => (
                <div key={item.id} className="menu-card">
                  <div className="card-header">
                    {item.name.includes('Pizza') ? '🍕' :
                     item.name.includes('Burger') ? '🍔' :
                     item.name.includes('Chicken') ? '🍗' : '🥗'}
                    <button 
                      className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(item.id)}
                    >
                      {favorites.includes(item.id) ? '❤️' : '🤍'}
                    </button>
                    <span className="stock-badge">{item.stock} left</span>
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-details">
                      <span className="price">₹{item.price}</span>
                      <div className="rating">⭐ 4.5</div>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className="add-btn"
                    >
                      {item.stock === 0 ? 'Out of Stock' : 'ADD'}
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-section">
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>
              <span className="cart-total">Total: ${getCartTotal()}</span>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button onClick={() => setActiveTab('explore')} className="explore-btn">
                  🔍 Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price} each</p>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-actions">
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                  >
                    🚀 Proceed to Checkout (₹{getCartTotal()})
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>📋 Order History</h2>
            <button 
              onClick={async () => {
                try {
                  const response = await axios.get('http://localhost:8080/api/orders');
                  console.log('All orders:', response.data);
                } catch (error) {
                  console.error('Error fetching all orders:', error);
                }
              }}
              style={{marginBottom: '20px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px'}}
            >
              Debug: Show All Orders
            </button>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No orders yet</h3>
                <p>Place your first order to see it here!</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h4>Order #{order.id}</h4>
                      <span className={`status ${order.status?.toLowerCase()}`}>
                        {order.status === 'PENDING' ? '⏳ Pending' :
                         order.status === 'CONFIRMED' ? '✅ Confirmed' :
                         order.status === 'READY' ? '🍽️ Ready' : '🎉 Completed'}
                      </span>
                    </div>
                    <div className="order-details">
                      <p>Total: ${order.totalPrice}</p>
                      <p>📅 {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <h2>❤️ Your Favorites</h2>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No favorites yet</h3>
                <p>Heart some items to see them here!</p>
              </div>
            ) : (
              <div className="menu-grid">
                {menuItems.filter(item => favorites.includes(item.id)).map(item => (
                  <div key={item.id} className="menu-card favorite">
                    <div className="card-header">
                      {item.name.includes('Pizza') ? '🍕' :
                       item.name.includes('Burger') ? '🍔' :
                       item.name.includes('Chicken') ? '🍗' : '🥗'}
                      <button 
                        className="favorite-btn active"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        ❤️
                      </button>
                    </div>
                    <div className="card-content">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-details">
                        <span className="price">₹{item.price}</span>
                        <div className="rating">⭐ 4.5</div>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0}
                        className="add-btn"
                      >
                        {item.stock === 0 ? 'Out of Stock' : 'ADD'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;