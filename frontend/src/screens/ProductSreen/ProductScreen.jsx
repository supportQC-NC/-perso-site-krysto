import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProductByIdQuery } from "../../slices/productApiSlice";
import { addToCart } from "../../slices/cartSlice";
import Loader from "../../components/global/Loader";
import Message from "../../components/global/Message";
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
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { MdOutlineRecycling } from "react-icons/md";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [showLoader, setShowLoader] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  // Gérer la quantité
  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const increaseQty = () => {
    if (qty < product.countInStock) setQty(qty + 1);
  };

  const handleQtyChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= product.countInStock) {
      setQty(value);
    }
  };

  // Ajouter au panier
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  // Loading
  if (isLoading || showLoader) return <Loader />;

  // Erreur ou produit non trouvé
  if (error || !product) {
    return (
      <div className="product-container">
        <Message variant="error" title="Produit introuvable">
          {error?.data?.message || "Ce produit n'existe pas ou a été supprimé"}
        </Message>
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
          {product.isNewProduct && (
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

          {/* Sélecteur de quantité */}
          {product.countInStock > 0 && (
            <div className="product-qty">
              <span className="qty-label">Quantité :</span>
              <div className="qty-selector">
                <button
                  className="qty-btn"
                  onClick={decreaseQty}
                  disabled={qty <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={qty}
                  onChange={handleQtyChange}
                  min="1"
                  max={product.countInStock}
                />
                <button
                  className="qty-btn"
                  onClick={increaseQty}
                  disabled={qty >= product.countInStock}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          {/* Bouton panier */}
          <button
            className="btn-add-cart"
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
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
