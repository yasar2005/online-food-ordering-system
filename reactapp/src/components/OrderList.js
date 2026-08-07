import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const OrderList = ({ refresh }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [refresh]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    return `order-status status-${statusLower}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  if (orders.length === 0) {
    return (
      <div className="no-orders">
        🍽️ No orders yet. Place your first order above!
      </div>
    );
  }

  return (
    <div className="orders-grid">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="restaurant-name">
              🏪 {order.restaurantName}
            </div>
            <div className={getStatusClass(order.orderStatus)}>
              {order.orderStatus || 'Pending'}
            </div>
          </div>
          
          <div className="menu-item">
            🍕 {order.menuItemName}
          </div>
          
          {order.menuItemDescription && (
            <div className="item-description">
              {order.menuItemDescription}
            </div>
          )}
          
          {order.cuisineType && (
            <div className="cuisine-type">
              🍽️ {order.cuisineType}
            </div>
          )}
          
          <div className="order-details">
            <div className="price-quantity">
              <div className="price">
                {formatPrice(order.menuItemPrice)}
              </div>
              <div className="quantity">
                Qty: {order.quantity}
              </div>
            </div>
            
            <button 
              className="delete-btn"
              onClick={() => handleDelete(order.id)}
              title="Delete order"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;