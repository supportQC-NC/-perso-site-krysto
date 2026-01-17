import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductScreen.css";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaArrowLeft,
  FaLeaf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError("Produit introuvable");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  // Loading
  if (loading) {
    return (
      <div className="product-container">
        <p>Chargement...</p>
      </div>
    );
  }

  // Erreur ou produit non trouvé
  if (error || !product) {
    return (
      <div className="product-container">
        <h2>Produit introuvable</h2>
        <Link to="/" className="btn-back">
          <FaArrowLeft /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="product-container">
      <Link to="/" className="btn-back">
        <FaArrowLeft /> Retour
      </Link>

      <div className="product-content">
        {/* Image */}
        <div className="product-image">
          {product.isNew && (
            <span className="product-badge">
              <FaLeaf /> Nouveau
            </span>
          )}
          <img src={product.image} alt={product.name} />
        </div>

        {/* Infos principales */}
        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="product-rating">
            <span className="product-stars">{renderStars(product.rating)}</span>
            <span className="product-reviews">
              {product.rating} ({product.numReviews} avis)
            </span>
          </div>

          <p className="product-price">{product.price} XPF</p>

          <p className="product-description">{product.description_fr}</p>

          {/* Type de plastique */}
          <div className="product-eco">
            <div className="eco-item">
              <MdOutlineRecycling className="eco-icon" />
              <div>
                <strong>Type de plastique</strong>
                <p>{product.plasticType}</p>
              </div>
            </div>
            <div className="eco-item">
              <FaLeaf className="eco-icon" />
              <div>
                <strong>Origine</strong>
                <p>{product.plasticOrigin}</p>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="product-stock">
            {product.countInStock > 0 ? (
              <span className="in-stock">
                <FaCheckCircle /> En stock ({product.countInStock} disponibles)
              </span>
            ) : (
              <span className="out-of-stock">
                <FaTimesCircle /> Rupture de stock
              </span>
            )}
          </div>

          {/* Bouton panier */}
          <button
            className="btn-add-cart"
            disabled={product.countInStock === 0}
          >
            <FaShoppingCart /> Ajouter au panier
          </button>
        </div>

        {/* Détails techniques */}
        <div className="product-details">
          <h3>Caractéristiques</h3>
          <table className="details-table">
            <tbody>
              <tr>
                <td>Marque</td>
                <td>{product.brand}</td>
              </tr>
              <tr>
                <td>Couleur</td>
                <td>{product.color}</td>
              </tr>
              <tr>
                <td>Poids</td>
                <td>{product.weight}</td>
              </tr>
              <tr>
                <td>Dimensions</td>
                <td>{product.dimensions}</td>
              </tr>
              <tr>
                <td>Catégorie</td>
                <td>{product.category}</td>
              </tr>
            </tbody>
          </table>

          <h3>Entretien</h3>
          <p className="care-instructions">{product.careInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
