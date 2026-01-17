import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaLeaf,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";

const ProductCard = ({ product }) => {
  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <>
      <div className="card">
        {product.isNew && (
          <span className="card-badge">
            <FaLeaf /> Nouveau
          </span>
        )}
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} width="200" />
        </Link>
        <div className="card_body">
          <Link to={`/product/${product._id}`}>
            <h3>{product.name}</h3>
          </Link>

          <p className="card-plastic">
            <MdOutlineRecycling /> {product.plasticType}
          </p>

          <div className="card-rating">
            <span className="card-stars">{renderStars(product.rating)}</span>
            <span className="card-reviews">({product.numReviews})</span>
          </div>

          {/* <h3>{product.description_fr}</h3> */}

          <div className="card-footer">
            <p className="card-price">{product.price} XPF</p>
            <button className="card-btn">
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
