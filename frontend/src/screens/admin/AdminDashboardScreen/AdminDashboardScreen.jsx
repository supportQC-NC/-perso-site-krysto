import { Link } from "react-router-dom";
import {
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiPlus,
  FiEye,
  FiUserCheck,
  FiRefreshCw,
  FiMail,
  FiMessageSquare,
  FiArrowRight,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { useGetProductStatsQuery } from "../../../slices/productApiSlice";
import {
  useGetOrderStatsQuery,
  useGetOrdersQuery,
} from "../../../slices/orderApiSlice";
import { useGetProRequestStatsQuery } from "../../../slices/proRequestApiSlice";
import { useGetProOrderStatsQuery } from "../../../slices/proOrderApiSlice";
import { useGetReapproStatsQuery } from "../../../slices/reapproRequestApiSlice";
import { useGetContactStatsQuery } from "../../../slices/contactApiSlice";
import { useGetProspectStatsQuery } from "../../../slices/prospectApiSlice";
import "./AdminDashboardScreen.css";

const AdminDashboardScreen = () => {
  // Récupération des stats
  const { data: productStats, isLoading: loadingProducts } =
    useGetProductStatsQuery();
  const { data: orderStats, isLoading: loadingOrders } =
    useGetOrderStatsQuery();
  const { data: proRequestStats, isLoading: loadingProRequests } =
    useGetProRequestStatsQuery();
  const { data: proOrderStats, isLoading: loadingProOrders } =
    useGetProOrderStatsQuery();
  const { data: reapproStats, isLoading: loadingReappro } =
    useGetReapproStatsQuery();
  const { data: contactStats, isLoading: loadingContacts } =
    useGetContactStatsQuery();
  const { data: prospectStats, isLoading: loadingProspects } =
    useGetProspectStatsQuery();

  // Récupération des dernières commandes
  const { data: recentOrdersData, isLoading: loadingRecentOrders } =
    useGetOrdersQuery({
      limit: 5,
    });

  // Formatage du prix
  const formatPrice = (price) => {
    if (!price) return "0 XPF";
    return `${price.toLocaleString("fr-FR")} XPF`;
  };

  // Formatage de la date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtenir la classe CSS du statut
  const getStatusClass = (status) => {
    const statusMap = {
      "En attente": "pending",
      Confirmée: "confirmed",
      "En préparation": "processing",
      Expédiée: "processing",
      Livrée: "delivered",
      Annulée: "cancelled",
      pending: "pending",
      confirmed: "confirmed",
      processing: "processing",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return statusMap[status] || "pending";
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard__header">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Cards - Ligne 1 */}
      <div className="admin-dashboard__stats">
        {/* Produits */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--primary">
            <FiPackage />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingProducts ? "..." : productStats?.totalProducts || 0}
            </span>
            <span className="stat-card__label">Produits</span>
            {productStats?.activeProducts && (
              <span className="stat-card__trend stat-card__trend--up">
                {productStats.activeProducts} actifs
              </span>
            )}
          </div>
        </div>

        {/* Commandes */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--success">
            <FiShoppingCart />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingOrders ? "..." : orderStats?.totalOrders || 0}
            </span>
            <span className="stat-card__label">Commandes</span>
            {orderStats?.pendingOrders > 0 && (
              <span className="stat-card__trend stat-card__trend--up">
                {orderStats.pendingOrders} en attente
              </span>
            )}
          </div>
        </div>

        {/* Chiffre d'affaires */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--secondary">
            <FiDollarSign />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingOrders ? "..." : formatPrice(orderStats?.totalRevenue)}
            </span>
            <span className="stat-card__label">Chiffre d'affaires</span>
          </div>
        </div>

        {/* Demandes Pro */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--warning">
            <FiUserCheck />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingProRequests ? "..." : proRequestStats?.pending || 0}
            </span>
            <span className="stat-card__label">Demandes Pro</span>
            <span className="stat-card__trend">en attente</span>
          </div>
        </div>

        {/* Commandes Pro */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <FiLayers />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingProOrders ? "..." : proOrderStats?.totalOrders || 0}
            </span>
            <span className="stat-card__label">Commandes Pro</span>
            {proOrderStats?.pendingPayments > 0 && (
              <span className="stat-card__trend stat-card__trend--down">
                {formatPrice(proOrderStats.pendingPayments)} impayé
              </span>
            )}
          </div>
        </div>

        {/* Réappro */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--teal">
            <FiRefreshCw />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingReappro ? "..." : reapproStats?.pending || 0}
            </span>
            <span className="stat-card__label">Demandes Réappro</span>
            {reapproStats?.urgent > 0 && (
              <span className="stat-card__trend stat-card__trend--down">
                {reapproStats.urgent} urgente(s)
              </span>
            )}
          </div>
        </div>

        {/* Contacts */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--info">
            <FiMessageSquare />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingContacts ? "..." : contactStats?.unread || 0}
            </span>
            <span className="stat-card__label">Messages non lus</span>
          </div>
        </div>

        {/* Prospects */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--error">
            <FiMail />
          </div>
          <div className="stat-card__content">
            <span className="stat-card__value">
              {loadingProspects ? "..." : prospectStats?.active || 0}
            </span>
            <span className="stat-card__label">Prospects actifs</span>
            {prospectStats?.recentSubscriptions > 0 && (
              <span className="stat-card__trend stat-card__trend--up">
                +{prospectStats.recentSubscriptions} ce mois
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid : Activité récente + Actions & Alertes */}
      <div className="admin-dashboard__grid">
        {/* Colonne gauche : Activité récente */}
        <div className="admin-dashboard__section">
          <div className="admin-dashboard__section-header">
            <h2>Activité récente</h2>
            <Link to="/admin/orders" className="admin-dashboard__section-link">
              Tout voir <FiArrowRight />
            </Link>
          </div>

          <div className="recent-activity">
            <div className="recent-activity__header">
              <h3>Dernières commandes</h3>
            </div>

            {loadingRecentOrders ? (
              <div className="admin-dashboard__loader">
                <FiClock /> Chargement...
              </div>
            ) : recentOrdersData?.orders?.length > 0 ? (
              <ul className="recent-activity__list">
                {recentOrdersData.orders.slice(0, 5).map((order) => (
                  <li key={order._id} className="recent-activity__item">
                    <div className="recent-activity__icon recent-activity__icon--order">
                      <FiShoppingCart />
                    </div>
                    <div className="recent-activity__info">
                      <div className="recent-activity__title">
                        Commande #{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="recent-activity__meta">
                        {order.user?.name || "Client"} •{" "}
                        {formatPrice(order.totalPrice)}
                      </div>
                    </div>
                    <span
                      className={`recent-activity__status recent-activity__status--${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="recent-activity__empty">
                <p>Aucune commande récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite : Actions & Alertes */}
        <div>
          {/* Actions rapides */}
          <div className="admin-dashboard__section">
            <div className="admin-dashboard__section-header">
              <h2>Actions rapides</h2>
            </div>
            <div className="admin-dashboard__actions">
              <Link to="/admin/products/create" className="action-card">
                <FiPlus />
                <span>Nouveau produit</span>
              </Link>
              <Link to="/admin/orders" className="action-card">
                <FiEye />
                <span>Voir commandes</span>
              </Link>
              <Link to="/admin/pro-requests" className="action-card">
                <FiUserCheck />
                <span>Demandes Pro</span>
              </Link>
              <Link to="/admin/pro-orders" className="action-card">
                <FiLayers />
                <span>Commandes Pro</span>
              </Link>
              <Link to="/admin/reappro-requests" className="action-card">
                <FiRefreshCw />
                <span>Réappro</span>
              </Link>
              <Link to="/admin/contacts" className="action-card">
                <FiMessageSquare />
                <span>Messages</span>
              </Link>
            </div>
          </div>

          {/* Alertes */}
          <div className="admin-dashboard__section">
            <div className="admin-dashboard__section-header">
              <h2>Alertes</h2>
            </div>
            <div className="admin-dashboard__alerts">
              {/* Stock faible */}
              {!loadingProducts && productStats?.lowStock > 0 && (
                <div className="alert-card alert-card--warning">
                  <FiAlertCircle />
                  <div className="alert-card__content">
                    <strong>{productStats.lowStock}</strong> produit(s) en stock
                    faible
                  </div>
                  <Link
                    to="/admin/products?stock=low"
                    className="alert-card__link"
                  >
                    Voir
                  </Link>
                </div>
              )}

              {/* Demandes Pro en attente */}
              {!loadingProRequests && proRequestStats?.pending > 0 && (
                <div className="alert-card alert-card--info">
                  <FiUsers />
                  <div className="alert-card__content">
                    <strong>{proRequestStats.pending}</strong> demande(s) Pro à
                    traiter
                  </div>
                  <Link to="/admin/pro-requests" className="alert-card__link">
                    Traiter
                  </Link>
                </div>
              )}

              {/* Réappro urgentes */}
              {!loadingReappro && reapproStats?.urgent > 0 && (
                <div className="alert-card alert-card--error">
                  <FiAlertTriangle />
                  <div className="alert-card__content">
                    <strong>{reapproStats.urgent}</strong> demande(s) réappro
                    urgente(s)
                  </div>
                  <Link
                    to="/admin/reappro-requests?priority=urgent"
                    className="alert-card__link"
                  >
                    Voir
                  </Link>
                </div>
              )}

              {/* Messages non lus */}
              {!loadingContacts && contactStats?.unread > 0 && (
                <div className="alert-card alert-card--info">
                  <FiMessageSquare />
                  <div className="alert-card__content">
                    <strong>{contactStats.unread}</strong> message(s) non lu(s)
                  </div>
                  <Link
                    to="/admin/contacts?isRead=false"
                    className="alert-card__link"
                  >
                    Lire
                  </Link>
                </div>
              )}

              {/* Tout va bien */}
              {!loadingProducts &&
                !loadingProRequests &&
                !loadingReappro &&
                !loadingContacts &&
                (productStats?.lowStock || 0) === 0 &&
                (proRequestStats?.pending || 0) === 0 &&
                (reapproStats?.urgent || 0) === 0 &&
                (contactStats?.unread || 0) === 0 && (
                  <div className="alert-card alert-card--success">
                    <FiCheckCircle />
                    <div className="alert-card__content">
                      Tout est en ordre ! Aucune action urgente requise.
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
