import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <div className="product-card">
            <div className="product-image" onClick={handleClick}>
                <img src={product.image} alt={product.name} />
                {!product.isAvailable && (
                    <div className="out-of-stock-overlay">Out of Stock</div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name" onClick={handleClick}>
                    {product.name}
                </h3>
                <p className="product-category">{product.category}</p>
                <div className="product-footer">
                    <span className="product-price">₹{product.price.toFixed(2)}</span>
                    <span className="product-stock">Stock: {product.stock}</span>
                </div>
                {product.isAvailable && product.stock > 0 ? (
                    <button
                        className="add-to-cart-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product._id);
                        }}
                    >
                        Add to Cart
                    </button>
                ) : (
                    <button className="add-to-cart-btn disabled" disabled>
                        Unavailable
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
