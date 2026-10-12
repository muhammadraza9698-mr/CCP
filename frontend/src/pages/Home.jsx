import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../api/hooks';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { products, isLoading, isError } = useProducts();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    const handleAddToCart = async (productId) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        try {
            await api.post('/api/cart/add', { productId, quantity: 1 });
            alert('Product added to cart!');
            // Trigger cart revalidation via event
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const categories = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Organic', 'Seasonal'];

    const filteredProducts = products.filter((product) => {
        const matchesCategory = filter === 'All' || product.category === filter;
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (isLoading) {
        return <div className="loading">Loading products...</div>;
    }

    if (isError) {
        return (
            <div className="error-message">
                Failed to load products. Please make sure the backend server is running.
                <br />
                <small>Backend should be running on http://localhost:5001</small>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to mfruit </h1>
                <p>Fresh produce delivered to your neighborhood</p>
            </div>

            <div className="filter-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="category-filters">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${filter === category ? 'active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onAddToCart={handleAddToCart}
                        />
                    ))
                ) : (
                    <p className="no-products">No products found</p>
                )}
            </div>
        </div>
    );
};

export default Home;
