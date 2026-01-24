import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiShoppingCart,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiX,
  FiFileText,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiHash,
  FiMessageSquare,
  FiPlus,
} from "react-icons/fi";
import {
  useGetAllProOrdersQuery,
  useGetProOrderStatsQuery,
  useUpdateProOrderStatusMutation,
  useRecordProOrderPaymentMutation,
  useAddProOrderNotesMutation,
  useGenerateProOrderInvoiceMutation,
  useDeleteProOrderMutation,
} from "../../../slices/proOrderApiSlice";
import { toast } from "react-toastify";
import "./AdminProOrderListScreen.css";

const AdminProOrderListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [orderTypeFilter, setOrderTypeFilter] = useState(
    searchParams.get("orderType") || "",
  );
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(
    searchParams.get("paymentStatus") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 15;

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, order: null });
  const [statusModal, setStatusModal] = useState({ open: false, order: null });
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    order: null,
  });
  const [notesModal, setNotesModal] = useState({ open: false, order: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, order: null });

  // États des formulaires
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (statusFilter) params.status = statusFilter;
    if (orderTypeFilter) params.orderType = orderTypeFilter;
    if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;

    return params;
  };

  // Queries
  const {
    data: ordersData,
    isLoading,
    isError,
    refetch,
  } = useGetAllProOrdersQuery(buildQueryParams());

  const { data: stats } = useGetProOrderStatsQuery();

  // Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateProOrderStatusMutation();
  const [recordPayment, { isLoading: isRecordingPayment }] =
    useRecordProOrderPaymentMutation();
  const [addNotes, { isLoading: isAddingNotes }] =
    useAddProOrderNotesMutation();
  const [generateInvoice, { isLoading: isGeneratingInvoice }] =
    useGenerateProOrderInvoiceMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteProOrderMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (orderTypeFilter) params.set("orderType", orderTypeFilter);
    if (paymentStatusFilter) params.set("paymentStatus", paymentStatusFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [
    keyword,
    statusFilter,
    orderTypeFilter,
    paymentStatusFilter,
    page,
    setSearchParams,
  ]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, statusFilter, orderTypeFilter, paymentStatusFilter]);

  // Filtrer côté client pour la recherche
  const getFilteredOrders = () => {
    if (!ordersData?.orders) return [];

    let filtered = ordersData.orders;

    if (keyword) {
      const search = keyword.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(search) ||
          order.user?.name?.toLowerCase().includes(search) ||
          order.user?.email?.toLowerCase().includes(search) ||
          order.shippingAddress?.companyName?.toLowerCase().includes(search),
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setOrderTypeFilter("");
    setPaymentStatusFilter("");
    setPage(1);
  };

  const handleOpenView = (order) => {
    setViewModal({ open: true, order });
  };

  const handleOpenStatusModal = (order) => {
    setNewStatus(order.status);
    setStatusNote("");
    setStatusModal({ open: true, order });
  };

  const handleOpenPaymentModal = (order) => {
    setPaymentAmount("");
    setPaymentNote("");
    setPaymentModal({ open: true, order });
  };

  const handleOpenNotesModal = (order) => {
    setInternalNotes(order.internalNotes || "");
    setNotesModal({ open: true, order });
  };

  // Changer le statut
  const handleUpdateStatus = async () => {
    if (!statusModal.order || !newStatus) return;

    try {
      await updateStatus({
        id: statusModal.order._id,
        status: newStatus,
        note: statusNote,
      }).unwrap();

      toast.success("Statut mis à jour");
      setStatusModal({ open: false, order: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Enregistrer un paiement
  const handleRecordPayment = async () => {
    if (!paymentModal.order || !paymentAmount) return;

    const amount = Number(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Montant invalide");
      return;
    }

    try {
      await recordPayment({
        id: paymentModal.order._id,
        amount,
        note: paymentNote,
      }).unwrap();

      toast.success("Paiement enregistré");
      setPaymentModal({ open: false, order: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  // Ajouter des notes
  const handleAddNotes = async () => {
    if (!notesModal.order) return;

    try {
      await addNotes({
        id: notesModal.order._id,
        internalNotes,
      }).unwrap();

      toast.success("Notes enregistrées");
      setNotesModal({ open: false, order: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Générer une facture
  const handleGenerateInvoice = async (orderId) => {
    try {
      await generateInvoice(orderId).unwrap();
      toast.success("Numéro de facture généré");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Supprimer
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
      draft: { label: "Brouillon", class: "draft", icon: FiFileText },
      pending: { label: "En attente", class: "pending", icon: FiClock },
      confirmed: {
        label: "Confirmée",
        class: "confirmed",
        icon: FiCheckCircle,
      },
      processing: {
        label: "En préparation",
        class: "processing",
        icon: FiPackage,
      },
      ready: { label: "Prête", class: "ready", icon: FiPackage },
      shipped: { label: "Expédiée", class: "shipped", icon: FiTruck },
      delivered: { label: "Livrée", class: "delivered", icon: FiCheckCircle },
      completed: { label: "Terminée", class: "completed", icon: FiCheckCircle },
      cancelled: { label: "Annulée", class: "cancelled", icon: FiXCircle },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      pending: { label: "En attente", class: "pending" },
      partial: { label: "Partiel", class: "partial" },
      paid: { label: "Payé", class: "paid" },
      overdue: { label: "En retard", class: "overdue" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getOrderTypeLabel = (type) => {
    const labels = {
      revendeur: "Revendeur",
      depot_vente: "Dépôt-vente",
    };
    return labels[type] || type;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price || 0) + " XPF";
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

  // Calculs stats
  const pendingCount =
    stats?.byStatus?.find((s) => s._id === "pending")?.count || 0;
  const processingCount =
    stats?.byStatus?.find((s) => s._id === "processing")?.count || 0;

  const totalPages = ordersData?.totalPages || 1;
  const totalOrders = ordersData?.total || 0;

  return (
    <div className="pro-order-list">
      {/* Header */}
      <div className="pro-order-list__header">
        <div className="pro-order-list__header-top">
          <div>
            <h1>Commandes Pro</h1>
            <p>Gérez les commandes des professionnels</p>
          </div>
          <div className="pro-order-list__header-actions">
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
      <div className="pro-order-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiShoppingCart />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.totalOrders || 0}</span>
            <span className="quick-stat__label">Total commandes</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {pendingCount + processingCount}
            </span>
            <span className="quick-stat__label">À traiter</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiDollarSign />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {formatPrice(stats?.totalRevenue)}
            </span>
            <span className="quick-stat__label">CA encaissé</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--danger">
            <FiAlertCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {formatPrice(stats?.pendingPayments)}
            </span>
            <span className="quick-stat__label">En attente paiement</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="pro-order-list__filters">
        <div className="pro-order-list__search">
          <FiSearch className="pro-order-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par n° commande, client, entreprise..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="pro-order-list__filter-row">
          <div className="pro-order-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="processing">En préparation</option>
              <option value="ready">Prête</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div className="pro-order-list__filter-group">
            <label>Type</label>
            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="revendeur">Revendeur</option>
              <option value="depot_vente">Dépôt-vente</option>
            </select>
          </div>

          <div className="pro-order-list__filter-group">
            <label>Paiement</label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="pending">En attente</option>
              <option value="partial">Partiel</option>
              <option value="paid">Payé</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
        </div>

        <div className="pro-order-list__filter-actions">
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
        <div className="pro-order-list__container">
          <div className="pro-order-list__loader">
            <FiRefreshCw />
            <span>Chargement des commandes...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="pro-order-list__container">
          <div className="pro-order-list__empty">
            <FiAlertCircle className="pro-order-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les commandes.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="pro-order-list__container">
          <div className="pro-order-list__empty">
            <FiShoppingCart className="pro-order-list__empty-icon" />
            <h3>Aucune commande trouvée</h3>
            <p>Aucune commande ne correspond à vos critères.</p>
            {(keyword ||
              statusFilter ||
              orderTypeFilter ||
              paymentStatusFilter) && (
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
          <div className="pro-order-list__container">
            <table className="pro-order-list__table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Paiement</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const paymentInfo = getPaymentStatusInfo(order.paymentStatus);

                  return (
                    <tr key={order._id}>
                      <td>
                        <div className="order-number-cell">
                          <span className="order-number-cell__number">
                            {order.orderNumber}
                          </span>
                          {order.invoiceNumber && (
                            <span className="order-number-cell__invoice">
                              Fact: {order.invoiceNumber}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <span className="client-cell__name">
                            {order.user?.name || "-"}
                          </span>
                          <span className="client-cell__company">
                            {order.shippingAddress?.companyName || "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">
                          {getOrderTypeLabel(order.orderType)}
                        </span>
                      </td>
                      <td>
                        <div className="amount-cell">
                          <span className="amount-cell__total">
                            {formatPrice(order.totalAmount)}
                          </span>
                          <span className="amount-cell__items">
                            {order.items?.length || 0} article(s)
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
                        <span
                          className={`payment-badge payment-badge--${paymentInfo.class}`}
                        >
                          {paymentInfo.label}
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
                            className="action-btn action-btn--edit"
                            onClick={() => handleOpenStatusModal(order)}
                            title="Changer le statut"
                          >
                            <FiEdit />
                          </button>
                          {order.paymentStatus !== "paid" && (
                            <button
                              className="action-btn action-btn--payment"
                              onClick={() => handleOpenPaymentModal(order)}
                              title="Enregistrer un paiement"
                            >
                              <FiDollarSign />
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
              <div className="pro-order-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({totalOrders} commandes)
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
          <div className="pro-order-list__mobile-cards">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const paymentInfo = getPaymentStatusInfo(order.paymentStatus);

              return (
                <div key={order._id} className="order-card">
                  <div className="order-card__header">
                    <div className="order-card__number">
                      <h3>{order.orderNumber}</h3>
                      <span className="order-card__type">
                        {getOrderTypeLabel(order.orderType)}
                      </span>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="order-card__body">
                    <div className="order-card__info">
                      <FiUser />
                      <span>{order.user?.name || "-"}</span>
                    </div>
                    <div className="order-card__info">
                      <FiPackage />
                      <span>{order.shippingAddress?.companyName || "-"}</span>
                    </div>
                    <div className="order-card__info">
                      <FiDollarSign />
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                    <div className="order-card__info">
                      <FiCreditCard />
                      <span
                        className={`payment-badge payment-badge--${paymentInfo.class}`}
                      >
                        {paymentInfo.label}
                      </span>
                    </div>
                    <div className="order-card__info">
                      <FiCalendar />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="order-card__actions">
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenView(order)}
                    >
                      <FiEye /> Détails
                    </button>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => handleOpenStatusModal(order)}
                    >
                      <FiEdit /> Statut
                    </button>
                    {order.paymentStatus !== "paid" && (
                      <button
                        className="btn btn--success btn--sm"
                        onClick={() => handleOpenPaymentModal(order)}
                      >
                        <FiDollarSign /> Paiement
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="pro-order-list__pagination">
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
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                Commande {viewModal.order.orderNumber}
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
                {/* Header avec statuts */}
                <div className="order-detail__header">
                  <div className="order-detail__header-info">
                    <span className="order-detail__type">
                      {getOrderTypeLabel(viewModal.order.orderType)}
                    </span>
                    {viewModal.order.invoiceNumber && (
                      <span className="order-detail__invoice">
                        Facture: {viewModal.order.invoiceNumber}
                      </span>
                    )}
                  </div>
                  <div className="order-detail__header-badges">
                    {(() => {
                      const statusInfo = getStatusInfo(viewModal.order.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <span
                          className={`status-badge status-badge--${statusInfo.class}`}
                        >
                          <StatusIcon />
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                    <span
                      className={`payment-badge payment-badge--${getPaymentStatusInfo(viewModal.order.paymentStatus).class}`}
                    >
                      {
                        getPaymentStatusInfo(viewModal.order.paymentStatus)
                          .label
                      }
                    </span>
                  </div>
                </div>

                {/* Client */}
                <div className="order-detail__section">
                  <h4 className="order-detail__section-title">
                    <FiUser /> Client
                  </h4>
                  <div className="order-detail__grid">
                    <div className="order-detail__item">
                      <span className="order-detail__item-label">Nom</span>
                      <span className="order-detail__item-value">
                        {viewModal.order.user?.name || "-"}
                      </span>
                    </div>
                    <div className="order-detail__item">
                      <span className="order-detail__item-label">Email</span>
                      <span className="order-detail__item-value">
                        {viewModal.order.user?.email || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div className="order-detail__section">
                  <h4 className="order-detail__section-title">
                    <FiMapPin /> Livraison
                  </h4>
                  <div className="order-detail__address">
                    <p>
                      <strong>
                        {viewModal.order.shippingAddress?.companyName}
                      </strong>
                      <br />
                      {viewModal.order.shippingAddress?.contactName}
                      <br />
                      {viewModal.order.shippingAddress?.street}
                      <br />
                      {viewModal.order.shippingAddress?.postalCode}{" "}
                      {viewModal.order.shippingAddress?.city}
                      <br />
                      {viewModal.order.shippingAddress?.country}
                    </p>
                    {viewModal.order.shippingAddress?.phone && (
                      <p>
                        <FiPhone style={{ marginRight: "8px" }} />
                        {viewModal.order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Articles */}
                <div className="order-detail__section">
                  <h4 className="order-detail__section-title">
                    <FiPackage /> Articles ({viewModal.order.items?.length || 0}
                    )
                  </h4>
                  <div className="order-detail__items">
                    {viewModal.order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="order-item__image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="order-item__info">
                          <span className="order-item__name">{item.name}</span>
                          <span className="order-item__qty">
                            {item.quantity} x {formatPrice(item.proPrice)}
                          </span>
                        </div>
                        <div className="order-item__total">
                          {formatPrice(item.lineTotal)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totaux */}
                <div className="order-detail__section">
                  <h4 className="order-detail__section-title">
                    <FiDollarSign /> Récapitulatif
                  </h4>
                  <div className="order-detail__totals">
                    <div className="order-detail__total-row">
                      <span>Sous-total</span>
                      <span>{formatPrice(viewModal.order.subtotal)}</span>
                    </div>
                    {viewModal.order.discountAmount > 0 && (
                      <div className="order-detail__total-row order-detail__total-row--discount">
                        <span>Remise ({viewModal.order.discountRate}%)</span>
                        <span>
                          -{formatPrice(viewModal.order.discountAmount)}
                        </span>
                      </div>
                    )}
                    {viewModal.order.shippingCost > 0 && (
                      <div className="order-detail__total-row">
                        <span>Livraison</span>
                        <span>{formatPrice(viewModal.order.shippingCost)}</span>
                      </div>
                    )}
                    <div className="order-detail__total-row order-detail__total-row--final">
                      <span>Total</span>
                      <span>{formatPrice(viewModal.order.totalAmount)}</span>
                    </div>
                    {viewModal.order.paidAmount > 0 && (
                      <>
                        <div className="order-detail__total-row order-detail__total-row--paid">
                          <span>Payé</span>
                          <span>{formatPrice(viewModal.order.paidAmount)}</span>
                        </div>
                        <div className="order-detail__total-row order-detail__total-row--remaining">
                          <span>Reste à payer</span>
                          <span>
                            {formatPrice(
                              viewModal.order.totalAmount -
                                viewModal.order.paidAmount,
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="order-detail__section">
                  <h4 className="order-detail__section-title">
                    <FiCalendar /> Historique
                  </h4>
                  <div className="order-detail__grid">
                    <div className="order-detail__item">
                      <span className="order-detail__item-label">Créée le</span>
                      <span className="order-detail__item-value">
                        {formatDateTime(viewModal.order.createdAt)}
                      </span>
                    </div>
                    {viewModal.order.confirmedAt && (
                      <div className="order-detail__item">
                        <span className="order-detail__item-label">
                          Confirmée le
                        </span>
                        <span className="order-detail__item-value">
                          {formatDateTime(viewModal.order.confirmedAt)}
                        </span>
                      </div>
                    )}
                    {viewModal.order.paymentDueDate && (
                      <div className="order-detail__item">
                        <span className="order-detail__item-label">
                          Échéance paiement
                        </span>
                        <span className="order-detail__item-value">
                          {formatDate(viewModal.order.paymentDueDate)}
                        </span>
                      </div>
                    )}
                    {viewModal.order.deliveredAt && (
                      <div className="order-detail__item">
                        <span className="order-detail__item-label">
                          Livrée le
                        </span>
                        <span className="order-detail__item-value">
                          {formatDateTime(viewModal.order.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {(viewModal.order.customerNotes ||
                  viewModal.order.internalNotes) && (
                  <div className="order-detail__section">
                    <h4 className="order-detail__section-title">
                      <FiMessageSquare /> Notes
                    </h4>
                    {viewModal.order.customerNotes && (
                      <div className="order-detail__note">
                        <span className="order-detail__note-label">
                          Note client:
                        </span>
                        <p>{viewModal.order.customerNotes}</p>
                      </div>
                    )}
                    {viewModal.order.internalNotes && (
                      <div className="order-detail__note order-detail__note--internal">
                        <span className="order-detail__note-label">
                          Notes internes:
                        </span>
                        <p>{viewModal.order.internalNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Historique des modifications */}
                {viewModal.order.history &&
                  viewModal.order.history.length > 0 && (
                    <div className="order-detail__section">
                      <h4 className="order-detail__section-title">
                        <FiClock /> Historique des modifications
                      </h4>
                      <div className="order-detail__history">
                        {viewModal.order.history
                          .slice(0, 5)
                          .map((entry, index) => (
                            <div key={index} className="history-entry">
                              <span className="history-entry__date">
                                {formatDateTime(entry.date)}
                              </span>
                              <span className="history-entry__action">
                                {entry.action}
                              </span>
                              {entry.note && (
                                <span className="history-entry__note">
                                  {entry.note}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
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
              {!viewModal.order.invoiceNumber && (
                <button
                  className="btn btn--outline"
                  onClick={() => handleGenerateInvoice(viewModal.order._id)}
                  disabled={isGeneratingInvoice}
                >
                  <FiFileText /> Générer facture
                </button>
              )}
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, order: null });
                  handleOpenNotesModal(viewModal.order);
                }}
              >
                <FiMessageSquare /> Notes
              </button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setViewModal({ open: false, order: null });
                  handleOpenStatusModal(viewModal.order);
                }}
              >
                <FiEdit /> Modifier statut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changement Statut */}
      {statusModal.open && statusModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModal({ open: false, order: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Modifier le statut</h3>
              <button
                className="modal__close"
                onClick={() => setStatusModal({ open: false, order: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Commande <strong>{statusModal.order.orderNumber}</strong>
              </p>

              <div className="form-group">
                <label>Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="processing">En préparation</option>
                  <option value="ready">Prête</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note (optionnel)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows="3"
                  placeholder="Ajouter une note sur ce changement de statut..."
                ></textarea>
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

      {/* Modal Paiement */}
      {paymentModal.open && paymentModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setPaymentModal({ open: false, order: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--success">
                <FiDollarSign />
              </div>
              <h3 className="modal__title">Enregistrer un paiement</h3>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Commande <strong>{paymentModal.order.orderNumber}</strong>
                <br />
                Total:{" "}
                <strong>{formatPrice(paymentModal.order.totalAmount)}</strong>
                <br />
                Déjà payé:{" "}
                <strong>{formatPrice(paymentModal.order.paidAmount)}</strong>
                <br />
                Reste:{" "}
                <strong>
                  {formatPrice(
                    paymentModal.order.totalAmount -
                      paymentModal.order.paidAmount,
                  )}
                </strong>
              </p>

              <div className="form-group">
                <label>
                  Montant reçu (XPF) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="1"
                  placeholder="Ex: 50000"
                />
              </div>

              <div className="form-group">
                <label>Note (optionnel)</label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  rows="2"
                  placeholder="Ex: Virement reçu le..."
                ></textarea>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setPaymentModal({ open: false, order: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--success"
                onClick={handleRecordPayment}
                disabled={isRecordingPayment || !paymentAmount}
              >
                {isRecordingPayment ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Notes */}
      {notesModal.open && notesModal.order && (
        <div
          className="modal-overlay"
          onClick={() => setNotesModal({ open: false, order: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Notes internes</h3>
              <button
                className="modal__close"
                onClick={() => setNotesModal({ open: false, order: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Commande <strong>{notesModal.order.orderNumber}</strong>
              </p>

              <div className="form-group">
                <label>Notes internes</label>
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows="5"
                  placeholder="Notes visibles uniquement par les administrateurs..."
                ></textarea>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setNotesModal({ open: false, order: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleAddNotes}
                disabled={isAddingNotes}
              >
                {isAddingNotes ? "Enregistrement..." : "Enregistrer"}
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
                <strong>"{deleteModal.order.orderNumber}"</strong> ?
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

export default AdminProOrderListScreen;
