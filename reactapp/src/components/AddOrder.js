import React, { useState } from 'react';
import api from '../utils/api';

const AddOrder = ({ onOrderAdded }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    cuisineType: '',
    menuItemName: '',
    menuItemDescription: '',
    menuItemPrice: '',
    quantity: '',
    orderStatus: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.restaurantName.trim() || !formData.menuItemName.trim() || 
        !formData.menuItemPrice || !formData.quantity) {
      alert('Please fill in required fields: Restaurant Name, Menu Item Name, Price, and Quantity');
      return;
    }

    try {
      await api.post('/orders', {
        ...formData,
        cuisineType: formData.cuisineType || 'Not specified',
        menuItemDescription: formData.menuItemDescription || 'No description',
        orderStatus: formData.orderStatus || 'Pending',
        menuItemPrice: parseFloat(formData.menuItemPrice),
        quantity: parseInt(formData.quantity)
      });
      
      alert('Order submitted successfully!');
      
      setFormData({
        restaurantName: '',
        cuisineType: '',
        menuItemName: '',
        menuItemDescription: '',
        menuItemPrice: '',
        quantity: '',
        orderStatus: ''
      });
      
      onOrderAdded();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="restaurantName">
            🏪 Restaurant Name <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="restaurantName"
            name="restaurantName"
            placeholder="Enter restaurant name"
            value={formData.restaurantName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cuisineType">
            🍽️ Cuisine Type
          </label>
          <select
            id="cuisineType"
            name="cuisineType"
            value={formData.cuisineType}
            onChange={handleChange}
          >
            <option value="">Select cuisine type</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
            <option value="Thai">Thai</option>
            <option value="Japanese">Japanese</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="menuItemName">
            🍕 Menu Item <span className="required-asterisk">*</span>
          </label>
          <input
            type="text"
            id="menuItemName"
            name="menuItemName"
            placeholder="Enter menu item name"
            value={formData.menuItemName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="menuItemDescription">
            📝 Description
          </label>
          <input
            type="text"
            id="menuItemDescription"
            name="menuItemDescription"
            placeholder="Brief description of the item"
            value={formData.menuItemDescription}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="menuItemPrice">
            💰 Price <span className="required-asterisk">*</span>
          </label>
          <input
            type="number"
            id="menuItemPrice"
            name="menuItemPrice"
            placeholder="0.00"
            value={formData.menuItemPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">
            📦 Quantity <span className="required-asterisk">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="1"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="orderStatus">
            📊 Order Status
          </label>
          <select
            id="orderStatus"
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleChange}
          >
            <option value="">Select status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>
      
      <button type="submit" className="submit-btn">
        🚀 Place Order
      </button>
    </form>
  );
};

export default AddOrder;