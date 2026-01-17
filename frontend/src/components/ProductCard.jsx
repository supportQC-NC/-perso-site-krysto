import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <>
      <div className="card">
        <a href={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} width="200" />
        </a>
        <div className="card_body">
          <a href={`/product/${product._id}`}>
            <h3>{product.name}</h3>
          </a>

          <h3>{product.description_fr}</h3>
          <p>{product.price} XPF</p>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
