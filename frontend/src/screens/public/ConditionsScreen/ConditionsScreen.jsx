import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiFileText,
  FiCheck,
  FiShield,
  FiLock,
  FiMail,
  FiUser,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiShoppingBag,
  FiRefreshCw,
  FiTruck,
  FiCreditCard,
  FiInfo,
  FiHome,
} from "react-icons/fi";
import { HiOutlineBanknotes } from "react-icons/hi2";
import { toast } from "react-toastify";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../../slices/usersApiSlice";
import { setCredentials } from "../../../slices/authSlice";
import "./ConditionsScreen.css";

const ConditionsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // États
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  // Formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    newsletter: true,
  });

  // Redirect param
  const redirect = new URLSearchParams(search).get("redirect") || "/checkout";

  // Si déjà connecté et conditions acceptées, rediriger
  useEffect(() => {
    if (userInfo && acceptedTerms) {
      navigate(redirect);
    }
  }, [userInfo, acceptedTerms, navigate, redirect]);

  // Gérer les changements de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.warning("Veuillez accepter les conditions générales de vente");
      return;
    }

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Connexion réussie !");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur de connexion");
    }
  };

  // Inscription
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.warning("Veuillez accepter les conditions générales de vente");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        newsletterSubscribed: formData.newsletter,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Compte créé avec succès !");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'inscription");
    }
  };

  // Continuer si déjà connecté
  const handleContinue = () => {
    if (!acceptedTerms) {
      toast.warning("Veuillez accepter les conditions générales de vente");
      return;
    }
    navigate(redirect);
  };

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Sections des CGV
  const cgvSections = [
    {
      id: "objet",
      title: "Article 1 - Objet",
      icon: <FiFileText />,
      content: `Les présentes conditions générales de vente régissent les relations contractuelles entre la société Krysto, entreprise spécialisée dans la fabrication et la vente de produits éco-responsables fabriqués à partir de plastique recyclé en Nouvelle-Calédonie, et toute personne physique ou morale souhaitant effectuer un achat via le site internet krysto.nc ou en point de vente.

Toute commande implique l'acceptation sans réserve des présentes conditions générales de vente.`,
    },
    {
      id: "produits",
      title: "Article 2 - Produits",
      icon: <FiPackage />,
      content: `Les produits proposés à la vente sont décrits et présentés avec la plus grande exactitude possible. Toutefois, si des erreurs ou omissions ont pu se produire quant à cette présentation, la responsabilité de Krysto ne pourrait être engagée.

Les produits sont fabriqués à partir de plastique recyclé collecté en Nouvelle-Calédonie. Chaque produit est unique et peut présenter de légères variations de couleur ou de texture, ce qui constitue leur authenticité et leur caractère artisanal.

Les photographies des produits ne sont pas contractuelles et ne sauraient engager la responsabilité de Krysto.`,
    },
    {
      id: "commande",
      title: "Article 3 - Commande",
      icon: <FiShoppingBag />,
      content: `Le client sélectionne les produits qu'il souhaite commander sur le site krysto.nc. Après validation du panier, le client doit accepter les présentes conditions générales de vente, puis choisir son point de retrait.

La validation de la commande implique l'acceptation des présentes conditions générales de vente.

Krysto se réserve le droit d'annuler toute commande d'un client avec lequel il existerait un litige relatif au paiement d'une commande antérieure.`,
    },
    {
      id: "retrait",
      title: "Article 4 - Retrait (Pick & Collect)",
      icon: <FiMapPin />,
      content: `Krysto propose un service de retrait en point de collecte (Pick & Collect). Le client choisit son point de retrait lors de la validation de sa commande parmi les points disponibles.

Le client est informé par email et/ou SMS lorsque sa commande est prête à être retirée. Le délai de préparation est généralement de 24 à 72 heures selon le point de collecte choisi.

La commande est réservée pendant 7 jours calendaires à compter de la notification de disponibilité. Passé ce délai, la commande sera automatiquement annulée sans possibilité de remboursement ou d'échange.

Le client doit se présenter avec une pièce d'identité et le numéro de commande pour retirer ses produits.`,
    },
    {
      id: "paiement",
      title: "Article 5 - Paiement",
      icon: <HiOutlineBanknotes />,
      content: `Le paiement s'effectue exclusivement en espèces au moment du retrait de la commande en point de collecte.

Le prix de vente des produits est indiqué en Francs Pacifique (XPF), toutes taxes comprises.

Krysto se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant sur le site le jour de la commande sera le seul applicable au client.

Aucun acompte n'est demandé lors de la commande en ligne.`,
    },
    {
      id: "retour",
      title: "Article 6 - Retour et remboursement",
      icon: <FiRefreshCw />,
      content: `Conformément à la législation en vigueur en Nouvelle-Calédonie, le client dispose d'un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.

Les produits doivent être retournés dans leur état d'origine, non utilisés, avec tous les accessoires éventuels et leur emballage d'origine.

Le remboursement sera effectué en espèces au point de retrait initial dans un délai maximum de 14 jours suivant la réception des produits retournés.

Les produits personnalisés ou fabriqués sur mesure ne peuvent faire l'objet d'un retour ou d'un remboursement.`,
    },
    {
      id: "garantie",
      title: "Article 7 - Garantie",
      icon: <FiShield />,
      content: `Tous les produits vendus par Krysto bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés.

En cas de défaut de conformité, le client peut demander le remplacement ou la réparation du produit, ou à défaut, le remboursement.

La garantie ne couvre pas les défauts résultant d'une utilisation anormale, d'un défaut d'entretien, ou de l'usure normale du produit.

Les caractéristiques propres aux produits fabriqués à partir de matériaux recyclés (légères variations de couleur, texture) ne constituent pas un défaut de conformité.`,
    },
    {
      id: "donnees",
      title: "Article 8 - Protection des données",
      icon: <FiLock />,
      content: `Les informations collectées lors de la commande sont nécessaires au traitement de celle-ci. Elles sont traitées conformément à la réglementation en vigueur relative à la protection des données personnelles.

Le client dispose d'un droit d'accès, de rectification, d'effacement et de portabilité de ses données, ainsi que d'un droit d'opposition et de limitation du traitement.

Ces droits peuvent être exercés par email à contact@krysto.nc ou par courrier à l'adresse du siège social.

Les données personnelles ne sont jamais communiquées à des tiers sans le consentement du client, sauf obligation légale.`,
    },
    {
      id: "litiges",
      title: "Article 9 - Litiges",
      icon: <FiAlertCircle />,
      content: `Les présentes conditions générales de vente sont soumises au droit applicable en Nouvelle-Calédonie.

En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.

À défaut de règlement amiable, les tribunaux de Nouméa seront seuls compétents pour tout litige relatif aux présentes conditions générales de vente.`,
    },
    {
      id: "contact",
      title: "Article 10 - Contact",
      icon: <FiMail />,
      content: `Pour toute question relative aux présentes conditions générales de vente ou à une commande :

• Email : contact@krysto.nc
• Téléphone : +687 12 34 56
• Adresse : 12 Rue de la Baie des Citrons, 98800 Nouméa, Nouvelle-Calédonie

Horaires du service client : du lundi au vendredi de 8h à 17h, le samedi de 9h à 12h.`,
    },
  ];

  return (
    <div className="conditions-page">
      {/* Header */}
      <div className="conditions-header">
        <div className="conditions-header__content">
          <Link to="/cart" className="conditions-header__back">
            <FiArrowLeft />
            <span>Retour au panier</span>
          </Link>
          <div className="conditions-header__breadcrumb">
            <Link to="/">
              <FiHome />
            </Link>
            <span>/</span>
            <Link to="/cart">Panier</Link>
            <span>/</span>
            <span className="active">Conditions générales</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="conditions-main">
        <div className="conditions-content">
          {/* CGV Section */}
          <div className="conditions-cgv">
            <div className="conditions-cgv__header">
              <div className="conditions-cgv__icon">
                <FiFileText />
              </div>
              <div>
                <h1 className="conditions-cgv__title">
                  Conditions Générales de Vente
                </h1>
                <p className="conditions-cgv__subtitle">
                  Dernière mise à jour : Janvier 2026
                </p>
              </div>
            </div>

            {/* Intro */}
            <div className="conditions-intro">
              <FiInfo />
              <p>
                Veuillez lire attentivement les conditions générales de vente
                ci-dessous avant de finaliser votre commande. L'acceptation de
                ces conditions est obligatoire pour continuer.
              </p>
            </div>

            {/* Key Points */}
            <div className="conditions-keypoints">
              <h2>Points essentiels</h2>
              <div className="conditions-keypoints__grid">
                <div className="conditions-keypoint">
                  <div className="conditions-keypoint__icon">
                    <FiMapPin />
                  </div>
                  <div className="conditions-keypoint__text">
                    <strong>Retrait en point de collecte</strong>
                    <span>Pick & Collect uniquement</span>
                  </div>
                </div>
                <div className="conditions-keypoint">
                  <div className="conditions-keypoint__icon">
                    <HiOutlineBanknotes />
                  </div>
                  <div className="conditions-keypoint__text">
                    <strong>Paiement en espèces</strong>
                    <span>Au moment du retrait</span>
                  </div>
                </div>
                <div className="conditions-keypoint">
                  <div className="conditions-keypoint__icon">
                    <FiClock />
                  </div>
                  <div className="conditions-keypoint__text">
                    <strong>Réservation 7 jours</strong>
                    <span>Retrait sous 7 jours max</span>
                  </div>
                </div>
                <div className="conditions-keypoint">
                  <div className="conditions-keypoint__icon">
                    <FiRefreshCw />
                  </div>
                  <div className="conditions-keypoint__text">
                    <strong>Retour sous 14 jours</strong>
                    <span>Droit de rétractation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CGV Accordion */}
            <div className="conditions-accordion">
              {cgvSections.map((section) => (
                <div
                  key={section.id}
                  className={`conditions-accordion__item ${
                    expandedSection === section.id
                      ? "conditions-accordion__item--expanded"
                      : ""
                  }`}
                >
                  <button
                    className="conditions-accordion__header"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="conditions-accordion__title">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    {expandedSection === section.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>
                  {expandedSection === section.id && (
                    <div className="conditions-accordion__content">
                      {section.content.split("\n\n").map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Accept Checkbox */}
            <div className="conditions-accept">
              <label className="conditions-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="conditions-checkbox__mark">
                  {acceptedTerms && <FiCheck />}
                </span>
                <span className="conditions-checkbox__text">
                  J'ai lu et j'accepte les conditions générales de vente de
                  Krysto. Je comprends que ma commande sera à retirer en point
                  de collecte et que le paiement s'effectuera en espèces au
                  moment du retrait.
                </span>
              </label>
            </div>
          </div>

          {/* Auth Section */}
          <div className="conditions-auth">
            {userInfo ? (
              // Utilisateur connecté
              <div className="conditions-auth__connected">
                <div className="conditions-auth__user">
                  <div className="conditions-auth__avatar">
                    <FiUser />
                  </div>
                  <div className="conditions-auth__info">
                    <span className="conditions-auth__greeting">Bonjour,</span>
                    <span className="conditions-auth__name">
                      {userInfo.name}
                    </span>
                    <span className="conditions-auth__email">
                      {userInfo.email}
                    </span>
                  </div>
                  <FiCheckCircle className="conditions-auth__check" />
                </div>

                <button
                  className="conditions-auth__continue"
                  onClick={handleContinue}
                  disabled={!acceptedTerms}
                >
                  Continuer vers le checkout
                  <FiArrowRight />
                </button>

                {!acceptedTerms && (
                  <p className="conditions-auth__hint">
                    <FiAlertCircle />
                    Veuillez accepter les CGV pour continuer
                  </p>
                )}
              </div>
            ) : (
              // Formulaire connexion/inscription
              <div className="conditions-auth__form-container">
                <div className="conditions-auth__header">
                  <h2>
                    {authMode === "login" ? "Connexion" : "Créer un compte"}
                  </h2>
                  <p>
                    {authMode === "login"
                      ? "Connectez-vous pour finaliser votre commande"
                      : "Créez votre compte Krysto en quelques secondes"}
                  </p>
                </div>

                {/* Tab Switch */}
                <div className="conditions-auth__tabs">
                  <button
                    className={`conditions-auth__tab ${
                      authMode === "login" ? "conditions-auth__tab--active" : ""
                    }`}
                    onClick={() => setAuthMode("login")}
                  >
                    Connexion
                  </button>
                  <button
                    className={`conditions-auth__tab ${
                      authMode === "register"
                        ? "conditions-auth__tab--active"
                        : ""
                    }`}
                    onClick={() => setAuthMode("register")}
                  >
                    Inscription
                  </button>
                </div>

                {/* Login Form */}
                {authMode === "login" && (
                  <form
                    className="conditions-auth__form"
                    onSubmit={handleLogin}
                  >
                    <div className="conditions-form__group">
                      <label htmlFor="email">Adresse email</label>
                      <div className="conditions-form__input-wrapper">
                        <FiMail />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="conditions-form__group">
                      <label htmlFor="password">Mot de passe</label>
                      <div className="conditions-form__input-wrapper">
                        <FiLock />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          className="conditions-form__toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <Link
                      to="/forgot-password"
                      className="conditions-form__forgot"
                    >
                      Mot de passe oublié ?
                    </Link>

                    <button
                      type="submit"
                      className="conditions-form__submit"
                      disabled={isLoginLoading || !acceptedTerms}
                    >
                      {isLoginLoading ? (
                        "Connexion en cours..."
                      ) : (
                        <>
                          Se connecter
                          <FiArrowRight />
                        </>
                      )}
                    </button>

                    {!acceptedTerms && (
                      <p className="conditions-auth__hint">
                        <FiAlertCircle />
                        Veuillez accepter les CGV pour continuer
                      </p>
                    )}
                  </form>
                )}

                {/* Register Form */}
                {authMode === "register" && (
                  <form
                    className="conditions-auth__form"
                    onSubmit={handleRegister}
                  >
                    <div className="conditions-form__group">
                      <label htmlFor="name">Nom complet</label>
                      <div className="conditions-form__input-wrapper">
                        <FiUser />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                    </div>

                    <div className="conditions-form__group">
                      <label htmlFor="register-email">Adresse email</label>
                      <div className="conditions-form__input-wrapper">
                        <FiMail />
                        <input
                          type="email"
                          id="register-email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="conditions-form__group">
                      <label htmlFor="register-password">Mot de passe</label>
                      <div className="conditions-form__input-wrapper">
                        <FiLock />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="register-password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Minimum 6 caractères"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="conditions-form__toggle-password"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div className="conditions-form__group">
                      <label htmlFor="confirmPassword">
                        Confirmer le mot de passe
                      </label>
                      <div className="conditions-form__input-wrapper">
                        <FiLock />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirmez votre mot de passe"
                          required
                        />
                      </div>
                    </div>

                    <label className="conditions-form__checkbox">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                      />
                      <span className="conditions-form__checkbox-mark"></span>
                      <span>
                        Je souhaite recevoir les actualités et offres de Krysto
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="conditions-form__submit"
                      disabled={isRegisterLoading || !acceptedTerms}
                    >
                      {isRegisterLoading ? (
                        "Création en cours..."
                      ) : (
                        <>
                          Créer mon compte
                          <FiArrowRight />
                        </>
                      )}
                    </button>

                    {!acceptedTerms && (
                      <p className="conditions-auth__hint">
                        <FiAlertCircle />
                        Veuillez accepter les CGV pour continuer
                      </p>
                    )}
                  </form>
                )}

                {/* Separator */}
                <div className="conditions-auth__separator">
                  <span>ou</span>
                </div>

                {/* Guest Option */}
                <div className="conditions-auth__guest">
                  <p>
                    Vous n'avez pas de compte ?{" "}
                    <button onClick={() => setAuthMode("register")}>
                      Inscrivez-vous gratuitement
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Order Summary Mini */}
            {cartItems.length > 0 && (
              <div className="conditions-order-summary">
                <h3>
                  <FiShoppingBag /> Votre commande
                </h3>
                <div className="conditions-order-summary__items">
                  {cartItems.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="conditions-order-summary__item"
                    >
                      <img src={item.image} alt={item.name} />
                      <div>
                        <span className="name">{item.name}</span>
                        <span className="qty">x{item.qty}</span>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="conditions-order-summary__more">
                      + {cartItems.length - 3} autre(s) article(s)
                    </p>
                  )}
                </div>
                <div className="conditions-order-summary__total">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("fr-FR").format(
                      cartItems.reduce(
                        (acc, item) => acc + item.price * item.qty,
                        0,
                      ),
                    )}{" "}
                    XPF
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionsScreen;
