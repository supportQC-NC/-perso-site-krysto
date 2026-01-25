import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiLock,
  FiPackage,
  FiMail,
  FiStar,
  FiLogOut,
  FiEdit3,
  FiSave,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiChevronRight,
  FiCalendar,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiBriefcase,
  FiPercent,
  FiMapPin,
  FiPhone,
  FiArrowRight,
  FiShield,
  FiBell,
  FiChevronLeft,
} from "react-icons/fi";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} from "../../../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../../../slices/orderApiSlice";
import { logout as logoutAction } from "../../../slices/authSlice";
import * as THREE from "three";
import "./ProfilScreen.css";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef(null);

  // Auth state
  const { userInfo } = useSelector((state) => state.auth);

  // API
  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProfileQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [logoutApi] = useLogoutMutation();

  // State
  const [activeSection, setActiveSection] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
      });
      setNewsletterSubscribed(profile.newsletterSubscribed || false);
    }
  }, [profile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Three.js Background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 300,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, 300);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 300;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
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
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    camera.position.z = 5;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, 300);
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
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      showAlert("success", "Profil mis à jour avec succès !");
      setIsEditing(false);
      refetchProfile();
    } catch (err) {
      showAlert("error", err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("error", "Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showAlert("error", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await updateProfile({
        password: passwordData.newPassword,
      }).unwrap();
      showAlert("success", "Mot de passe mis à jour avec succès !");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      showAlert("error", err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleNewsletterToggle = async () => {
    try {
      await updateProfile({
        newsletterSubscribed: !newsletterSubscribed,
      }).unwrap();
      setNewsletterSubscribed(!newsletterSubscribed);
      showAlert(
        "success",
        !newsletterSubscribed
          ? "Inscrit à la newsletter !"
          : "Désinscrit de la newsletter",
      );
    } catch (err) {
      showAlert("error", "Erreur lors de la mise à jour");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutAction());
      navigate("/");
    } catch (err) {
      dispatch(logoutAction());
      navigate("/");
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Implémenter la suppression de compte
    showAlert(
      "info",
      "Fonctionnalité à venir. Contactez-nous pour supprimer votre compte.",
    );
    setShowDeleteModal(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getOrderStatusInfo = (order) => {
    if (order.isDelivered) {
      return { label: "Livré", color: "success", icon: <FiCheckCircle /> };
    }
    if (order.isPaid) {
      return { label: "En cours", color: "warning", icon: <FiTruck /> };
    }
    return { label: "En attente", color: "pending", icon: <FiClock /> };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Navigation items
  const navItems = [
    { id: "profile", label: "Mon profil", icon: <FiUser /> },
    { id: "security", label: "Sécurité", icon: <FiLock /> },
    {
      id: "orders",
      label: "Mes commandes",
      icon: <FiPackage />,
      count: ordersData?.length,
    },
    { id: "newsletter", label: "Newsletter", icon: <FiBell /> },
  ];

  // Add Pro section if user is Pro or has pending request
  if (profile?.isPro || profile?.proStatus === "pending") {
    navItems.push({ id: "pro", label: "Espace Pro", icon: <FiStar /> });
  }

  if (profileLoading) {
    return (
      <div className="profile">
        <div className="profile__loading">
          <div className="profile__spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      {/* Header */}
      <header className="profile__header">
        <canvas ref={canvasRef} className="profile__header-canvas" />
        <div className="profile__header-overlay"></div>
        <div className="profile__header-content">
          <Link to="/" className="profile__back-btn">
            <FiChevronLeft />
            <span>Accueil</span>
          </Link>
          <div className="profile__user-info">
            <div className="profile__avatar">{getInitials(profile?.name)}</div>
            <div className="profile__user-details">
              <h1>{profile?.name}</h1>
              <p>{profile?.email}</p>
              <div className="profile__badges">
                {profile?.isPro && (
                  <span className="profile__badge profile__badge--pro">
                    <FiStar /> Compte Pro
                  </span>
                )}
                {profile?.isAdmin && (
                  <span className="profile__badge profile__badge--admin">
                    <FiShield /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Alert */}
      {alert.show && (
        <div className={`profile__alert profile__alert--${alert.type}`}>
          {alert.type === "success" ? <FiCheck /> : <FiAlertCircle />}
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ show: false })}>
            <FiX />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="profile__main">
        <div className="profile__container">
          {/* Mobile Menu Toggle */}
          <button
            className="profile__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span>
              {navItems.find((item) => item.id === activeSection)?.label}
            </span>
            <FiChevronRight className={mobileMenuOpen ? "rotated" : ""} />
          </button>

          {/* Sidebar */}
          <aside
            className={`profile__sidebar ${mobileMenuOpen ? "is-open" : ""}`}
          >
            <nav className="profile__nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`profile__nav-item ${activeSection === item.id ? "is-active" : ""}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span className="profile__nav-count">{item.count}</span>
                  )}
                </button>
              ))}

              <div className="profile__nav-divider"></div>

              {/* Pro Request Link (if not pro) */}
              {!profile?.isPro && profile?.proStatus !== "pending" && (
                <Link
                  to="/pro/request"
                  className="profile__nav-item profile__nav-item--highlight"
                >
                  <FiBriefcase />
                  <span>Devenir Pro</span>
                  <FiArrowRight />
                </Link>
              )}

              <button
                className="profile__nav-item profile__nav-item--danger"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Déconnexion</span>
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <section className="profile__content">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2>Informations personnelles</h2>
                    <p>Gérez vos informations de compte</p>
                  </div>
                  {!isEditing ? (
                    <button
                      className="profile__edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit3 />
                      Modifier
                    </button>
                  ) : (
                    <button
                      className="profile__cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      <FiX />
                      Annuler
                    </button>
                  )}
                </div>

                <form className="profile__form" onSubmit={handleProfileUpdate}>
                  <div className="profile__form-group">
                    <label>
                      <FiUser />
                      Nom complet
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Votre nom"
                      />
                    ) : (
                      <div className="profile__form-value">{profile?.name}</div>
                    )}
                  </div>

                  <div className="profile__form-group">
                    <label>
                      <FiMail />
                      Adresse email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="votre@email.com"
                      />
                    ) : (
                      <div className="profile__form-value">
                        {profile?.email}
                      </div>
                    )}
                  </div>

                  <div className="profile__form-group">
                    <label>
                      <FiCalendar />
                      Membre depuis
                    </label>
                    <div className="profile__form-value">
                      {formatDate(profile?.createdAt)}
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      className="profile__save-btn"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="profile__btn-spinner"></span>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <FiSave />
                          Enregistrer les modifications
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2>Sécurité</h2>
                    <p>
                      Gérez votre mot de passe et la sécurité de votre compte
                    </p>
                  </div>
                </div>

                <form className="profile__form" onSubmit={handlePasswordUpdate}>
                  <h3 className="profile__form-subtitle">
                    Changer le mot de passe
                  </h3>

                  <div className="profile__form-group">
                    <label>
                      <FiLock />
                      Nouveau mot de passe
                    </label>
                    <div className="profile__input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="profile__input-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="profile__form-group">
                    <label>
                      <FiLock />
                      Confirmer le mot de passe
                    </label>
                    <div className="profile__input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="profile__input-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="profile__save-btn"
                    disabled={
                      updating ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    <FiLock />
                    Mettre à jour le mot de passe
                  </button>
                </form>

                {/* Delete Account */}
                <div className="profile__danger-zone">
                  <h3>Zone de danger</h3>
                  <p>
                    La suppression de votre compte est irréversible. Toutes vos
                    données seront perdues.
                  </p>
                  <button
                    className="profile__delete-btn"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <FiTrash2 />
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            )}

            {/* Orders Section */}
            {activeSection === "orders" && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2>Mes commandes</h2>
                    <p>Historique de vos commandes</p>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="profile__orders-loading">
                    <div className="profile__spinner"></div>
                  </div>
                ) : ordersData?.length > 0 ? (
                  <div className="profile__orders">
                    {ordersData.map((order) => {
                      const status = getOrderStatusInfo(order);
                      return (
                        <div key={order._id} className="profile__order">
                          <div className="profile__order-header">
                            <div className="profile__order-id">
                              <span>Commande</span>
                              <strong>
                                #{order._id.slice(-8).toUpperCase()}
                              </strong>
                            </div>
                            <div
                              className={`profile__order-status profile__order-status--${status.color}`}
                            >
                              {status.icon}
                              {status.label}
                            </div>
                          </div>
                          <div className="profile__order-body">
                            <div className="profile__order-info">
                              <div className="profile__order-date">
                                <FiCalendar />
                                {formatDate(order.createdAt)}
                              </div>
                              <div className="profile__order-items">
                                {order.orderItems?.length} article
                                {order.orderItems?.length > 1 ? "s" : ""}
                              </div>
                            </div>
                            <div className="profile__order-total">
                              {order.totalPrice?.toLocaleString()} XPF
                            </div>
                          </div>
                          <Link
                            to={`/order/${order._id}`}
                            className="profile__order-link"
                          >
                            Voir les détails
                            <FiChevronRight />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="profile__empty">
                    <FiPackage />
                    <h3>Aucune commande</h3>
                    <p>Vous n'avez pas encore passé de commande.</p>
                    <Link to="/products" className="profile__empty-btn">
                      Découvrir nos produits
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Newsletter Section */}
            {activeSection === "newsletter" && (
              <div className="profile__section">
                <div className="profile__section-header">
                  <div>
                    <h2>Newsletter</h2>
                    <p>Gérez vos préférences de communication</p>
                  </div>
                </div>

                <div className="profile__newsletter">
                  <div className="profile__newsletter-card">
                    <div className="profile__newsletter-icon">
                      <FiMail />
                    </div>
                    <div className="profile__newsletter-content">
                      <h3>Newsletter Krysto</h3>
                      <p>
                        Recevez nos actualités, nouveaux produits et offres
                        exclusives directement dans votre boîte mail.
                      </p>
                    </div>
                    <label className="profile__toggle">
                      <input
                        type="checkbox"
                        checked={newsletterSubscribed}
                        onChange={handleNewsletterToggle}
                      />
                      <span className="profile__toggle-slider"></span>
                    </label>
                  </div>

                  {newsletterSubscribed && profile?.newsletterSubscribedAt && (
                    <p className="profile__newsletter-info">
                      <FiCheck /> Inscrit depuis le{" "}
                      {formatDate(profile.newsletterSubscribedAt)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Pro Section */}
            {activeSection === "pro" &&
              (profile?.isPro || profile?.proStatus === "pending") && (
                <div className="profile__section">
                  <div className="profile__section-header">
                    <div>
                      <h2>Espace Pro</h2>
                      <p>Informations de votre compte professionnel</p>
                    </div>
                    {profile?.isPro && (
                      <Link
                        to="/pro/dashboard"
                        className="profile__pro-dashboard-btn"
                      >
                        Accéder au dashboard Pro
                        <FiArrowRight />
                      </Link>
                    )}
                  </div>

                  {profile?.proStatus === "pending" && (
                    <div className="profile__pro-pending">
                      <FiClock />
                      <div>
                        <h3>Demande en cours d'examen</h3>
                        <p>
                          Votre demande de compte Pro est en cours de
                          traitement. Nous vous contacterons bientôt.
                        </p>
                      </div>
                    </div>
                  )}

                  {profile?.isPro && profile?.proInfo && (
                    <div className="profile__pro-info">
                      <div className="profile__pro-grid">
                        <div className="profile__pro-card">
                          <div className="profile__pro-card-icon">
                            <FiBriefcase />
                          </div>
                          <div className="profile__pro-card-content">
                            <span>Entreprise</span>
                            <strong>{profile.proInfo.companyName}</strong>
                          </div>
                        </div>

                        <div className="profile__pro-card">
                          <div className="profile__pro-card-icon">
                            <FiPercent />
                          </div>
                          <div className="profile__pro-card-content">
                            <span>Remise accordée</span>
                            <strong>{profile.proInfo.discountRate}%</strong>
                          </div>
                        </div>

                        <div className="profile__pro-card">
                          <div className="profile__pro-card-icon">
                            <FiStar />
                          </div>
                          <div className="profile__pro-card-content">
                            <span>Type de partenariat</span>
                            <strong>
                              {profile.proInfo.partnershipType === "revendeur"
                                ? "Revendeur"
                                : profile.proInfo.partnershipType ===
                                    "depot_vente"
                                  ? "Dépôt-vente"
                                  : "-"}
                            </strong>
                          </div>
                        </div>

                        <div className="profile__pro-card">
                          <div className="profile__pro-card-icon">
                            <FiCalendar />
                          </div>
                          <div className="profile__pro-card-content">
                            <span>Pro depuis</span>
                            <strong>
                              {formatDate(profile.proInfo.approvedAt)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {profile.proInfo.address?.street && (
                        <div className="profile__pro-address">
                          <h4>
                            <FiMapPin /> Adresse professionnelle
                          </h4>
                          <p>
                            {profile.proInfo.address.street}
                            <br />
                            {profile.proInfo.address.postalCode}{" "}
                            {profile.proInfo.address.city}
                            <br />
                            {profile.proInfo.address.country}
                          </p>
                        </div>
                      )}

                      {profile.proInfo.contactPhone && (
                        <div className="profile__pro-contact">
                          <FiPhone />
                          <span>{profile.proInfo.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
          </section>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="profile__modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="profile__modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile__modal-icon">
              <FiAlertCircle />
            </div>
            <h3>Supprimer votre compte ?</h3>
            <p>
              Cette action est irréversible. Toutes vos données, commandes et
              informations seront définitivement supprimées.
            </p>
            <div className="profile__modal-actions">
              <button
                className="profile__modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                className="profile__modal-confirm"
                onClick={handleDeleteAccount}
              >
                <FiTrash2 />
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
