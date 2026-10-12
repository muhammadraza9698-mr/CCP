import React from 'react';
import { Link } from 'react-router-dom';
import { useAllOrders } from '../api/hooks';
import { useProducts } from '../api/hooks';

const AdminDashboard = () => {
    const { products, isLoading: productsLoading } = useProducts();
    const { orders, isLoading: ordersLoading } = useAllOrders();

    const stats = {
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter((o) => o.orderStatus === 'pending').length || 0,
    };

    const recentOrders = orders?.slice(0, 5) || [];

    if (productsLoading || ordersLoading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-number">{stats.totalProducts}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Orders</h3>
                    <p className="stat-number">{stats.pendingOrders}</p>
                </div>
            </div>

            <div className="admin-actions">
                <Link to="/admin/products" className="admin-action-btn">
                    Manage Products
                </Link>
            </div>

            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-8)}</td>
                                        <td>{order.user?.name || 'N/A'}</td>
                                        <td>₹{order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${order.orderStatus}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No orders yet</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
