import React, { useState } from 'react';
import { useProducts } from '../api/hooks';
import api from '../api/config';

const AdminProducts = () => {
    const { products, isLoading, mutate } = useProducts();
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Fruits',
        image: '',
        stock: '',
        isAvailable: true,
    });

    const handleChange = (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, formData);
                alert('Product updated successfully!');
            } else {
                await api.post('/api/products', formData);
                alert('Product created successfully!');
            }

            resetForm();
            mutate(); // Revalidate products list
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            isAvailable: product.isAvailable,
        });
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${productId}`);
                alert('Product deleted successfully!');
                mutate(); // Revalidate products list
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: 'Fruits',
            image: '',
            stock: '',
            isAvailable: true,
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    if (isLoading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="admin-products">
            <div className="admin-header">
                <h1>Product Management</h1>
                <button
                    className="add-product-btn"
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add New Product'}
                </button>
            </div>

            {showForm && (
                <div className="product-form-card">
                    <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Fruits">Fruits</option>
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Herbs">Herbs</option>
                                    <option value="Organic">Organic</option>
                                    <option value="Seasonal">Seasonal</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={handleChange}
                                    />
                                    Available for Sale
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                            <button type="button" className="cancel-btn" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-thumbnail"
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{product.price.toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <span
                                        className={`availability-badge ${product.isAvailable ? 'available' : 'unavailable'
                                            }`}
                                    >
                                        {product.isAvailable ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
