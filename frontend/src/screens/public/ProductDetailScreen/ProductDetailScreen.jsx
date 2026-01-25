import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiChevronLeft,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiCheck,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiPackage,
  FiDroplet,
  FiMapPin,
  FiStar,
  FiMinus,
  FiPlus,
  FiChevronRight,
  FiInfo,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { useGetProductByIdQuery } from "../../../slices/productApiSlice";
import { addToCart } from "../../../slices/cartSlice";
import * as THREE from "three";
import "./ProductDetailScreen.css";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);

  // State
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // API
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);

  // Cart
  const cart = useSelector((state) => state.cart);

  // All images (main + gallery)
  const allImages = product ? [product.image, ...(product.images || [])] : [];

  // Three.js Background (subtle)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 400,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixRatio = Math.random();
      colors[i * 3] = 0.06 + mixRatio * 0.35;
      colors[i * 3 + 1] = 0.73 + mixRatio * 0.18;
      colors[i * 3 + 2] = 0.51 + mixRatio * 0.47;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 5;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, 400);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Handlers
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    // Optional: show toast or navigate to cart
  };

  const handleQuantityChange = (delta) => {
    const newQty = qty + delta;
    if (newQty >= 1 && newQty <= (product?.countInStock || 10)) {
      setQty(newQty);
    }
  };

  const handleImageZoom = (e) => {
    if (!isZoomed) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("fr-FR") + " XPF";
  };

  const getDiscountPercentage = () => {
    if (product?.isOnSale && product?.salePrice) {
      return Math.round(
        ((product.price - product.salePrice) / product.price) * 100,
      );
    }
    return 0;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="product-page">
        <div className="product-page__loading">
          <div className="product-page__spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-page">
        <div className="product-page__error">
          <FiAlertCircle />
          <h2>Produit non trouvé</h2>
          <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/products" className="product-page__error-btn">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* Breadcrumb Header */}
      <header className="product-page__header">
        <canvas ref={canvasRef} className="product-page__header-canvas" />
        <div className="product-page__header-overlay"></div>
        <div className="product-page__header-content">
          <Link to="/products" className="product-page__back">
            <FiChevronLeft />
            <span>Retour aux produits</span>
          </Link>
          <nav className="product-page__breadcrumb">
            <Link to="/">Accueil</Link>
            <FiChevronRight />
            <Link to="/products">Produits</Link>
            {product?.universe && (
              <>
                <FiChevronRight />
                <Link to={`/products?universe=${product.universe._id}`}>
                  {product.universe.name}
                </Link>
              </>
            )}
            {product?.subUniverse && (
              <>
                <FiChevronRight />
                <span>{product.subUniverse.name}</span>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="product-page__main">
        <div className="product-page__container">
          {/* Gallery Section */}
          <section className="product-page__gallery">
            {/* Badges */}
            <div className="product-page__badges">
              {product?.isNewProduct && (
                <span className="product-page__badge product-page__badge--new">
                  Nouveau
                </span>
              )}
              {product?.isOnSale && (
                <span className="product-page__badge product-page__badge--sale">
                  -{getDiscountPercentage()}%
                </span>
              )}
              {product?.isDestockage && (
                <span className="product-page__badge product-page__badge--destockage">
                  Déstockage
                </span>
              )}
              {product?.isComingSoon && (
                <span className="product-page__badge product-page__badge--coming">
                  Bientôt
                </span>
              )}
              {product?.isFeatured && (
                <span className="product-page__badge product-page__badge--featured">
                  ⭐ Vedette
                </span>
              )}
            </div>

            {/* Main Image */}
            <div
              className={`product-page__image-main ${isZoomed ? "is-zoomed" : ""}`}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageZoom}
            >
              <img
                src={
                  allImages[activeImage] || "/images/placeholder-product.jpg"
                }
                alt={product?.name}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: "scale(2)",
                      }
                    : {}
                }
              />
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="product-page__thumbnails">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    className={`product-page__thumbnail ${activeImage === index ? "is-active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img} alt={`${product?.name} - ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Info Section */}
          <section className="product-page__info">
            {/* Category & Universe */}
            <div className="product-page__meta">
              {product?.subUniverse && (
                <span className="product-page__category">
                  {product.subUniverse.name}
                </span>
              )}
              {product?.category && (
                <span className="product-page__category-tag">
                  {product.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="product-page__title">{product?.name}</h1>

            {/* Rating */}
            {product?.numReviews > 0 && (
              <div className="product-page__rating">
                <div className="product-page__stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(product.rating) ? "filled" : ""}
                    />
                  ))}
                </div>
                <span className="product-page__rating-text">
                  {product.rating.toFixed(1)} ({product.numReviews} avis)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="product-page__price-block">
              {product?.isOnSale && product?.salePrice ? (
                <>
                  <span className="product-page__price product-page__price--sale">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="product-page__price product-page__price--original">
                    {formatPrice(product.price)}
                  </span>
                  <span className="product-page__price-save">
                    Économisez {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              ) : (
                <span className="product-page__price">
                  {formatPrice(product?.price)}
                </span>
              )}
            </div>

            {/* Eco Impact */}
            <div className="product-page__eco">
              <div className="product-page__eco-icon">
                <FiDroplet />
              </div>
              <div className="product-page__eco-content">
                <strong>Impact écologique positif</strong>
                <p>
                  Ce produit est fabriqué à partir de{" "}
                  <strong>{product?.plasticType}</strong> recyclé, collecté{" "}
                  {product?.plasticOrigin}.
                </p>
              </div>
            </div>

            {/* Availability */}
            {product?.isComingSoon ? (
              <div className="product-page__availability product-page__availability--coming">
                <FiClock />
                <span>
                  Bientôt disponible
                  {product.availableDate && (
                    <>
                      {" "}
                      - Prévu le{" "}
                      {new Date(product.availableDate).toLocaleDateString(
                        "fr-FR",
                      )}
                    </>
                  )}
                </span>
              </div>
            ) : product?.countInStock > 0 ? (
              <div className="product-page__availability product-page__availability--instock">
                <FiCheck />
                <span>En stock ({product.countInStock} disponibles)</span>
              </div>
            ) : (
              <div className="product-page__availability product-page__availability--outstock">
                <FiAlertCircle />
                <span>Rupture de stock</span>
              </div>
            )}

            {/* Add to Cart */}
            {!product?.isComingSoon && product?.countInStock > 0 && (
              <div className="product-page__actions">
                <div className="product-page__quantity">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={qty <= 1}
                    aria-label="Diminuer la quantité"
                  >
                    <FiMinus />
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={qty >= product.countInStock}
                    aria-label="Augmenter la quantité"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  className="product-page__add-cart"
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart />
                  Ajouter au panier
                </button>
                <button
                  className="product-page__wishlist"
                  aria-label="Ajouter aux favoris"
                >
                  <FiHeart />
                </button>
              </div>
            )}

            {/* Coming Soon CTA */}
            {product?.isComingSoon && (
              <div className="product-page__coming-cta">
                <p>Soyez alerté de la disponibilité de ce produit</p>
                <button className="product-page__notify-btn">
                  <FiHeart />
                  M'alerter
                </button>
              </div>
            )}

            {/* Features */}
            <div className="product-page__features">
              <div className="product-page__feature">
                <FiTruck />
                <div>
                  <strong>Livraison NC</strong>
                  <span>Gratuite dès 10 000 XPF</span>
                </div>
              </div>
              <div className="product-page__feature">
                <FiShield />
                <div>
                  <strong>Qualité garantie</strong>
                  <span>Satisfait ou remboursé</span>
                </div>
              </div>
              <div className="product-page__feature">
                <FiRefreshCw />
                <div>
                  <strong>100% Recyclé</strong>
                  <span>Plastique océanique NC</span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="product-page__share">
              <span>Partager :</span>
              <div className="product-page__share-buttons">
                <button aria-label="Partager sur Facebook">
                  <FiShare2 />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Tabs Section */}
      <section className="product-page__tabs-section">
        <div className="product-page__tabs-container">
          {/* Tab Buttons */}
          <div className="product-page__tabs">
            <button
              className={activeTab === "description" ? "is-active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={activeTab === "details" ? "is-active" : ""}
              onClick={() => setActiveTab("details")}
            >
              Caractéristiques
            </button>
            <button
              className={activeTab === "care" ? "is-active" : ""}
              onClick={() => setActiveTab("care")}
            >
              Entretien
            </button>
            <button
              className={activeTab === "reviews" ? "is-active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Avis ({product?.numReviews || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="product-page__tab-content">
            {activeTab === "description" && (
              <div className="product-page__description">
                <p>{product?.description_fr}</p>
              </div>
            )}

            {activeTab === "details" && (
              <div className="product-page__details">
                <div className="product-page__details-grid">
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">Marque</span>
                    <span className="product-page__detail-value">
                      {product?.brand}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">Couleur</span>
                    <span className="product-page__detail-value">
                      {product?.color}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">Poids</span>
                    <span className="product-page__detail-value">
                      {product?.weight}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">
                      Dimensions
                    </span>
                    <span className="product-page__detail-value">
                      {product?.dimensions}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">
                      Type de plastique
                    </span>
                    <span className="product-page__detail-value product-page__detail-value--highlight">
                      {product?.plasticType}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">Origine</span>
                    <span className="product-page__detail-value">
                      {product?.plasticOrigin}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">
                      Catégorie
                    </span>
                    <span className="product-page__detail-value">
                      {product?.category}
                    </span>
                  </div>
                  <div className="product-page__detail">
                    <span className="product-page__detail-label">
                      Référence
                    </span>
                    <span className="product-page__detail-value">
                      {product?._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {product?.tags?.length > 0 && (
                  <div className="product-page__tags">
                    <span className="product-page__tags-label">Tags :</span>
                    <div className="product-page__tags-list">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="product-page__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "care" && (
              <div className="product-page__care">
                {product?.careInstructions ? (
                  <div className="product-page__care-content">
                    <FiInfo />
                    <p>{product.careInstructions}</p>
                  </div>
                ) : (
                  <div className="product-page__care-default">
                    <h4>Conseils d'entretien</h4>
                    <ul>
                      <li>Nettoyer avec un chiffon humide</li>
                      <li>Éviter l'exposition prolongée au soleil</li>
                      <li>Ne pas utiliser de produits abrasifs</li>
                      <li>Conserver à l'abri de l'humidité</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="product-page__reviews">
                {product?.reviews?.length > 0 ? (
                  <div className="product-page__reviews-list">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="product-page__review">
                        <div className="product-page__review-header">
                          <div className="product-page__review-avatar">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="product-page__review-meta">
                            <strong>{review.name}</strong>
                            <div className="product-page__review-stars">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={i < review.rating ? "filled" : ""}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="product-page__review-date">
                            {new Date(review.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                        <p className="product-page__review-comment">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="product-page__reviews-empty">
                    <FiStar />
                    <h4>Aucun avis pour le moment</h4>
                    <p>Soyez le premier à donner votre avis sur ce produit !</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Eco Section */}
      <section className="product-page__eco-section">
        <div className="product-page__eco-container">
          <div className="product-page__eco-card">
            <div className="product-page__eco-icon-large">🌊</div>
            <h3>Un geste pour l'océan</h3>
            <p>
              En achetant ce produit, vous contribuez directement à la
              dépollution des océans de Nouvelle-Calédonie. Chaque achat finance
              nos opérations de collecte.
            </p>
          </div>
          <div className="product-page__eco-card">
            <div className="product-page__eco-icon-large">♻️</div>
            <h3>Économie circulaire</h3>
            <p>
              Ce produit est fabriqué à 100% à partir de plastique recyclé,
              transformé localement dans notre atelier à Nouméa.
            </p>
          </div>
          <div className="product-page__eco-card">
            <div className="product-page__eco-icon-large">🇳🇨</div>
            <h3>Made in NC</h3>
            <p>
              Conçu et fabriqué en Nouvelle-Calédonie par des artisans locaux
              passionnés. Soutenez l'économie locale !
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductScreen;
