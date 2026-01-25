import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiClock,
  FiCheck,
  FiPhone,
  FiMail,
  FiUser,
  FiPackage,
  FiShield,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiNavigation,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../../slices/orderApiSlice";
import { clearCart } from "../../../slices/cartSlice";
import "./CheckoutScren.css";

// Points de collecte en dur (à remplacer par l'API)
const COLLECT_POINTS = [
  {
    _id: "cp1",
    name: "Krysto - Atelier Principal",
    type: "primary",
    address: {
      street: "12 Rue de la Baie des Citrons",
      city: "Nouméa",
      postalCode: "98800",
      zone: "Nouméa Sud",
    },
    coordinates: { lat: -22.2758, lng: 166.4581 },
    phone: "+687 12 34 56",
    email: "atelier@krysto.nc",
    openingHours: [
      { day: "Lundi", hours: "08:00 - 17:00", isOpen: true },
      { day: "Mardi", hours: "08:00 - 17:00", isOpen: true },
      { day: "Mercredi", hours: "08:00 - 17:00", isOpen: true },
      { day: "Jeudi", hours: "08:00 - 17:00", isOpen: true },
      { day: "Vendredi", hours: "08:00 - 16:00", isOpen: true },
      { day: "Samedi", hours: "09:00 - 12:00", isOpen: true },
      { day: "Dimanche", hours: "Fermé", isOpen: false },
    ],
    description: "Notre atelier principal de fabrication et point de retrait.",
    image: "/images/collect-points/atelier.jpg",
    estimatedReady: "24h",
    isActive: true,
  },
  {
    _id: "cp2",
    name: "Marché de la Moselle",
    type: "partner",
    address: {
      street: "Place de la Moselle",
      city: "Nouméa",
      postalCode: "98800",
      zone: "Centre-ville",
    },
    coordinates: { lat: -22.2734, lng: 166.4422 },
    phone: "+687 23 45 67",
    email: "moselle@krysto.nc",
    openingHours: [
      { day: "Lundi", hours: "Fermé", isOpen: false },
      { day: "Mardi", hours: "06:00 - 12:00", isOpen: true },
      { day: "Mercredi", hours: "06:00 - 12:00", isOpen: true },
      { day: "Jeudi", hours: "06:00 - 12:00", isOpen: true },
      { day: "Vendredi", hours: "06:00 - 12:00", isOpen: true },
      { day: "Samedi", hours: "05:00 - 13:00", isOpen: true },
      { day: "Dimanche", hours: "05:00 - 12:00", isOpen: true },
    ],
    description: "Stand Krysto au marché - Retrait le matin uniquement.",
    image: "/images/collect-points/moselle.jpg",
    estimatedReady: "48h",
    isActive: true,
  },
  {
    _id: "cp3",
    name: "Éco-Point Magenta",
    type: "partner",
    address: {
      street: "45 Avenue du Maréchal Foch",
      city: "Nouméa",
      postalCode: "98800",
      zone: "Magenta",
    },
    coordinates: { lat: -22.2591, lng: 166.4647 },
    phone: "+687 34 56 78",
    email: "magenta@krysto.nc",
    openingHours: [
      { day: "Lundi", hours: "09:00 - 18:00", isOpen: true },
      { day: "Mardi", hours: "09:00 - 18:00", isOpen: true },
      { day: "Mercredi", hours: "09:00 - 18:00", isOpen: true },
      { day: "Jeudi", hours: "09:00 - 18:00", isOpen: true },
      { day: "Vendredi", hours: "09:00 - 18:00", isOpen: true },
      { day: "Samedi", hours: "09:00 - 13:00", isOpen: true },
      { day: "Dimanche", hours: "Fermé", isOpen: false },
    ],
    description:
      "Boutique partenaire spécialisée en produits éco-responsables.",
    image: "/images/collect-points/magenta.jpg",
    estimatedReady: "48h",
    isActive: true,
  },
  {
    _id: "cp4",
    name: "Point Relais Dumbéa",
    type: "partner",
    address: {
      street: "Centre Commercial Kenu In",
      city: "Dumbéa",
      postalCode: "98835",
      zone: "Dumbéa",
    },
    coordinates: { lat: -22.1833, lng: 166.45 },
    phone: "+687 45 67 89",
    email: "dumbea@krysto.nc",
    openingHours: [
      { day: "Lundi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Mardi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Mercredi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Jeudi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Vendredi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Samedi", hours: "09:00 - 19:00", isOpen: true },
      { day: "Dimanche", hours: "09:00 - 13:00", isOpen: true },
    ],
    description: "Point relais au centre commercial Kenu In.",
    image: "/images/collect-points/dumbea.jpg",
    estimatedReady: "48-72h",
    isActive: true,
  },
  {
    _id: "cp5",
    name: "Krysto Mont-Dore",
    type: "partner",
    address: {
      street: "15 Rue de Boulari",
      city: "Mont-Dore",
      postalCode: "98809",
      zone: "Mont-Dore",
    },
    coordinates: { lat: -22.2667, lng: 166.5667 },
    phone: "+687 56 78 90",
    email: "montdore@krysto.nc",
    openingHours: [
      { day: "Lundi", hours: "08:30 - 17:30", isOpen: true },
      { day: "Mardi", hours: "08:30 - 17:30", isOpen: true },
      { day: "Mercredi", hours: "08:30 - 17:30", isOpen: true },
      { day: "Jeudi", hours: "08:30 - 17:30", isOpen: true },
      { day: "Vendredi", hours: "08:30 - 17:00", isOpen: true },
      { day: "Samedi", hours: "Fermé", isOpen: false },
      { day: "Dimanche", hours: "Fermé", isOpen: false },
    ],
    description: "Partenaire au Mont-Dore pour les habitants du Sud.",
    image: "/images/collect-points/montdore.jpg",
    estimatedReady: "48-72h",
    isActive: true,
  },
];

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // États
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [expandedPoint, setExpandedPoint] = useState(null);
  const [filterZone, setFilterZone] = useState("all");
  const [customerInfo, setCustomerInfo] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Redirection si panier vide ou non connecté
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
    if (!userInfo) {
      navigate("/login?redirect=/checkout");
    }
  }, [cartItems, userInfo, navigate]);

  // Zones uniques pour le filtre
  const zones = ["all", ...new Set(COLLECT_POINTS.map((p) => p.address.zone))];

  // Points filtrés
  const filteredPoints =
    filterZone === "all"
      ? COLLECT_POINTS
      : COLLECT_POINTS.filter((p) => p.address.zone === filterZone);

  // Formatter les prix en XPF
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " XPF";
  };

  // Nombre total d'articles
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Vérifier si un point est ouvert maintenant
  const isOpenNow = (point) => {
    const now = new Date();
    const dayIndex = now.getDay();
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const today = point.openingHours.find((h) => h.day === days[dayIndex]);

    if (!today || !today.isOpen) return false;

    const [start, end] = today.hours.split(" - ");
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  };

  // Gérer le changement d'info client
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Passer à l'étape suivante
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedPoint) {
      toast.warning("Veuillez choisir un point de collecte");
      return;
    }
    if (currentStep === 2) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        toast.warning("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  // Revenir à l'étape précédente
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Soumettre la commande
  const handleSubmitOrder = async () => {
    if (!acceptTerms) {
      toast.warning("Veuillez accepter les conditions générales");
      return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
          variantColor: item.variantColor || null,
        })),
        shippingAddress: {
          address: `${selectedPoint.name} - ${selectedPoint.address.street}`,
          city: selectedPoint.address.city,
          postalCode: selectedPoint.address.postalCode,
          country: "Nouvelle-Calédonie",
        },
        paymentMethod: "Espèces au retrait",
        itemsPrice: itemsPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: itemsPrice,
        notes: orderNotes,
        collectPoint: selectedPoint._id,
        customerPhone: customerInfo.phone,
      };

      const res = await createOrder(orderData).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}?success=true`);
      toast.success("Commande créée avec succès !");
    } catch (error) {
      toast.error(
        error?.data?.message || "Erreur lors de la création de la commande",
      );
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="checkout-steps">
      <div
        className={`checkout-step ${currentStep >= 1 ? "checkout-step--active" : ""} ${currentStep > 1 ? "checkout-step--completed" : ""}`}
      >
        <div className="checkout-step__number">
          {currentStep > 1 ? <FiCheck /> : "1"}
        </div>
        <span className="checkout-step__label">Point de retrait</span>
      </div>
      <div className="checkout-step__line"></div>
      <div
        className={`checkout-step ${currentStep >= 2 ? "checkout-step--active" : ""} ${currentStep > 2 ? "checkout-step--completed" : ""}`}
      >
        <div className="checkout-step__number">
          {currentStep > 2 ? <FiCheck /> : "2"}
        </div>
        <span className="checkout-step__label">Vos informations</span>
      </div>
      <div className="checkout-step__line"></div>
      <div
        className={`checkout-step ${currentStep >= 3 ? "checkout-step--active" : ""}`}
      >
        <div className="checkout-step__number">3</div>
        <span className="checkout-step__label">Confirmation</span>
      </div>
    </div>
  );

  // Render Step 1 - Choix du point de collecte
  const renderStep1 = () => (
    <div className="checkout-section">
      <div className="checkout-section__header">
        <div className="checkout-section__icon">
          <FiMapPin />
        </div>
        <div>
          <h2 className="checkout-section__title">
            Choisissez votre point de retrait
          </h2>
          <p className="checkout-section__subtitle">
            Sélectionnez le point de collecte le plus pratique pour vous
          </p>
        </div>
      </div>

      {/* Filtre par zone */}
      <div className="checkout-filter">
        <label>Filtrer par zone :</label>
        <div className="checkout-filter__buttons">
          {zones.map((zone) => (
            <button
              key={zone}
              className={`checkout-filter__btn ${filterZone === zone ? "checkout-filter__btn--active" : ""}`}
              onClick={() => setFilterZone(zone)}
            >
              {zone === "all" ? "Toutes les zones" : zone}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des points */}
      <div className="collect-points">
        {filteredPoints.map((point) => (
          <div
            key={point._id}
            className={`collect-point ${selectedPoint?._id === point._id ? "collect-point--selected" : ""}`}
          >
            <div
              className="collect-point__main"
              onClick={() => setSelectedPoint(point)}
            >
              <div className="collect-point__radio">
                <div className="collect-point__radio-inner"></div>
              </div>

              <div className="collect-point__content">
                <div className="collect-point__header">
                  <h3 className="collect-point__name">
                    {point.name}
                    {point.type === "primary" && (
                      <span className="collect-point__badge collect-point__badge--primary">
                        Principal
                      </span>
                    )}
                  </h3>
                  <span
                    className={`collect-point__status ${isOpenNow(point) ? "collect-point__status--open" : "collect-point__status--closed"}`}
                  >
                    {isOpenNow(point) ? "Ouvert" : "Fermé"}
                  </span>
                </div>

                <div className="collect-point__address">
                  <FiMapPin />
                  <span>
                    {point.address.street}, {point.address.postalCode}{" "}
                    {point.address.city}
                  </span>
                </div>

                <div className="collect-point__info">
                  <div className="collect-point__info-item">
                    <FiClock />
                    <span>Prêt sous {point.estimatedReady}</span>
                  </div>
                  <div className="collect-point__info-item">
                    <FiPhone />
                    <span>{point.phone}</span>
                  </div>
                </div>
              </div>

              <button
                className="collect-point__expand"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedPoint(
                    expandedPoint === point._id ? null : point._id,
                  );
                }}
              >
                {expandedPoint === point._id ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>
            </div>

            {/* Détails étendus */}
            {expandedPoint === point._id && (
              <div className="collect-point__details">
                <p className="collect-point__description">
                  {point.description}
                </p>

                <div className="collect-point__hours">
                  <h4>
                    <FiCalendar /> Horaires d'ouverture
                  </h4>
                  <div className="collect-point__hours-grid">
                    {point.openingHours.map((h, idx) => (
                      <div
                        key={idx}
                        className={`collect-point__hour ${!h.isOpen ? "collect-point__hour--closed" : ""}`}
                      >
                        <span>{h.day}</span>
                        <span>{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="collect-point__actions">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${point.coordinates.lat},${point.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="collect-point__map-link"
                  >
                    <FiNavigation /> Voir sur Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Step 2 - Informations client
  const renderStep2 = () => (
    <div className="checkout-section">
      <div className="checkout-section__header">
        <div className="checkout-section__icon">
          <FiUser />
        </div>
        <div>
          <h2 className="checkout-section__title">Vos informations</h2>
          <p className="checkout-section__subtitle">
            Ces informations nous permettront de vous contacter pour le retrait
          </p>
        </div>
      </div>

      {/* Point de collecte sélectionné */}
      {selectedPoint && (
        <div className="checkout-selected-point">
          <div className="checkout-selected-point__info">
            <FiMapPin />
            <div>
              <strong>{selectedPoint.name}</strong>
              <span>
                {selectedPoint.address.street}, {selectedPoint.address.city}
              </span>
            </div>
          </div>
          <button
            className="checkout-selected-point__edit"
            onClick={() => setCurrentStep(1)}
          >
            <FiEdit2 /> Modifier
          </button>
        </div>
      )}

      {/* Formulaire */}
      <div className="checkout-form">
        <div className="checkout-form__group">
          <label htmlFor="name">
            Nom complet <span className="required">*</span>
          </label>
          <div className="checkout-form__input-wrapper">
            <FiUser />
            <input
              type="text"
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={handleCustomerInfoChange}
              placeholder="Jean Dupont"
              required
            />
          </div>
        </div>

        <div className="checkout-form__group">
          <label htmlFor="email">
            Adresse email <span className="required">*</span>
          </label>
          <div className="checkout-form__input-wrapper">
            <FiMail />
            <input
              type="email"
              id="email"
              name="email"
              value={customerInfo.email}
              onChange={handleCustomerInfoChange}
              placeholder="jean.dupont@email.com"
              required
            />
          </div>
          <span className="checkout-form__hint">
            Vous recevrez la confirmation de commande par email
          </span>
        </div>

        <div className="checkout-form__group">
          <label htmlFor="phone">
            Numéro de téléphone <span className="required">*</span>
          </label>
          <div className="checkout-form__input-wrapper">
            <FiPhone />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={handleCustomerInfoChange}
              placeholder="+687 12 34 56"
              required
            />
          </div>
          <span className="checkout-form__hint">
            Nous vous enverrons un SMS quand votre commande sera prête
          </span>
        </div>

        <div className="checkout-form__group">
          <label htmlFor="notes">Notes pour la commande (optionnel)</label>
          <textarea
            id="notes"
            name="notes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Instructions spéciales, horaires préférés..."
            rows="3"
          />
        </div>
      </div>
    </div>
  );

  // Render Step 3 - Confirmation
  const renderStep3 = () => (
    <div className="checkout-section">
      <div className="checkout-section__header">
        <div className="checkout-section__icon checkout-section__icon--success">
          <FiCheckCircle />
        </div>
        <div>
          <h2 className="checkout-section__title">Confirmez votre commande</h2>
          <p className="checkout-section__subtitle">
            Vérifiez les détails avant de valider
          </p>
        </div>
      </div>

      {/* Récapitulatif point de collecte */}
      <div className="checkout-recap">
        <div className="checkout-recap__section">
          <h3>
            <FiMapPin /> Point de retrait
          </h3>
          <div className="checkout-recap__content">
            <strong>{selectedPoint?.name}</strong>
            <p>
              {selectedPoint?.address.street}
              <br />
              {selectedPoint?.address.postalCode} {selectedPoint?.address.city}
            </p>
            <p className="checkout-recap__ready">
              <FiClock /> Prêt sous {selectedPoint?.estimatedReady}
            </p>
          </div>
        </div>

        <div className="checkout-recap__section">
          <h3>
            <FiUser /> Vos coordonnées
          </h3>
          <div className="checkout-recap__content">
            <p>
              <strong>{customerInfo.name}</strong>
            </p>
            <p>{customerInfo.email}</p>
            <p>{customerInfo.phone}</p>
          </div>
        </div>

        <div className="checkout-recap__section">
          <h3>
            <HiOutlineBanknotes /> Mode de paiement
          </h3>
          <div className="checkout-recap__content checkout-recap__payment">
            <div className="checkout-recap__payment-icon">
              <HiOutlineBanknotes />
            </div>
            <div>
              <strong>Paiement en espèces</strong>
              <p>À régler au moment du retrait</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="checkout-items-recap">
        <h3>
          <FiPackage /> Articles ({totalItems})
        </h3>
        <div className="checkout-items-list">
          {cartItems.map((item) => (
            <div key={item._id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div className="checkout-item__info">
                <span className="checkout-item__name">{item.name}</span>
                <span className="checkout-item__qty">Qté : {item.qty}</span>
              </div>
              <span className="checkout-item__price">
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conditions */}
      <div className="checkout-terms">
        <label className="checkout-checkbox">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span className="checkout-checkbox__mark"></span>
          <span className="checkout-checkbox__text">
            J'accepte les{" "}
            <Link to="/conditions-generales">
              conditions générales de vente
            </Link>{" "}
            et la{" "}
            <Link to="/politique-confidentialite">
              politique de confidentialité
            </Link>
          </span>
        </label>
      </div>

      {/* Alerte */}
      <div className="checkout-alert">
        <FiAlertCircle />
        <div>
          <strong>Important</strong>
          <p>
            Votre commande sera réservée pendant 7 jours. Passé ce délai, elle
            sera automatiquement annulée si elle n'a pas été retirée.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-header">
        <div className="checkout-header__content">
          <Link to="/cart" className="checkout-header__back">
            <FiArrowLeft />
            <span>Retour au panier</span>
          </Link>
          <h1 className="checkout-header__title">
            <FiPackage /> Finaliser ma commande
          </h1>
        </div>
      </div>

      {/* Steps Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      <div className="checkout-main">
        <div className="checkout-content">
          {/* Main Section */}
          <div className="checkout-main-section">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button
                  className="checkout-nav-btn checkout-nav-btn--prev"
                  onClick={handlePrevStep}
                >
                  <FiArrowLeft /> Retour
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  className="checkout-nav-btn checkout-nav-btn--next"
                  onClick={handleNextStep}
                >
                  Continuer <FiArrowRight />
                </button>
              ) : (
                <button
                  className="checkout-nav-btn checkout-nav-btn--submit"
                  onClick={handleSubmitOrder}
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    "Traitement en cours..."
                  ) : (
                    <>
                      <FiCheck /> Confirmer ma commande
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="checkout-sidebar">
            <div className="checkout-summary">
              <div
                className="checkout-summary__header"
                onClick={() => setShowOrderSummary(!showOrderSummary)}
              >
                <h3>
                  <FiPackage /> Récapitulatif
                </h3>
                <button className="checkout-summary__toggle">
                  {showOrderSummary ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>

              <div
                className={`checkout-summary__content ${showOrderSummary ? "checkout-summary__content--open" : ""}`}
              >
                {/* Articles */}
                <div className="checkout-summary__items">
                  {cartItems.map((item) => (
                    <div key={item._id} className="checkout-summary__item">
                      <div className="checkout-summary__item-image">
                        <img src={item.image} alt={item.name} />
                        <span className="checkout-summary__item-qty">
                          {item.qty}
                        </span>
                      </div>
                      <div className="checkout-summary__item-info">
                        <span className="checkout-summary__item-name">
                          {item.name}
                        </span>
                        <span className="checkout-summary__item-price">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="checkout-summary__totals">
                  <div className="checkout-summary__line">
                    <span>Sous-total</span>
                    <span>{formatPrice(itemsPrice)}</span>
                  </div>
                  <div className="checkout-summary__line checkout-summary__line--free">
                    <span>
                      <FiMapPin /> Retrait
                    </span>
                    <span className="checkout-summary__free">Gratuit</span>
                  </div>
                </div>

                <div className="checkout-summary__total">
                  <span>Total à payer</span>
                  <span>{formatPrice(itemsPrice)}</span>
                </div>

                {/* Payment Method */}
                <div className="checkout-summary__payment">
                  <HiOutlineBanknotes />
                  <span>Paiement en espèces au retrait</span>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="checkout-guarantees">
              <div className="checkout-guarantee">
                <FiShield />
                <span>Commande sécurisée</span>
              </div>
              <div className="checkout-guarantee">
                <FiClock />
                <span>Prêt sous 24-72h</span>
              </div>
              <div className="checkout-guarantee">
                <HiOutlineBanknotes />
                <span>Paiement au retrait</span>
              </div>
            </div>

            {/* Contact */}
            <div className="checkout-contact">
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

export default CheckoutScreen;
