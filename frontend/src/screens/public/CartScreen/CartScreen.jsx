import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingBag,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiCheck,
  FiX,
  FiTag,
  FiPercent,
  FiHeart,
  FiPackage,
  FiShield,
  FiGift,
  FiPhone,
  FiFileText,
} from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { toast } from "react-toastify";
import { removeFromCart, updateQty } from "../../../slices/cartSlice";
import "./CartScreen.css";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Formatter les prix en XPF
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " XPF";
  };

  // Gérer la quantité
  const handleUpdateQty = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > item.countInStock) {
      toast.warning(`Stock maximum disponible : ${item.countInStock}`);
      return;
    }
    dispatch(updateQty({ _id: item._id, qty: newQty }));
  };

  // Supprimer un article
  const handleRemoveItem = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} retiré du panier`);
  };

  // Appliquer un code promo
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim()) {
      toast.info("Code promo non valide");
    }
  };

  // Passer à la commande - Redirige vers les CGV d'abord
  const handleCheckout = () => {
    // Toujours rediriger vers les conditions générales
    // La page CGV gèrera la connexion/inscription si nécessaire
    navigate("/conditions-generales?redirect=/checkout");
  };

  // Nombre total d'articles
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Panier vide
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__container">
          <div className="cart-empty__visual">
            <div className="cart-empty__icon-wrapper">
              <div className="cart-empty__icon">
                <FiShoppingBag />
              </div>
              <div className="cart-empty__sparkle cart-empty__sparkle--1"></div>
              <div className="cart-empty__sparkle cart-empty__sparkle--2"></div>
              <div className="cart-empty__sparkle cart-empty__sparkle--3"></div>
            </div>
          </div>

          <div className="cart-empty__content">
            <h1 className="cart-empty__title">Votre panier est vide</h1>
            <p className="cart-empty__text">
              Découvrez notre collection de produits éco-responsables fabriqués
              à partir de plastique recyclé en Nouvelle-Calédonie.
            </p>
            <Link to="/products" className="cart-empty__btn">
              <FiPackage />
              Découvrir nos produits
            </Link>
          </div>

          <div className="cart-empty__features">
            <div className="cart-empty__feature">
              <div className="cart-empty__feature-icon">
                <FiMapPin />
              </div>
              <div className="cart-empty__feature-text">
                <strong>Pick & Collect</strong>
                <span>Retrait gratuit en point de collecte</span>
              </div>
            </div>
            <div className="cart-empty__feature">
              <div className="cart-empty__feature-icon">
                <HiOutlineBanknotes />
              </div>
              <div className="cart-empty__feature-text">
                <strong>Paiement au retrait</strong>
                <span>Payez en espèces à la récupération</span>
              </div>
            </div>
            <div className="cart-empty__feature">
              <div className="cart-empty__feature-icon">
                <FiGift />
              </div>
              <div className="cart-empty__feature-text">
                <strong>100% Éco-responsable</strong>
                <span>Produits recyclés localement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* Hero Header */}
      <div className="cart-hero">
        <div className="cart-hero__bg"></div>
        <div className="cart-hero__content">
          <Link to="/products" className="cart-hero__back">
            <FiArrowLeft />
            <span>Continuer mes achats</span>
          </Link>
          <div className="cart-hero__title-wrapper">
            <div className="cart-hero__icon">
              <FiShoppingBag />
            </div>
            <div>
              <h1 className="cart-hero__title">Mon Panier</h1>
              <p className="cart-hero__subtitle">
                {totalItems} article{totalItems > 1 ? "s" : ""} • Pick & Collect
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bannière Pick & Collect */}
      <div className="cart-banner">
        <div className="cart-banner__content">
          <div className="cart-banner__icon">
            <FiMapPin />
          </div>
          <div className="cart-banner__text">
            <strong>Retrait gratuit en point de collecte</strong>
            <span>
              Paiement en espèces au moment du retrait de votre commande
            </span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="cart-main">
        <div className="cart-content">
          {/* Liste des articles */}
          <div className="cart-items">
            <div className="cart-items__header">
              <h2 className="cart-items__title">
                <FiPackage />
                Articles ({totalItems})
              </h2>
            </div>

            <div className="cart-items__list">
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="cart-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <Link
                    to={`/product/${item._id}`}
                    className="cart-item__image"
                  >
                    <img src={item.image} alt={item.name} />
                    {item.isOnSale && (
                      <span className="cart-item__badge">
                        <FiPercent />
                      </span>
                    )}
                  </Link>

                  {/* Détails */}
                  <div className="cart-item__details">
                    <div className="cart-item__header">
                      <div className="cart-item__info">
                        <Link
                          to={`/product/${item._id}`}
                          className="cart-item__name"
                        >
                          {item.name}
                        </Link>
                        {item.brand && (
                          <span className="cart-item__brand">{item.brand}</span>
                        )}
                      </div>
                      <div className="cart-item__actions-mobile">
                        <button
                          className="cart-item__action cart-item__action--remove"
                          onClick={() => handleRemoveItem(item._id, item.name)}
                          aria-label="Supprimer"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Stock & Variantes */}
                    <div className="cart-item__meta">
                      {item.countInStock > 0 ? (
                        <span className="cart-item__stock cart-item__stock--available">
                          <FiCheck /> En stock
                        </span>
                      ) : (
                        <span className="cart-item__stock cart-item__stock--unavailable">
                          <FiX /> Rupture
                        </span>
                      )}
                      {item.variantColor && (
                        <span className="cart-item__variant">
                          {item.variantColor}
                        </span>
                      )}
                    </div>

                    {/* Prix & Quantité */}
                    <div className="cart-item__footer">
                      <div className="cart-item__price">
                        {item.salePrice && item.salePrice < item.price ? (
                          <>
                            <span className="cart-item__price-current">
                              {formatPrice(item.salePrice)}
                            </span>
                            <span className="cart-item__price-original">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="cart-item__price-current">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>

                      <div className="cart-item__qty">
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => handleUpdateQty(item, item.qty - 1)}
                          disabled={item.qty <= 1}
                          aria-label="Diminuer"
                        >
                          <FiMinus />
                        </button>
                        <span className="cart-item__qty-value">{item.qty}</span>
                        <button
                          className="cart-item__qty-btn"
                          onClick={() => handleUpdateQty(item, item.qty + 1)}
                          disabled={item.qty >= item.countInStock}
                          aria-label="Augmenter"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <div className="cart-item__total">
                        {formatPrice(item.price * item.qty)}
                      </div>
                    </div>
                  </div>

                  {/* Actions Desktop */}
                  <div className="cart-item__actions">
                    <button
                      className="cart-item__action"
                      title="Ajouter aux favoris"
                      aria-label="Favoris"
                    >
                      <FiHeart />
                    </button>
                    <button
                      className="cart-item__action cart-item__action--remove"
                      onClick={() => handleRemoveItem(item._id, item.name)}
                      title="Supprimer"
                      aria-label="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="cart-sidebar">
            {/* Code promo */}
            <div className="cart-card cart-promo">
              <div className="cart-card__header">
                <FiTag />
                <h3>Code promo</h3>
              </div>
              <form className="cart-promo__form" onSubmit={handleApplyPromo}>
                <input
                  type="text"
                  placeholder="Entrez votre code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="cart-promo__input"
                />
                <button type="submit" className="cart-promo__btn">
                  Appliquer
                </button>
              </form>
              {promoApplied && (
                <div className="cart-promo__success">
                  <FiCheck /> Code appliqué !
                </div>
              )}
            </div>

            {/* Récapitulatif */}
            <div className="cart-card cart-summary">
              <div className="cart-card__header">
                <FiShoppingBag />
                <h3>Récapitulatif</h3>
              </div>

              <div className="cart-summary__lines">
                <div className="cart-summary__line">
                  <span>Sous-total ({totalItems} articles)</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>

                <div className="cart-summary__line cart-summary__line--free">
                  <span>
                    <FiMapPin />
                    Retrait en point de collecte
                  </span>
                  <span className="cart-summary__free-badge">Gratuit</span>
                </div>

                {promoApplied && (
                  <div className="cart-summary__line cart-summary__line--discount">
                    <span>Réduction</span>
                    <span>-{formatPrice(Math.round(itemsPrice * 0.1))}</span>
                  </div>
                )}
              </div>

              <div className="cart-summary__total">
                <div className="cart-summary__total-label">
                  <span>Total à payer</span>
                  <span className="cart-summary__total-info">au retrait</span>
                </div>
                <span className="cart-summary__total-value">
                  {formatPrice(itemsPrice)}
                </span>
              </div>

              {/* Méthode de paiement */}
              <div className="cart-summary__payment-method">
                <div className="cart-summary__payment-icon">
                  <HiOutlineBanknotes />
                </div>
                <div className="cart-summary__payment-text">
                  <strong>Paiement en espèces</strong>
                  <span>À régler au moment du retrait</span>
                </div>
              </div>

              {/* Bouton Commander - Redirige vers CGV */}
              <button
                className="cart-summary__checkout"
                onClick={handleCheckout}
              >
                <FiFileText />
                <span>Valider et continuer</span>
                <FiArrowRight />
              </button>

              {/* Info CGV */}
              <p className="cart-summary__cgv-info">
                En continuant, vous serez invité à accepter nos{" "}
                <Link to="/conditions-generales">
                  conditions générales de vente
                </Link>
                {!userInfo && " et à vous connecter ou créer un compte"}.
              </p>

              {/* Info sécurité */}
              <div className="cart-summary__secure">
                <FiShield />
                <span>Commande sécurisée • Confirmation par email</span>
              </div>
            </div>

            {/* Avantages */}
            <div className="cart-card cart-advantages">
              <div className="cart-advantage">
                <div className="cart-advantage__icon">
                  <FiMapPin />
                </div>
                <div className="cart-advantage__text">
                  <strong>Pick & Collect</strong>
                  <span>Retirez dans nos points partenaires</span>
                </div>
              </div>

              <div className="cart-advantage">
                <div className="cart-advantage__icon">
                  <FiClock />
                </div>
                <div className="cart-advantage__text">
                  <strong>Prêt sous 24-48h</strong>
                  <span>Notification SMS dès que c'est prêt</span>
                </div>
              </div>

              <div className="cart-advantage">
                <div className="cart-advantage__icon">
                  <HiOutlineBanknotes />
                </div>
                <div className="cart-advantage__text">
                  <strong>Payez au retrait</strong>
                  <span>Paiement en espèces uniquement</span>
                </div>
              </div>

              <div className="cart-advantage">
                <div className="cart-advantage__icon">
                  <FiGift />
                </div>
                <div className="cart-advantage__text">
                  <strong>Éco-responsable</strong>
                  <span>Recyclé en Nouvelle-Calédonie</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="cart-card cart-contact">
              <FiPhone />
              <div>
                <strong>Besoin d'aide ?</strong>
                <a href="tel:+687123456">+687 12 34 56</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
