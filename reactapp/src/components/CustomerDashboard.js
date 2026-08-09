import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import '../dashboard.css';

const CustomerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: '🎉 Welcome to FoodieHub!', type: 'welcome' },
    { id: 2, message: '🔥 Use code WELCOME20 for 20% off!', type: 'offer' }
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [upiId, setUpiId] = useState('');

  const getImageSrc = (url) => {
    if (!url) return '/images/food-default.svg';
    if (url.startsWith('http')) return url;
    return url.startsWith('/') ? url : `/images/${url}`;
  };

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await api.get('/restaurants');
      setRestaurants(res.data || []);
    } catch (e) { setRestaurants([]); }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const res = await api.get('/menu-items');
      setMenuItems(res.data || []);
    } catch (e) { setMenuItems([]); }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get(`/orders/customer/${user.id}`);
      setOrders(res.data || []);
    } catch (e) { setOrders([]); }
  }, [user.id]);

  const loadFavorites = useCallback(() => {
    const saved = localStorage.getItem(`favorites_${user.id}`);
    if (saved) setFavorites(JSON.parse(saved));
  }, [user.id]);

  useEffect(() => {
    fetchRestaurants();
    fetchMenuItems();
    fetchOrders();
    loadFavorites();
  }, [fetchRestaurants, fetchMenuItems, fetchOrders, loadFavorites]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchOrders]);

  // Auto-dismiss notifications after 4s
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [notifications]);

  const pushNotif = (message, type = 'success') => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };

  const toggleFavorite = (itemId) => {
    const next = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    setFavorites(next);
    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(next));
  };

  const addToCart = (item) => {
    if (cart.length > 0 && cart[0].restaurantId !== item.restaurantId) {
      pushNotif('⚠️ Clear cart to order from a different restaurant.', 'error');
      return;
    }
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    pushNotif(`✅ ${item.name} added to cart!`);
  };

  const removeFromCart = (itemId) => setCart(cart.filter(i => i.id !== itemId));

  const updateQuantity = (itemId, qty) => {
    if (qty === 0) removeFromCart(itemId);
    else setCart(cart.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  const cartTotal = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getCartTotal = () => cartTotal().toFixed(2);
  const getGrandTotal = () => Math.max(cartTotal() - discountAmount, 0).toFixed(2);

  const applyCoupon = async () => {
    if (!couponCode.trim()) { setCouponMessage('Enter a coupon code'); return; }
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode.trim().toUpperCase(),
        orderTotal: cartTotal()
      });
      if (res.data?.success) {
        setDiscountAmount(parseFloat(res.data.discount));
        setCouponMessage(`✅ ${res.data.description}`);
      } else {
        setCouponMessage(res.data?.message || 'Invalid coupon');
        setDiscountAmount(0);
      }
    } catch {
      setCouponMessage('Unable to validate coupon');
      setDiscountAmount(0);
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) { pushNotif('📍 Enter a delivery address.', 'error'); return; }
    if (selectedPaymentMethod === 'UPI' && !upiId.trim()) { pushNotif('📱 Enter your UPI ID.', 'error'); return; }
    if (selectedPaymentMethod === 'CARD' && (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim())) {
      pushNotif('💳 Fill in all card details.', 'error'); return;
    }
    setPaymentProcessing(true);
    try {
      const res = await api.post('/orders', {
        customerId: user.id,
        restaurantId: cart[0].restaurantId || 1,
        totalPrice: parseFloat(getGrandTotal()),
        paymentMethod: selectedPaymentMethod,
        deliveryAddress,
        discountAmount: discountAmount > 0 ? discountAmount : null,
        items: cart.map(i => ({ menuItemId: i.id, quantity: i.quantity }))
      });
      if (res.data?.success) {
        setCart([]);
        setShowPaymentModal(false);
        setCouponCode(''); setCouponMessage(''); setDiscountAmount(0);
        setCardNumber(''); setCardHolder(''); setExpiryDate(''); setUpiId('');
        pushNotif('🎉 Order placed successfully!');
        await fetchOrders();
        setActiveTab('orders');
      } else throw new Error(res.data?.message);
    } catch {
      pushNotif('❌ Payment failed. Try again.', 'error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      pushNotif('Order cancelled.');
      fetchOrders();
    } catch {
      pushNotif('Cannot cancel this order.', 'error');
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const rest = restaurants.find(r => r.id === item.restaurantId);
    const s = searchTerm.toLowerCase();
    const matchSearch = !s || item.name.toLowerCase().includes(s) ||
      item.description.toLowerCase().includes(s) ||
      rest?.name.toLowerCase().includes(s);
    const matchCat = selectedCategory === 'all' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchRest = !selectedRestaurantId || item.restaurantId === selectedRestaurantId;
    return matchSearch && matchCat && matchRest;
  });

  const filteredRestaurants = restaurants.filter(r => {
    const s = searchTerm.toLowerCase();
    return !s || r.name.toLowerCase().includes(s) || r.cuisine.toLowerCase().includes(s);
  });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return '🌅 Good Morning';
    if (h < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  const statusLabel = { PENDING: '⏳ Pending', CONFIRMED: '✅ Confirmed', READY: '🍽️ Ready', COMPLETED: '🎉 Completed', CANCELLED: '❌ Cancelled' };
  const categories = ['all', 'Indian', 'Biryani', 'Pizza', 'Burger', 'Chinese'];
  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId);

  return (
    <div className="dashboard">
      {/* Notifications */}
      <div className="notifications">
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            <span>{n.message}</span>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}>×</button>
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
            <div className="stat"><span className="stat-number">{orders.length}</span><span className="stat-label">Orders</span></div>
            <div className="stat"><span className="stat-number">{favorites.length}</span><span className="stat-label">Favorites</span></div>
          </div>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="nav-tabs">
        {[
          { id: 'explore', label: '🔍 Explore' },
          { id: 'cart', label: `🛒 Cart (${cart.length})` },
          { id: 'orders', label: '📋 Orders' },
          { id: 'favorites', label: '❤️ Favorites' }
        ].map(tab => (
          <button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">

        {/* ── EXPLORE ── */}
        {activeTab === 'explore' && (
          <div className="explore-section">
            <div className="search-filters">
              <div className="search-bar">
                <input type="text" placeholder="🔍 Search restaurants or dishes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="category-filters">
                {categories.map(cat => (
                  <button key={cat} className={`category-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>
                    {cat === 'all' ? '🍽️ All' : cat === 'Indian' ? '🍛 Indian' : cat === 'Biryani' ? '🍚 Biryani' : cat === 'Pizza' ? '🍕 Pizza' : cat === 'Burger' ? '🍔 Burger' : '🥡 Chinese'}
                  </button>
                ))}
              </div>
            </div>

            {/* Restaurant strip */}
            <div className="restaurant-strip">
              {filteredRestaurants.map(r => (
                <div key={r.id} className={`restaurant-chip ${selectedRestaurantId === r.id ? 'selected' : ''}`} onClick={() => setSelectedRestaurantId(selectedRestaurantId === r.id ? null : r.id)}>
                  <img src={getImageSrc(r.imageUrl)} alt={r.name} className="chip-img" onError={e => { e.target.onerror = null; e.target.src = '/images/food-default.svg'; }} />
                  <div className="chip-info">
                    <span className="chip-name">{r.name}</span>
                    <span className="chip-meta">⭐ {r.rating} • {r.deliveryTime || r.delivery_time} min</span>
                  </div>
                </div>
              ))}
            </div>
            {selectedRestaurant && (
              <div className="active-restaurant-bar">
                <span>📍 Showing menu for <strong>{selectedRestaurant.name}</strong> — {selectedRestaurant.cuisine}</span>
                <button onClick={() => setSelectedRestaurantId(null)}>✕ Clear</button>
              </div>
            )}

            {/* Menu grid */}
            <div className="menu-grid">
              {filteredMenuItems.length === 0 ? (
                <div className="no-items-message"><p>No items found. Try a different search or category.</p></div>
              ) : filteredMenuItems.map(item => (
                <div key={item.id} className="menu-card">
                  <div className="card-header">
                    <img src={getImageSrc(item.imageUrl)} alt={item.name} className="menu-image" onError={e => { e.target.onerror = null; e.target.src = '/images/food-default.svg'; }} />
                    <button className={`favorite-btn ${favorites.includes(item.id) ? 'active' : ''}`} onClick={() => toggleFavorite(item.id)}>
                      {favorites.includes(item.id) ? '❤️' : '🤍'}
                    </button>
                    <span className={`stock-badge ${item.stock === 0 ? 'out' : ''}`}>{item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}</span>
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="item-details">
                      <span className="price">₹{item.price}</span>
                      <div className="rating">⭐ {item.rating || '4.5'}</div>
                    </div>
                    <button onClick={() => addToCart(item)} disabled={item.stock === 0} className="add-btn">
                      {item.stock === 0 ? 'Out of Stock' : '+ ADD'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CART ── */}
        {activeTab === 'cart' && (
          <div className="cart-section">
            <div className="cart-header">
              <h2>🛒 Your Cart</h2>
              <span className="cart-total">Total: ₹{getCartTotal()}</span>
            </div>
            {cart.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
                <button onClick={() => setActiveTab('explore')} className="explore-btn">🔍 Explore Menu</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={getImageSrc(item.imageUrl)} alt={item.name} className="cart-item-img" onError={e => { e.target.onerror = null; e.target.src = '/images/food-default.svg'; }} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>₹{item.price} each</p>
                      </div>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                      <button onClick={() => removeFromCart(item.id)} className="remove-btn">🗑️</button>
                    </div>
                  ))}
                </div>
                <div className="cart-actions">
                  <button className="checkout-btn" onClick={() => setShowPaymentModal(true)}>
                    🚀 Checkout — ₹{getCartTotal()}
                  </button>
                </div>
              </>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowPaymentModal(false)}>
                <div className="checkout-modal">
                  <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
                  <h3>💳 Payment & Delivery</h3>

                  <div className="modal-section">
                    <label>📍 Delivery Address</label>
                    <input value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Enter your full delivery address" />
                  </div>

                  <div className="modal-section">
                    <label>Payment Method</label>
                    <div className="payment-methods">
                      {['UPI', 'CARD', 'COD'].map(m => (
                        <button key={m} type="button" className={`payment-method-btn ${selectedPaymentMethod === m ? 'active' : ''}`} onClick={() => setSelectedPaymentMethod(m)}>
                          {m === 'UPI' ? '📱 UPI' : m === 'CARD' ? '💳 Card' : '💵 Cash on Delivery'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPaymentMethod === 'UPI' && (
                    <div className="modal-section">
                      <label>UPI ID</label>
                      <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
                      <p className="payment-note">Pay securely using any UPI app (GPay, PhonePe, Paytm).</p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'CARD' && (
                    <div className="payment-grid">
                      <div className="modal-section full-width">
                        <label>Card Number</label>
                        <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} />
                      </div>
                      <div className="modal-section">
                        <label>Card Holder Name</label>
                        <input value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="Name on card" />
                      </div>
                      <div className="modal-section">
                        <label>Expiry (MM/YY)</label>
                        <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="MM/YY" maxLength={5} />
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'COD' && (
                    <div className="modal-section payment-note">💵 Pay cash when your order arrives at your door.</div>
                  )}

                  <div className="modal-section">
                    <label>🏷️ Coupon Code</label>
                    <div className="coupon-row">
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="e.g. WELCOME20" />
                      <button type="button" onClick={applyCoupon}>Apply</button>
                    </div>
                    {couponMessage && <p className="coupon-message">{couponMessage}</p>}
                    <div className="coupon-hints">Try: WELCOME20 · FLAT50 · PIZZA10 · SAVE100</div>
                  </div>

                  <div className="modal-summary">
                    <div className="summary-row"><span>Subtotal</span><span>₹{getCartTotal()}</span></div>
                    {discountAmount > 0 && <div className="summary-row discount"><span>Discount</span><span>−₹{discountAmount.toFixed(2)}</span></div>}
                    <div className="summary-row total"><span>Total</span><span>₹{getGrandTotal()}</span></div>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout} disabled={paymentProcessing}>
                    {paymentProcessing ? '⏳ Processing...' : `Pay ₹${getGrandTotal()}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>📋 Order History</h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No orders yet</h3>
                <p>Place your first order to see it here!</p>
              </div>
            ) : (
              <div className="orders-list">
                {[...orders].reverse().map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h4>Order #{order.id}</h4>
                        <p className="order-meta">
                          {restaurants.find(r => r.id === order.restaurantId)?.name || `Restaurant #${order.restaurantId}`}
                          {order.paymentMethod && ` • ${order.paymentMethod}`}
                        </p>
                      </div>
                      <span className={`status ${order.status?.toLowerCase()}`}>{statusLabel[order.status] || order.status}</span>
                    </div>
                    <div className="order-timeline">
                      {['PENDING', 'CONFIRMED', 'READY', 'COMPLETED'].map((s, i) => {
                        const flow = ['PENDING', 'CONFIRMED', 'READY', 'COMPLETED'];
                        const currentIdx = flow.indexOf(order.status);
                        const done = i <= currentIdx;
                        return (
                          <div key={s} className={`timeline-step ${done ? 'done' : ''}`}>
                            <div className="timeline-dot" />
                            <span>{s === 'PENDING' ? '⏳' : s === 'CONFIRMED' ? '✅' : s === 'READY' ? '🍽️' : '🎉'} {s}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="order-details">
                      <p>Total: <strong>₹{order.totalPrice}</strong></p>
                      {order.discountAmount > 0 && <p>Saved: <strong>₹{order.discountAmount}</strong></p>}
                      {order.deliveryAddress && <p>📍 {order.deliveryAddress}</p>}
                    </div>
                    {order.status === 'PENDING' && (
                      <button className="cancel-btn" onClick={() => cancelOrder(order.id)}>Cancel Order</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FAVORITES ── */}
        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <h2>❤️ Your Favorites</h2>
            {favorites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3>No favorites yet</h3>
                <p>Tap the heart on any item to save it here!</p>
              </div>
            ) : (
              <div className="menu-grid">
                {menuItems.filter(item => favorites.includes(item.id)).map(item => (
                  <div key={item.id} className="menu-card favorite">
                    <div className="card-header">
                      <img src={getImageSrc(item.imageUrl)} alt={item.name} className="menu-image" onError={e => { e.target.onerror = null; e.target.src = '/images/food-default.svg'; }} />
                      <button className="favorite-btn active" onClick={() => toggleFavorite(item.id)}>❤️</button>
                    </div>
                    <div className="card-content">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-details">
                        <span className="price">₹{item.price}</span>
                        <div className="rating">⭐ {item.rating || '4.5'}</div>
                      </div>
                      <button onClick={() => addToCart(item)} disabled={item.stock === 0} className="add-btn">
                        {item.stock === 0 ? 'Out of Stock' : '+ ADD'}
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
