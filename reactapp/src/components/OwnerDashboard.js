import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import '../dashboard.css';

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'READY', 'COMPLETED'];
const STATUS_COLORS = { PENDING: '#f5a623', CONFIRMED: '#3498db', READY: '#9b59b6', COMPLETED: '#3ab757', CANCELLED: '#e23744' };

const OwnerDashboard = ({ user, onLogout }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [toast, setToast] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const restRes = await api.get('/restaurants');
      const myRest = restRes.data.find(r => r.userId === user.id);
      if (myRest) {
        setRestaurant(myRest);
        const [menuRes, ordersRes] = await Promise.all([
          api.get(`/menu-items/restaurant/${myRest.id}`),
          api.get(`/orders/restaurant/${myRest.id}`)
        ]);
        setMenuItems(menuRes.data || []);
        setOrders(ordersRes.data || []);
      }
    } catch {
      showToast('Unable to load dashboard data', 'error');
    }
  }, [user.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order #${orderId} → ${status}`);
    } catch {
      showToast('Unable to update status', 'error');
    }
  };

  const getNextStatus = (current) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  const saveItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/menu-items/${editItem.id}`, editItem);
      setMenuItems(prev => prev.map(i => i.id === editItem.id ? editItem : i));
      setEditItem(null);
      showToast('Item updated!');
    } catch {
      showToast('Failed to update item', 'error');
    }
  };

  const S = {
    page:    { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1c1c1c' },
    header:  { background: '#fff', padding: '0 32px', height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    logo:    { fontSize: '1.4rem', fontWeight: 800, color: '#e23744' },
    logoutBtn: { background: 'none', border: '1.5px solid #e23744', color: '#e23744', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' },
    tabBar:  { display: 'flex', background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 32px' },
    tab:     (active) => ({ background: 'none', border: 'none', padding: '14px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', color: active ? '#e23744' : '#686b78', borderBottom: active ? '2px solid #e23744' : '2px solid transparent' }),
    content: { padding: '20px 32px' },
    card:    { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 12 },
    badge:   (color) => ({ background: color + '20', color, padding: '3px 9px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700 }),
    actionBtn: { background: '#e23744', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 },
  };

  if (!restaurant) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏪</div>
          <h2 style={{ marginBottom: 16 }}>No restaurant linked to your account</h2>
          <button onClick={onLogout} style={S.logoutBtn}>Logout</button>
        </div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    active: orders.filter(o => ['CONFIRMED', 'READY'].includes(o.status)).length,
    revenue: orders.filter(o => o.status === 'COMPLETED').reduce((s, o) => s + parseFloat(o.totalPrice || 0), 0)
  };

  return (
    <div style={S.page}>
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, background: toast.type === 'success' ? '#3ab757' : '#e23744', color: '#fff', padding: '11px 18px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '0.88rem' }}>
          {toast.msg}
        </div>
      )}

      <div style={S.header}>
        <div style={S.logo}>{restaurant.name} <span style={{ color: '#686b78', fontSize: '0.85rem', fontWeight: 500 }}>Owner</span></div>
        <span style={{ color: '#686b78', fontSize: '0.85rem' }}>{restaurant.cuisine} · {restaurant.address}</span>
        <button onClick={onLogout} style={S.logoutBtn}>Logout</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, padding: '20px 32px 0' }}>
        {[
          { label: 'Total Orders', value: stats.total,   color: '#e23744' },
          { label: 'Pending',      value: stats.pending, color: '#f5a623' },
          { label: 'Active',       value: stats.active,  color: '#3498db' },
          { label: 'Revenue',      value: `₹${stats.revenue.toFixed(0)}`, color: '#3ab757' }
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 20px', borderTop: `3px solid ${s.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '1.7rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: '#686b78', fontSize: '0.82rem', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={S.tabBar}>
        {['orders', 'menu'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={S.tab(activeTab === tab)}>
            {tab === 'orders' ? '📋 Orders' : '🍽️ Menu'}
          </button>
        ))}
      </div>

      <div style={S.content}>
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Order', 'Total', 'Payment', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#686b78', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#f9f9f9' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>No orders yet</td></tr>
                ) : [...orders].reverse().map(order => (
                  <tr key={order.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>#{order.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#3ab757' }}>₹{order.totalPrice}</td>
                    <td style={{ padding: '12px 16px', color: '#686b78', fontSize: '0.85rem' }}>{order.paymentMethod || 'COD'}</td>
                    <td style={{ padding: '12px 16px' }}><span style={S.badge(STATUS_COLORS[order.status])}>{order.status}</span></td>
                    <td style={{ padding: '12px 16px' }}>
                      {getNextStatus(order.status) && (
                        <button onClick={() => updateStatus(order.id, getNextStatus(order.status))} style={S.actionBtn}>
                          → {getNextStatus(order.status)}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'menu' && (
          <>
            {editItem && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <form onSubmit={saveItem} style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440 }}>
                  <h3 style={{ margin: '0 0 20px', fontWeight: 700 }}>Edit Item</h3>
                  {[
                    { label: 'Name', key: 'name', type: 'text' },
                    { label: 'Price (₹)', key: 'price', type: 'number' },
                    { label: 'Stock', key: 'stock', type: 'number' },
                    { label: 'Description', key: 'description', type: 'text' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#686b78', marginBottom: 5, textTransform: 'uppercase' }}>{f.label}</label>
                      <input type={f.type} value={editItem[f.key] || ''} onChange={e => setEditItem({ ...editItem, [f.key]: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: '0.92rem' }} required />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button type="submit" style={{ flex: 1, background: '#e23744', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save</button>
                    <button type="button" onClick={() => setEditItem(null)} style={{ flex: 1, background: '#f5f5f5', color: '#1c1c1c', border: 'none', padding: 12, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {menuItems.map(item => (
                <div key={item.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</h4>
                      <span style={{ fontWeight: 800, color: '#1c1c1c' }}>₹{item.price}</span>
                    </div>
                    <p style={{ margin: '0 0 10px', color: '#686b78', fontSize: '0.8rem', lineHeight: 1.4 }}>{item.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={S.badge(item.stock > 0 ? '#3ab757' : '#e23744')}>{item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}</span>
                      <button onClick={() => setEditItem({ ...item })} style={{ background: 'none', border: '1.5px solid #e23744', color: '#e23744', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
