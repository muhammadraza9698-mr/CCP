import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../api/hooks';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, isLoading, isError } = useProduct(id);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await api.post('/api/cart/add', { productId: product._id, quantity });
            alert('Product added to cart!');
            window.dispatchEvent(new Event('cartUpdated'));
            navigate('/cart');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (isLoading) {
        return <div className="loading">Loading product...</div>;
    }

    if (isError || !product) {
        return <div className="error-message">{isError?.message || 'Product not found'}</div>;
    }

    return (
        <div className="product-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>
                ← Back to Products
            </button>

            <div className="product-detail">
                <div className="product-detail-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <p className="product-category-badge">{product.category}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="product-price-section">
                        <span className="product-price-large">₹{product.price.toFixed(2)}</span>
                        <span className="product-stock-info">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>

                    {product.isAvailable && product.stock > 0 ? (
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="qty-btn"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))
                                    }
                                    min="1"
                                    max={product.stock}
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="qty-btn"
                                >
                                    +
                                </button>
                            </div>
                            <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    ) : (
                        <button className="add-to-cart-btn-large disabled" disabled>
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
