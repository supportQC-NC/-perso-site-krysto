import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useDeliverOrderMutation,
} from "../../slices/orderApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminOrderDetailsScreen.css";

const AdminOrderDetailScreen = () => {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const handleStatusChange = async (e) => {
    try {
      await updateOrderStatus({ orderId: id, status: e.target.value }).unwrap();
      toast.success("Statut mis à jour");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleMarkDelivered = async () => {
    try {
      await deliverOrder(id).unwrap();
      toast.success("Commande marquée comme livrée");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString("fr-FR") + " XPF";
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Commande non trouvée</p>;
  if (!order) return null;

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div className="header-left">
          <Link to="/admin/orders" className="back-link">
            ← Retour aux commandes
          </Link>
          <h1>Commande #{order._id.slice(-8).toUpperCase()}</h1>
          <span className="order-date">
            Passée le {formatDate(order.createdAt)}
          </span>
        </div>
        <div className="header-right">
          <select
            value={order.status}
            onChange={handleStatusChange}
            className={`status-select-large ${getStatusClass(order.status)}`}
          >
            <option value="En attente">En attente</option>
            <option value="Confirmée">Confirmée</option>
            <option value="En préparation">En préparation</option>
            <option value="Expédiée">Expédiée</option>
            <option value="Livrée">Livrée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
      </div>

      <div className="order-detail-grid">
        {/* Main Content */}
        <div className="order-detail-main">
          {/* Order Items */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>📦 Articles commandés</h2>
              <span className="items-count">
                {order.orderItems?.length || 0} article(s)
              </span>
            </div>
            <div className="detail-card-content">
              <div className="order-items-list">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <Link
                        to={`/product/${item.product}`}
                        className="item-name"
                      >
                        {item.name}
                      </Link>
                      {item.variantColor && (
                        <span className="item-variant">
                          Couleur: {item.variantColor}
                        </span>
                      )}
                      <span className="item-qty">Quantité: {item.qty}</span>
                    </div>
                    <div className="item-price">
                      <span className="unit-price">
                        {formatPrice(item.price)}
                      </span>
                      <span className="total-price">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>🚚 Adresse de livraison</h2>
            </div>
            <div className="detail-card-content">
              <div className="address-block">
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.postalCode}{" "}
                  {order.shippingAddress?.city}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </div>
              <div className="delivery-status">
                {order.isDelivered ? (
                  <span className="delivered">
                    ✅ Livrée le {formatDate(order.deliveredAt)}
                  </span>
                ) : (
                  <span className="not-delivered">
                    ⏳ En attente de livraison
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-detail-sidebar">
          {/* Customer */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>👤 Client</h2>
            </div>
            <div className="detail-card-content">
              <div className="customer-block">
                <div className="customer-avatar">
                  {order.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="customer-info">
                  <span className="customer-name">
                    {order.user?.name || "N/A"}
                  </span>
                  <a
                    href={`mailto:${order.user?.email}`}
                    className="customer-email"
                  >
                    {order.user?.email || "N/A"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>💳 Paiement</h2>
            </div>
            <div className="detail-card-content">
              <div className="payment-info">
                <div className="info-row">
                  <span>Méthode</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span>Statut</span>
                  {order.isPaid ? (
                    <span className="paid-status">✅ Payée</span>
                  ) : (
                    <span className="unpaid-status">❌ Non payée</span>
                  )}
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="info-row">
                    <span>Date</span>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>🧾 Récapitulatif</h2>
            </div>
            <div className="detail-card-content">
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Sous-total</span>
                  <span>{formatPrice(order.itemsPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Livraison</span>
                  <span>{formatPrice(order.shippingPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Taxes</span>
                  <span>{formatPrice(order.taxPrice)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!order.isDelivered && order.isPaid && (
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>⚡ Actions</h2>
              </div>
              <div className="detail-card-content">
                <button
                  onClick={handleMarkDelivered}
                  className="btn-deliver"
                  disabled={isDelivering}
                >
                  {isDelivering ? "Mise à jour..." : "🚚 Marquer comme livrée"}
                </button>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>📝 Notes</h2>
              </div>
              <div className="detail-card-content">
                <p className="order-notes">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailScreen;
