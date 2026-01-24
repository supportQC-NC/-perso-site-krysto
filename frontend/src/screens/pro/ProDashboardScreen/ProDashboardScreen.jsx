import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiPackage,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import "./ProDashboardScreen.css";

const ProDashboardScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const discountRate = userInfo?.proInfo?.discountRate || 0;

  return (
    <div className="pro-dashboard">
      <div className="pro-dashboard__header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue dans votre espace professionnel</p>
      </div>

      {/* Stats */}
      <div className="pro-dashboard__stats">
        <div className="pro-stat-card">
          <div className="pro-stat-card__icon pro-stat-card__icon--primary">
            <FiShoppingCart />
          </div>
          <div className="pro-stat-card__content">
            <span className="pro-stat-card__value">0</span>
            <span className="pro-stat-card__label">Commandes</span>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-card__icon pro-stat-card__icon--success">
            <FiTrendingUp />
          </div>
          <div className="pro-stat-card__content">
            <span className="pro-stat-card__value">0 XPF</span>
            <span className="pro-stat-card__label">Total dépensé</span>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-card__icon pro-stat-card__icon--warning">
            <FiRefreshCw />
          </div>
          <div className="pro-stat-card__content">
            <span className="pro-stat-card__value">0</span>
            <span className="pro-stat-card__label">Réappro en cours</span>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-card__icon pro-stat-card__icon--secondary">
            <FiPackage />
          </div>
          <div className="pro-stat-card__content">
            <span className="pro-stat-card__value">{discountRate}%</span>
            <span className="pro-stat-card__label">Votre remise</span>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="pro-dashboard__section">
        <h2>Actions rapides</h2>
        <div className="pro-dashboard__actions">
          <Link to="/pro/catalog" className="pro-action-card">
            <FiPackage />
            <span>Commander</span>
          </Link>
          <Link to="/pro/orders" className="pro-action-card">
            <FiShoppingCart />
            <span>Mes commandes</span>
          </Link>
          <Link to="/pro/reappro" className="pro-action-card">
            <FiRefreshCw />
            <span>Demande réappro</span>
          </Link>
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="pro-dashboard__section">
        <h2>Dernières commandes</h2>
        <p className="pro-dashboard__empty">Aucune commande pour le moment</p>
      </div>
    </div>
  );
};

export default ProDashboardScreen;
