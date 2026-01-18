import { Link } from "react-router-dom";
import { useGetContactStatsQuery } from "../../slices/contactApiSlice";
import "./AdminDashboardScreen.css";

const AdminDashboardScreen = () => {
  // Stats des messages de contact
  const { data: contactStats } = useGetContactStatsQuery();

  // TODO: Remplacer par des données réelles via API
  const stats = {
    totalOrders: 156,
    pendingOrders: 12,
    totalProducts: 45,
    totalUsers: 234,
    totalRevenue: 1250000,
    monthlyRevenue: 320000,
  };

  const recentOrders = [
    {
      _id: "ORD001",
      user: "Jean Dupont",
      total: 15500,
      status: "En cours",
      date: "2025-01-18",
    },
    {
      _id: "ORD002",
      user: "Marie Claire",
      total: 8200,
      status: "Livré",
      date: "2025-01-17",
    },
    {
      _id: "ORD003",
      user: "Paul Martin",
      total: 22000,
      status: "En attente",
      date: "2025-01-17",
    },
    {
      _id: "ORD004",
      user: "Sophie Leroux",
      total: 5500,
      status: "Livré",
      date: "2025-01-16",
    },
    {
      _id: "ORD005",
      user: "Lucas Bernard",
      total: 12800,
      status: "En cours",
      date: "2025-01-16",
    },
  ];

  const lowStockProducts = [
    { _id: "1", name: "Pot de Fleur Terracotta", stock: 3 },
    { _id: "2", name: "Dessous de Verre Noir", stock: 5 },
    { _id: "3", name: "Porte-savon Bleu", stock: 2 },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Livré":
        return "status-delivered";
      case "En cours":
        return "status-processing";
      case "En attente":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Tableau de bord</h1>
          <p>Bienvenue dans l'espace administrateur de Krysto</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/products/create" className="admin-btn primary">
            + Nouveau produit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-label">Commandes totales</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingOrders}</span>
            <span className="stat-label">En attente</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">🛍️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-label">Produits</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Utilisateurs</span>
          </div>
        </div>

        {/* Messages de contact */}
        <Link to="/admin/contacts" className="stat-card stat-card-link">
          <div className="stat-icon messages">📬</div>
          <div className="stat-info">
            <span className="stat-value">
              {contactStats?.total || 0}
              {contactStats?.unread > 0 && (
                <span className="unread-badge">{contactStats.unread}</span>
              )}
            </span>
            <span className="stat-label">Messages</span>
          </div>
        </Link>

        <div className="stat-card highlight">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <span className="stat-value">
              {stats.totalRevenue.toLocaleString()} XPF
            </span>
            <span className="stat-label">Revenu total</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-card orders-card">
          <div className="card-header">
            <h2>📋 Commandes récentes</h2>
            <Link to="/admin/orders" className="view-all">
              Voir tout →
            </Link>
          </div>
          <div className="card-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/admin/order/${order._id}`}>{order._id}</Link>
                    </td>
                    <td>{order.user}</td>
                    <td>{order.total.toLocaleString()} XPF</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
          {/* Messages non lus */}
          {contactStats?.unread > 0 && (
            <div className="dashboard-card alert-card messages-alert">
              <div className="card-header">
                <h2>📬 Messages non lus</h2>
                <Link to="/admin/contacts" className="view-all">
                  Voir →
                </Link>
              </div>
              <div className="card-content">
                <div className="messages-alert-content">
                  <span className="messages-count">{contactStats.unread}</span>
                  <span className="messages-text">
                    message{contactStats.unread > 1 ? "s" : ""} en attente de
                    lecture
                  </span>
                  <Link
                    to="/admin/contacts?isRead=false"
                    className="btn-view-messages"
                  >
                    Consulter les messages
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          <div className="dashboard-card alert-card">
            <div className="card-header">
              <h2>⚠️ Stock faible</h2>
            </div>
            <div className="card-content">
              {lowStockProducts.length > 0 ? (
                <ul className="low-stock-list">
                  {lowStockProducts.map((product) => (
                    <li key={product._id}>
                      <span className="product-name">{product.name}</span>
                      <span className="stock-badge">
                        {product.stock} restants
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-alert">Tous les stocks sont OK ✅</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>⚡ Actions rapides</h2>
            </div>
            <div className="card-content">
              <div className="quick-actions">
                <Link to="/admin/products" className="quick-action-btn">
                  <span className="action-icon">📦</span>
                  <span>Gérer les produits</span>
                </Link>
                <Link to="/admin/orders" className="quick-action-btn">
                  <span className="action-icon">📋</span>
                  <span>Gérer les commandes</span>
                </Link>
                <Link to="/admin/users" className="quick-action-btn">
                  <span className="action-icon">👥</span>
                  <span>Gérer les utilisateurs</span>
                </Link>
                <Link to="/admin/categories" className="quick-action-btn">
                  <span className="action-icon">🏷️</span>
                  <span>Gérer les catégories</span>
                </Link>
                <Link to="/admin/contacts" className="quick-action-btn">
                  <span className="action-icon">📬</span>
                  <span>Messages de contact</span>
                  {contactStats?.unread > 0 && (
                    <span className="action-badge">{contactStats.unread}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
