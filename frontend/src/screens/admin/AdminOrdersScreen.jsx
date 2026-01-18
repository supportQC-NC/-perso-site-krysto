import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useDeliverOrderMutation,
  useDeleteOrderMutation,
} from "../../slices/orderApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminOrdersScreen.css";

const AdminOrdersScreen = () => {
  const [filters, setFilters] = useState({
    status: "",
    isPaid: "",
    isDelivered: "",
  });

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery(filters);
  const { data: stats } = useGetOrderStatsQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deliverOrder] = useDeliverOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus({ orderId, status }).unwrap();
      toast.success("Statut mis à jour");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    if (window.confirm("Marquer cette commande comme livrée ?")) {
      try {
        await deliverOrder(orderId).unwrap();
        toast.success("Commande marquée comme livrée");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success("Commande supprimée");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      "En attente": "status-pending",
      Confirmée: "status-confirmed",
      "En préparation": "status-preparing",
      Expédiée: "status-shipped",
      Livrée: "status-delivered",
      Annulée: "status-cancelled",
    };
    return classes[status] || "";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("fr-FR") + " XPF";
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  // Calcul des stats
  const totalRevenue =
    orders?.reduce(
      (acc, order) => (order.isPaid ? acc + order.totalPrice : acc),
      0,
    ) || 0;
  const pendingOrders =
    orders?.filter((o) => o.status === "En attente").length || 0;
  const paidOrders = orders?.filter((o) => o.isPaid).length || 0;

  return (
    <div className="admin-orders">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📋 Gestion des commandes</h1>
          <p>Suivez et gérez toutes les commandes de la boutique</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📦</div>
          <div className="stat-info">
            <span className="stat-value">{orders?.length || 0}</span>
            <span className="stat-label">Total commandes</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{pendingOrders}</span>
            <span className="stat-label">En attente</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon paid">💳</div>
          <div className="stat-info">
            <span className="stat-value">{paidOrders}</span>
            <span className="stat-label">Payées</span>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatPrice(totalRevenue)}</span>
            <span className="stat-label">Revenu total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Statut</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En préparation">En préparation</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Paiement</label>
          <select
            name="isPaid"
            value={filters.isPaid}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="true">Payées</option>
            <option value="false">Non payées</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Livraison</label>
          <select
            name="isDelivered"
            value={filters.isDelivered}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="true">Livrées</option>
            <option value="false">Non livrées</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Liste des commandes</h2>
          <span className="order-count">{orders?.length || 0} commande(s)</span>
        </div>
        <div className="card-content">
          {orders?.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-table orders-table">
                <thead>
                  <tr>
                    <th>Commande</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paiement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="order-id"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                        <span className="order-items-count">
                          {order.orderItems?.length || 0} article(s)
                        </span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">
                            {order.user?.name || "N/A"}
                          </span>
                          <span className="customer-email">
                            {order.user?.email || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className="order-total">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </td>
                      <td>
                        {order.isPaid ? (
                          <span className="payment-badge paid">
                            ✅ {formatDate(order.paidAt)}
                          </span>
                        ) : (
                          <span className="payment-badge not-paid">
                            ❌ Non payée
                          </span>
                        )}
                      </td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`status-select ${getStatusClass(order.status)}`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Confirmée">Confirmée</option>
                          <option value="En préparation">En préparation</option>
                          <option value="Expédiée">Expédiée</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="action-btn view"
                            title="Voir détails"
                          >
                            👁️
                          </Link>
                          {!order.isDelivered && order.isPaid && (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              className="action-btn deliver"
                              title="Marquer livrée"
                            >
                              🚚
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="action-btn delete"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">Aucune commande trouvée</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersScreen;
