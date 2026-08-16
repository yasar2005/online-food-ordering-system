import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'READY', 'COMPLETED'];
const STATUS_COLORS = {
  PENDING: '#f39c12', CONFIRMED: '#3498db', READY: '#9b59b6',
  COMPLETED: '#27ae60', CANCELLED: '#e74c3c'
};

const getImageSrc = (url) => {
  if (!url) return '/images/food-default.svg';
  if (url.startsWith('http')) return url;
  return url.startsWith('/') ? url : `/images/${url}`;
};

const AdminDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    const [ordersRes, restRes] = await Promise.all([
      api.get('/orders'),
      api.get('/restaurants')
    ]);
    setOrders(ordersRes.data || []);
    setRestaurants(restRes.data || []);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (orderId, newStatus) => {
    await api.patch(`/orders/${orderId}/status`, { status: newStatus });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} → ${newStatus}`);
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const getRestaurantName = (id) => restaurants.find(r => r.id === id)?.name || `Restaurant #${id}`;

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(o => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    active: orders.filter(o => ['CONFIRMED', 'READY'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    revenue: orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + parseFloat(o.totalPrice || 0), 0)
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'success' ? '#27ae60' : '#e74c3c',
          color: '#fff', padding: '12px 20px', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontWeight: 600
        }}>{toast.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: '#1a1a2e', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>🍽️ FoodieHub Admin</h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Welcome back, {user.name}</p>
        </div>
        <button onClick={onLogout} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, padding: '24px 32px 0' }}>
        {[
          { label: 'Total Orders', value: stats.total, color: '#667eea' },
          { label: 'Pending', value: stats.pending, color: '#f39c12' },
          { label: 'Active', value: stats.active, color: '#3498db' },
          { label: 'Completed', value: stats.completed, color: '#27ae60' },
          { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, color: '#e74c3c' }
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '24px 32px 0', borderBottom: '1px solid #e9ecef', background: '#fff', marginTop: 24 }}>
        {['orders', 'restaurants'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', padding: '12px 24px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize',
            color: activeTab === tab ? '#667eea' : '#666',
            borderBottom: activeTab === tab ? '2px solid #667eea' : '2px solid transparent'
          }}>{tab === 'orders' ? '📋 Orders' : '🏪 Restaurants'}</button>
        ))}
      </div>

      <div style={{ padding: '24px 32px' }}>
        {activeTab === 'orders' && (
          <>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {['ALL', ...STATUS_FLOW, 'CANCELLED'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.8rem',
                  background: filterStatus === s ? (STATUS_COLORS[s] || '#667eea') : '#f0f0f0',
                  color: filterStatus === s ? '#fff' : '#555'
                }}>{s}</button>
              ))}
              <button onClick={fetchAll} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: '1px solid #667eea', background: '#fff', color: '#667eea', cursor: 'pointer', fontWeight: 600 }}>
                🔄 Refresh
              </button>
            </div>

            {/* Orders Table */}
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    {['Order ID', 'Customer ID', 'Restaurant', 'Items', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#999' }}>No orders found</td></tr>
                  ) : filteredOrders.map((order, i) => (
                    <tr key={order.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#333' }}>#{order.id}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>#{order.customerId}</td>
                      <td style={{ padding: '12px 16px', color: '#333' }}>{getRestaurantName(order.restaurantId)}</td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.85rem' }}>
                        {order.discountAmount > 0 && <span style={{ color: '#27ae60', fontSize: '0.75rem' }}>-₹{order.discountAmount} off</span>}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#27ae60' }}>₹{order.totalPrice}</td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '0.85rem' }}>{order.paymentMethod || 'COD'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          background: STATUS_COLORS[order.status] + '20',
                          color: STATUS_COLORS[order.status],
                          padding: '4px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 700
                        }}>{order.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {getNextStatus(order.status) && (
                          <button onClick={() => updateStatus(order.id, getNextStatus(order.status))} style={{
                            background: '#667eea', color: '#fff', border: 'none', padding: '6px 12px',
                            borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                          }}>→ {getNextStatus(order.status)}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'restaurants' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {restaurants.map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <img src={getImageSrc(r.imageUrl)} alt={r.name} style={{ width: '100%', height: 160, objectFit: 'cover' }}
                  onError={e => { e.target.onerror = null; e.target.src = '/images/food-default.svg'; }} />
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: '0 0 4px', color: '#333' }}>{r.name}</h3>
                  <p style={{ margin: '0 0 8px', color: '#666', fontSize: '0.85rem' }}>{r.cuisine} • {r.address}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ background: '#fff3cd', color: '#856404', padding: '3px 8px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>⭐ {r.rating}</span>
                    <span style={{ background: '#d4edda', color: '#155724', padding: '3px 8px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>🕐 {r.deliveryTime} min</span>
                    <span style={{ background: '#cce5ff', color: '#004085', padding: '3px 8px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>
                      {orders.filter(o => o.restaurantId === r.id).length} orders
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
