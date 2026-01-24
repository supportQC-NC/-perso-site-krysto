import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiShoppingCart,
  FiCheckCircle,
  FiClock,
  FiX,
  FiCalendar,
  FiPackage,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDollarSign,
  FiTruck,
  FiCheck,
  FiXCircle,
  FiEdit3,
  FiBox,
  FiClipboard,
  FiNavigation,
} from "react-icons/fi";
import {
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
  useDeliverOrderMutation,
  useDeleteOrderMutation,
} from "../../../slices/orderApiSlice";
import { toast } from "react-toastify";
import "./AdminOrderListScreen.css";

// Points de collecte disponibles
const PICKUP_POINTS = [
  {
    id: "noumea_centre",
    name: "Krysto Nouméa Centre",
    address: "12 rue de Sébastopol",
    city: "Nouméa",
    postalCode: "98800",
    hours: "Lun-Ven: 9h-18h, Sam: 9h-12h",
  },
  {
    id: "noumea_magenta",
    name: "Krysto Magenta",
    address: "25 avenue du Maréchal Foch",
    city: "Nouméa",
    postalCode: "98800",
    hours: "Lun-Sam: 8h30-17h30",
  },
  {
    id: "dumbea",
    name: "Krysto Dumbéa",
    address: "Centre Commercial Kenu In",
    city: "Dumbéa",
    postalCode: "98835",
    hours: "Lun-Sam: 9h-19h, Dim: 9h-12h",
  },
  {
    id: "paita",
    name: "Krysto Païta",
    address: "Zone Industrielle Paita Sud",
    city: "Païta",
    postalCode: "98890",
    hours: "Lun-Ven: 8h-17h",
  },
];

const AdminOrderListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [isPaidFilter, setIsPaidFilter] = useState(
    searchParams.get("isPaid") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 15;

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, order: null });
  const [statusModal, setStatusModal] = useState({ open: false, order: null });
  const [pickupModal, setPickupModal] = useState({ open: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, order: null });

  // États des formulaires
  const [newStatus, setNewStatus] = useState("");
  const [selectedPickupPoint, setSelectedPickupPoint] = useState("");

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {};

    if (statusFilter) params.status = statusFilter;
    if (isPaidFilter !== "") params.isPaid = isPaidFilter === "true";

    return params;
  };

  // Queries
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery(buildQueryParams());

  const { data: stats } = useGetOrderStatsQuery();

  // Mutations
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (isPaidFilter !== "") params.set("isPaid", isPaidFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [keyword, statusFilter, isPaidFilter, page, setSearchParams]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, statusFilter, isPaidFilter]);

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setIsPaidFilter("");
    setPage(1);
  };

  const handleOpenView = (order) => {
    setViewModal({ open: true, order });
  };

  const handleOpenStatus = (order) => {
    setNewStatus(order.status);
    setStatusModal({ open: true, order });
  };

  const handleOpenPickup = (order) => {
    setSelectedPickupPoint(order.pickupPoint || "");
    setPickupModal({ open: true, order });
  };

  // Changer le statut
  const handleUpdateStatus = async () => {
    if (!statusModal.order) return;

    try {
      await updateOrderStatus({
        orderId: statusModal.order._id,
        status: newStatus,
      }).unwrap();

      toast.success("Statut mis à jour");
      setStatusModal({ open: false, order: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Marquer comme prêt au point de collecte (livré)
  const handleMarkDelivered = async (order) => {
    try {
      await deliverOrder(order._id).unwrap();
      toast.success("Commande prête au point de collecte !");
      if (viewModal.open) {
        setViewModal({ open: false, order: null });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Marquer comme récupéré par le client (payé)
  const handleMarkPaid = async (order) => {
    try {
      await updateOrderStatus({
        orderId: order._id,
        status: "Livrée",
      }).unwrap();
      toast.success("Commande récupérée et payée !");
      if (viewModal.open) {
        setViewModal({ open: false, order: null });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Supprimer une commande
  const handleDelete = async () => {
    if (!deleteModal.order) return;

    try {
      await deleteOrder(deleteModal.order._id).unwrap();
      toast.success("Commande supprimée");
      setDeleteModal({ open: false, order: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Helpers
  const getStatusInfo = (status) => {
    const statusMap = {
      "En attente": { label: "En attente", class: "pending", icon: FiClock },
      Confirmée: { label: "Confirmée", class: "confirmed", icon: FiCheck },
      "En préparation": {
        label: "En préparation",
        class: "processing",
        icon: FiPackage,
      },
      Expédiée: {
        label: "Prête au point relais",
        class: "ready",
        icon: FiMapPin,
      },
      Livrée: { label: "Récupérée", class: "completed", icon: FiCheckCircle },
      Annulée: { label: "Annulée", class: "cancelled", icon: FiXCircle },
    };
    return statusMap[status] || statusMap["En attente"];
  };

  const formatPrice = (price) => {
    return `${price?.toLocaleString("fr-FR")} XPF`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPickupPointInfo = (pointId) => {
    return PICKUP_POINTS.find((p) => p.id === pointId) || null;
  };

  // Filtrer par keyword côté client
  const filteredOrders = orders
    ? orders.filter((order) => {
        if (!keyword) return true;
        const search = keyword.toLowerCase();
        return (
          order._id?.toLowerCase().includes(search) ||
          order.user?.name?.toLowerCase().includes(search) ||
          order.user?.email?.toLowerCase().includes(search)
        );
      })
    : [];

  // Pagination côté client
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Calculer les stats
  const pendingOrders =
    orders?.filter((o) => o.status === "En attente" || o.status === "Confirmée")
      .length || 0;
  const preparingOrders =
    orders?.filter((o) => o.status === "En préparation").length || 0;
  const readyOrders =
    orders?.filter((o) => o.status === "Expédiée").length || 0;

  return (
    <div className="order-list">
      {/* Header */}
      <div className="order-list__header">
        <div className="order-list__header-top">
          <div>
            <h1>Commandes Click & Collect</h1>
            <p>Gérez les commandes et les retraits en point de collecte</p>
          </div>
          <div className="order-list__header-actions">
            <button
              className="btn btn--secondary"
              onClick={refetch}
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="order-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiShoppingCart />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.totalOrders || orders?.length || 0}
            </span>
            <span className="quick-stat__label">Total commandes</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight-warning">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{pendingOrders}</span>
            <span className="quick-stat__label">À traiter</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight-info">
          <div className="quick-stat__icon quick-stat__icon--info">
            <FiPackage />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{preparingOrders}</span>
            <span className="quick-stat__label">En préparation</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight-success">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiMapPin />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{readyOrders}</span>
            <span className="quick-stat__label">Prêtes à retirer</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--secondary">
            <FiDollarSign />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {formatPrice(stats?.totalRevenue || 0)}
            </span>
            <span className="quick-stat__label">Chiffre d'affaires</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="order-list__filters">
        <div className="order-list__search">
          <FiSearch className="order-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par n° commande, nom ou email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="order-list__filter-row">
          <div className="order-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Confirmée">Confirmée</option>
              <option value="En préparation">En préparation</option>
              <option value="Expédiée">Prête au point relais</option>
              <option value="Livrée">Récupérée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          <div className="order-list__filter-group">
            <label>Paiement</label>
            <select
              value={isPaidFilter}
              onChange={(e) => setIsPaidFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="false">Non payé</option>
              <option value="true">Payé</option>
            </select>
          </div>
        </div>

        <div className="order-list__filter-actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="order-list__container">
          <div className="order-list__loader">
            <FiRefreshCw />
            <span>Chargement des commandes...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="order-list__container">
          <div className="order-list__empty">
            <FiAlertCircle className="order-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les commandes.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="order-list__container">
          <div className="order-list__empty">
            <FiShoppingCart className="order-list__empty-icon" />
            <h3>Aucune commande trouvée</h3>
            <p>Aucune commande ne correspond à vos critères.</p>
            {(keyword || statusFilter || isPaidFilter) && (
              <button
                className="btn btn--secondary"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Tableau desktop */}
          <div className="order-list__container">
            <table className="order-list__table">
              <thead>
                <tr>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th>Total</th>
                  <th>Point de retrait</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const pickupPoint = getPickupPointInfo(
                    order.shippingAddress?.city,
                  );

                  return (
                    <tr key={order._id}>
                      <td>
                        <div className="order-number-cell">
                          <span className="order-number">
                            #{order._id?.slice(-8).toUpperCase()}
                          </span>
                          {!order.isPaid && (
                            <span className="payment-badge payment-badge--pending">
                              <FiDollarSign /> À payer
                            </span>
                          )}
                          {order.isPaid && (
                            <span className="payment-badge payment-badge--paid">
                              <FiCheck /> Payé
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <span className="client-cell__name">
                            {order.user?.name}
                          </span>
                          <span className="client-cell__email">
                            {order.user?.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="items-cell">
                          <span className="items-cell__count">
                            {order.orderItems?.length} produit(s)
                          </span>
                          <span className="items-cell__qty">
                            {order.orderItems?.reduce(
                              (acc, item) => acc + item.qty,
                              0,
                            )}{" "}
                            article(s)
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="price-cell">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </td>
                      <td>
                        <div className="pickup-cell">
                          <FiMapPin />
                          <span>
                            {order.shippingAddress?.city || "Non défini"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-badge status-badge--${statusInfo.class}`}
                        >
                          <StatusIcon />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleOpenView(order)}
                            title="Voir les détails"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--status"
                            onClick={() => handleOpenStatus(order)}
                            title="Changer statut"
                          >
                            <FiEdit3 />
                          </button>
                          {order.status === "En préparation" && (
                            <button
                              className="action-btn action-btn--ready"
                              onClick={() => handleMarkDelivered(order)}
                              title="Marquer prêt au point relais"
                            >
                              <FiMapPin />
                            </button>
                          )}
                          {order.status === "Expédiée" && !order.isPaid && (
                            <button
                              className="action-btn action-btn--paid"
                              onClick={() => handleMarkPaid(order)}
                              title="Marquer récupéré et payé"
                            >
                              <FiCheckCircle />
                            </button>
                          )}
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() =>
                              setDeleteModal({ open: true, order })
                            }
                            title="Supprimer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="order-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({filteredOrders.length}{" "}
                  commandes)
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft />
                  </button>

                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (page <= 3) {
                      pageNum = index + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = page - 2 + index;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`pagination__btn ${page === pageNum ? "pagination__btn--active" : ""}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cartes mobile */}
          <div className="order-list__mobile-cards">
            {paginatedOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => handleOpenView(order)}
                >
                  <div className="order-card__header">
                    <div className="order-card__number">
                      <FiShoppingCart />
                      <span>#{order._id?.slice(-8).toUpperCase()}</span>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="order-card__body">
                    <div className="order-card__client">
                      <FiUser />
                      <div>
                        <span className="order-card__client-name">
                          {order.user?.name}
                        </span>
                        <span className="order-card__client-email">
                          {order.user?.email}
                        </span>
                      </div>
                    </div>

                    <div className="order-card__info-row">
                      <div className="order-card__info">
                        <FiPackage />
                        <span>{order.orderItems?.length} produit(s)</span>
                      </div>
                      <div className="order-card__info">
                        <FiDollarSign />
                        <span className="order-card__price">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="order-card__info">
                      <FiMapPin />
                      <span>
                        {order.shippingAddress?.city ||
                          "Point de retrait non défini"}
                      </span>
                    </div>

                    <div className="order-card__info">
                      <FiCalendar />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="order-card__payment">
                      {!order.isPaid ? (
                        <span className="payment-badge payment-badge--pending">
                          <FiDollarSign /> Paiement à la récupération
                        </span>
                      ) : (
                        <span className="payment-badge payment-badge--paid">
                          <FiCheck /> Payé
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="order-card__actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenView(order)}
                    >
                      <FiEye /> Détails
                    </button>
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => handleOpenStatus(order)}
                    >
                      <FiEdit3 /> Statut
                    </button>
                    {order.status === "Expédiée" && !order.isPaid && (
                      <button
                        className="btn btn--success btn--sm"
                        onClick={() => handleMarkPaid(order)}
                      >
                        <FiCheckCircle /> Récupéré
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="order-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages}
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft /> Précédent
                  </button>
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Suivant <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal Détail */}
      {viewModal.open && viewModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setViewModal({ open: false, order: null })}
        >
          <div
            className="modal modal--large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3 className="modal__title">
                Commande #{viewModal.order._id?.slice(-8).toUpperCase()}
              </h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, order: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="order-detail">
                {/* Header avec statut */}
                <div className="order-detail__header">
                  {(() => {
                    const statusInfo = getStatusInfo(viewModal.order.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <span
                        className={`status-badge status-badge--${statusInfo.class} status-badge--lg`}
                      >
                        <StatusIcon />
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                  {!viewModal.order.isPaid ? (
                    <span className="payment-badge payment-badge--pending payment-badge--lg">
                      <FiDollarSign /> Paiement à la récupération
                    </span>
                  ) : (
                    <span className="payment-badge payment-badge--paid payment-badge--lg">
                      <FiCheck /> Payé le {formatDate(viewModal.order.paidAt)}
                    </span>
                  )}
                </div>

                {/* Client */}
                <div className="order-detail__section">
                  <h4>
                    <FiUser /> Client
                  </h4>
                  <div className="order-detail__client">
                    <div className="order-detail__client-info">
                      <span className="order-detail__client-name">
                        {viewModal.order.user?.name}
                      </span>
                      <span className="order-detail__client-contact">
                        <FiMail /> {viewModal.order.user?.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Point de collecte */}
                <div className="order-detail__section order-detail__section--pickup">
                  <h4>
                    <FiMapPin /> Point de collecte
                  </h4>
                  <div className="order-detail__pickup">
                    <div className="order-detail__pickup-icon">
                      <FiNavigation />
                    </div>
                    <div className="order-detail__pickup-info">
                      <span className="order-detail__pickup-name">
                        {viewModal.order.shippingAddress?.city ||
                          "Point de retrait"}
                      </span>
                      <span className="order-detail__pickup-address">
                        {viewModal.order.shippingAddress?.address}
                      </span>
                      <span className="order-detail__pickup-address">
                        {viewModal.order.shippingAddress?.postalCode}{" "}
                        {viewModal.order.shippingAddress?.city}
                      </span>
                    </div>
                  </div>
                  <div className="order-detail__pickup-note">
                    <FiClipboard />
                    <span>Paiement en espèces à la récupération</span>
                  </div>
                </div>

                {/* Articles */}
                <div className="order-detail__section">
                  <h4>
                    <FiPackage /> Articles ({viewModal.order.orderItems?.length}
                    )
                  </h4>
                  <div className="order-detail__items">
                    {viewModal.order.orderItems?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="order-item__image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="order-item__info">
                          <span className="order-item__name">{item.name}</span>
                          <span className="order-item__details">
                            Qté: {item.qty} × {formatPrice(item.price)}
                          </span>
                        </div>
                        <div className="order-item__total">
                          {formatPrice(item.qty * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totaux */}
                <div className="order-detail__section">
                  <h4>
                    <FiDollarSign /> Récapitulatif
                  </h4>
                  <div className="order-detail__totals">
                    <div className="order-detail__total-row">
                      <span>Sous-total</span>
                      <span>{formatPrice(viewModal.order.itemsPrice)}</span>
                    </div>
                    <div className="order-detail__total-row">
                      <span>Taxes (TGC)</span>
                      <span>{formatPrice(viewModal.order.taxPrice)}</span>
                    </div>
                    <div className="order-detail__total-row order-detail__total-row--final">
                      <span>Total à payer</span>
                      <span>{formatPrice(viewModal.order.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="order-detail__section">
                  <h4>
                    <FiClock /> Historique
                  </h4>
                  <div className="order-detail__timeline">
                    <div className="timeline-item timeline-item--done">
                      <div className="timeline-item__dot"></div>
                      <div className="timeline-item__content">
                        <span className="timeline-item__label">
                          Commande passée
                        </span>
                        <span className="timeline-item__date">
                          {formatDateTime(viewModal.order.createdAt)}
                        </span>
                      </div>
                    </div>
                    {viewModal.order.isDelivered && (
                      <div className="timeline-item timeline-item--done">
                        <div className="timeline-item__dot"></div>
                        <div className="timeline-item__content">
                          <span className="timeline-item__label">
                            Prête au point relais
                          </span>
                          <span className="timeline-item__date">
                            {formatDateTime(viewModal.order.deliveredAt)}
                          </span>
                        </div>
                      </div>
                    )}
                    {viewModal.order.isPaid && (
                      <div className="timeline-item timeline-item--done">
                        <div className="timeline-item__dot"></div>
                        <div className="timeline-item__content">
                          <span className="timeline-item__label">
                            Récupérée et payée
                          </span>
                          <span className="timeline-item__date">
                            {formatDateTime(viewModal.order.paidAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {viewModal.order.notes && (
                  <div className="order-detail__section order-detail__section--notes">
                    <h4>
                      <FiClipboard /> Notes client
                    </h4>
                    <p>{viewModal.order.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setViewModal({ open: false, order: null })}
              >
                Fermer
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, order: null });
                  handleOpenStatus(viewModal.order);
                }}
              >
                <FiEdit3 /> Statut
              </button>
              {viewModal.order.status === "En préparation" && (
                <button
                  className="btn btn--primary"
                  onClick={() => handleMarkDelivered(viewModal.order)}
                  disabled={isDelivering}
                >
                  <FiMapPin /> {isDelivering ? "..." : "Prêt au point relais"}
                </button>
              )}
              {viewModal.order.status === "Expédiée" &&
                !viewModal.order.isPaid && (
                  <button
                    className="btn btn--success"
                    onClick={() => handleMarkPaid(viewModal.order)}
                  >
                    <FiCheckCircle /> Marquer récupéré et payé
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Changer Statut */}
      {statusModal.open && statusModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModal({ open: false, order: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Changer le statut</h3>
              <button
                className="modal__close"
                onClick={() => setStatusModal({ open: false, order: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Commande{" "}
                <strong>
                  #{statusModal.order._id?.slice(-8).toUpperCase()}
                </strong>
              </p>

              <div className="form-group">
                <label>Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Expédiée">Prête au point relais</option>
                  <option value="Livrée">Récupérée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>

              <div className="status-workflow">
                <h5>Workflow Click & Collect :</h5>
                <div className="status-workflow__steps">
                  <div className="status-workflow__step">
                    <span className="status-workflow__number">1</span>
                    <span>En attente</span>
                  </div>
                  <div className="status-workflow__arrow">→</div>
                  <div className="status-workflow__step">
                    <span className="status-workflow__number">2</span>
                    <span>Confirmée</span>
                  </div>
                  <div className="status-workflow__arrow">→</div>
                  <div className="status-workflow__step">
                    <span className="status-workflow__number">3</span>
                    <span>En préparation</span>
                  </div>
                  <div className="status-workflow__arrow">→</div>
                  <div className="status-workflow__step">
                    <span className="status-workflow__number">4</span>
                    <span>Prête au relais</span>
                  </div>
                  <div className="status-workflow__arrow">→</div>
                  <div className="status-workflow__step status-workflow__step--final">
                    <span className="status-workflow__number">5</span>
                    <span>Récupérée</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setStatusModal({ open: false, order: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleUpdateStatus}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Mise à jour..." : "Mettre à jour"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteModal.open && deleteModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, order: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer la commande</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer la commande{" "}
                <strong>
                  #{deleteModal.order._id?.slice(-8).toUpperCase()}
                </strong>{" "}
                ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, order: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderListScreen;
