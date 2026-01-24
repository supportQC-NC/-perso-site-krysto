import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiAlertTriangle,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiMessageSquare,
  FiFileText,
  FiArrowRight,
  FiEdit,
  FiShoppingCart,
} from "react-icons/fi";
import {
  useGetAllReapproRequestsQuery,
  useGetReapproStatsQuery,
  useApproveReapproRequestMutation,
  useRejectReapproRequestMutation,
  useConvertReapproToOrderMutation,
  useUpdateReapproStatusMutation,
  useAddReapproNotesMutation,
  useDeleteReapproRequestMutation,
} from "../../../slices/reapproRequestApiSlice";
import { toast } from "react-toastify";
import "./AdminReapproRequestListScreen.css";

const AdminReapproRequestListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [priorityFilter, setPriorityFilter] = useState(
    searchParams.get("priority") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 15;

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, request: null });
  const [approveModal, setApproveModal] = useState({
    open: false,
    request: null,
  });
  const [rejectModal, setRejectModal] = useState({
    open: false,
    request: null,
  });
  const [statusModal, setStatusModal] = useState({
    open: false,
    request: null,
  });
  const [notesModal, setNotesModal] = useState({ open: false, request: null });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    request: null,
  });

  // États des formulaires
  const [approvedItems, setApprovedItems] = useState([]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [approveNote, setApproveNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
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
    if (priorityFilter) params.priority = priorityFilter;

    return params;
  };

  // Queries
  const {
    data: requestsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllReapproRequestsQuery(buildQueryParams());

  const { data: stats } = useGetReapproStatsQuery();

  // Mutations
  const [approveRequest, { isLoading: isApproving }] =
    useApproveReapproRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectReapproRequestMutation();
  const [convertToOrder, { isLoading: isConverting }] =
    useConvertReapproToOrderMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateReapproStatusMutation();
  const [addNotes, { isLoading: isAddingNotes }] = useAddReapproNotesMutation();
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteReapproRequestMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [keyword, statusFilter, priorityFilter, page, setSearchParams]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, statusFilter, priorityFilter]);

  // Filtrer côté client pour la recherche
  const getFilteredRequests = () => {
    if (!requestsData?.requests) return [];

    let filtered = requestsData.requests;

    if (keyword) {
      const search = keyword.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.requestNumber?.toLowerCase().includes(search) ||
          req.user?.name?.toLowerCase().includes(search) ||
          req.user?.email?.toLowerCase().includes(search),
      );
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setPriorityFilter("");
    setPage(1);
  };

  const handleOpenView = (request) => {
    setViewModal({ open: true, request });
  };

  const handleOpenApprove = (request) => {
    // Initialiser les quantités approuvées avec les quantités demandées
    const items = request.items.map((item) => ({
      product: item.product,
      name: item.name,
      requestedQuantity: item.requestedQuantity,
      approvedQuantity: item.requestedQuantity,
      unitPrice: item.unitPrice,
    }));
    setApprovedItems(items);
    setEstimatedDeliveryDate("");
    setApproveNote("");
    setApproveModal({ open: true, request });
  };

  const handleOpenReject = (request) => {
    setRejectionReason("");
    setRejectModal({ open: true, request });
  };

  const handleOpenStatusModal = (request) => {
    setNewStatus(request.status);
    setStatusNote("");
    setStatusModal({ open: true, request });
  };

  const handleOpenNotesModal = (request) => {
    setInternalNotes(request.internalNotes || "");
    setNotesModal({ open: true, request });
  };

  // Modifier la quantité approuvée d'un article
  const handleApprovedQtyChange = (productId, qty) => {
    setApprovedItems((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, approvedQuantity: Math.max(0, Number(qty) || 0) }
          : item,
      ),
    );
  };

  // Approuver la demande
  const handleApprove = async () => {
    if (!approveModal.request) return;

    const itemsData = approvedItems.map((item) => ({
      product: item.product,
      approvedQuantity: item.approvedQuantity,
    }));

    try {
      await approveRequest({
        id: approveModal.request._id,
        items: itemsData,
        note: approveNote,
        estimatedDeliveryDate: estimatedDeliveryDate || null,
      }).unwrap();

      toast.success("Demande approuvée !");
      setApproveModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'approbation");
    }
  };

  // Rejeter la demande
  const handleReject = async () => {
    if (!rejectModal.request) return;

    if (!rejectionReason.trim()) {
      toast.error("Veuillez indiquer une raison du refus");
      return;
    }

    try {
      await rejectRequest({
        id: rejectModal.request._id,
        reason: rejectionReason,
      }).unwrap();

      toast.success("Demande rejetée");
      setRejectModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors du rejet");
    }
  };

  // Convertir en commande Pro
  const handleConvertToOrder = async (requestId) => {
    try {
      await convertToOrder(requestId).unwrap();
      toast.success("Demande convertie en commande Pro !");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la conversion");
    }
  };

  // Changer le statut
  const handleUpdateStatus = async () => {
    if (!statusModal.request || !newStatus) return;

    try {
      await updateStatus({
        id: statusModal.request._id,
        status: newStatus,
        note: statusNote,
      }).unwrap();

      toast.success("Statut mis à jour");
      setStatusModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Ajouter des notes
  const handleAddNotes = async () => {
    if (!notesModal.request) return;

    try {
      await addNotes({
        id: notesModal.request._id,
        internalNotes,
      }).unwrap();

      toast.success("Notes enregistrées");
      setNotesModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Supprimer
  const handleDelete = async () => {
    if (!deleteModal.request) return;

    try {
      await deleteRequest(deleteModal.request._id).unwrap();
      toast.success("Demande supprimée");
      setDeleteModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Helpers
  const getStatusInfo = (status) => {
    const statusMap = {
      draft: { label: "Brouillon", class: "draft", icon: FiFileText },
      pending: { label: "En attente", class: "pending", icon: FiClock },
      approved: { label: "Approuvée", class: "approved", icon: FiCheckCircle },
      partial: { label: "Partielle", class: "partial", icon: FiCheckCircle },
      processing: { label: "En cours", class: "processing", icon: FiPackage },
      ready: { label: "Prête", class: "ready", icon: FiPackage },
      completed: { label: "Terminée", class: "completed", icon: FiCheckCircle },
      rejected: { label: "Rejetée", class: "rejected", icon: FiXCircle },
      cancelled: { label: "Annulée", class: "cancelled", icon: FiXCircle },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      low: { label: "Basse", class: "low", icon: FiClock },
      normal: { label: "Normale", class: "normal", icon: FiPackage },
      high: { label: "Haute", class: "high", icon: FiAlertTriangle },
      urgent: { label: "Urgente", class: "urgent", icon: FiAlertCircle },
    };
    return priorityMap[priority] || priorityMap.normal;
  };

  const getPartnershipLabel = (type) => {
    const labels = {
      revendeur: "Revendeur",
      depot_vente: "Dépôt-vente",
    };
    return labels[type] || type;
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
  const pendingCount = stats?.pending || 0;
  const urgentCount = stats?.urgent || 0;

  const totalPages = requestsData?.totalPages || 1;
  const totalRequests = requestsData?.total || 0;

  return (
    <div className="reappro-list">
      {/* Header */}
      <div className="reappro-list__header">
        <div className="reappro-list__header-top">
          <div>
            <h1>Demandes de Réapprovisionnement</h1>
            <p>Gérez les demandes de réappro des professionnels</p>
          </div>
          <div className="reappro-list__header-actions">
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
      <div className="reappro-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiPackage />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.total || 0}</span>
            <span className="quick-stat__label">Total demandes</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{pendingCount}</span>
            <span className="quick-stat__label">En attente</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--urgent">
          <div className="quick-stat__icon quick-stat__icon--danger">
            <FiAlertCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{urgentCount}</span>
            <span className="quick-stat__label">Urgentes</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiCheckCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.byStatus?.find((s) => s._id === "completed")?.count || 0}
            </span>
            <span className="quick-stat__label">Terminées</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="reappro-list__filters">
        <div className="reappro-list__search">
          <FiSearch className="reappro-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par n° demande, client..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="reappro-list__filter-row">
          <div className="reappro-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvée</option>
              <option value="partial">Partielle</option>
              <option value="processing">En cours</option>
              <option value="ready">Prête</option>
              <option value="completed">Terminée</option>
              <option value="rejected">Rejetée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div className="reappro-list__filter-group">
            <label>Priorité</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Toutes</option>
              <option value="low">Basse</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div className="reappro-list__filter-actions">
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
        <div className="reappro-list__container">
          <div className="reappro-list__loader">
            <FiRefreshCw />
            <span>Chargement des demandes...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="reappro-list__container">
          <div className="reappro-list__empty">
            <FiAlertCircle className="reappro-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les demandes.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="reappro-list__container">
          <div className="reappro-list__empty">
            <FiPackage className="reappro-list__empty-icon" />
            <h3>Aucune demande trouvée</h3>
            <p>Aucune demande ne correspond à vos critères.</p>
            {(keyword || statusFilter || priorityFilter) && (
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
          <div className="reappro-list__container">
            <table className="reappro-list__table">
              <thead>
                <tr>
                  <th>N° Demande</th>
                  <th>Client</th>
                  <th>Articles</th>
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const statusInfo = getStatusInfo(request.status);
                  const StatusIcon = statusInfo.icon;
                  const priorityInfo = getPriorityInfo(request.priority);

                  return (
                    <tr key={request._id}>
                      <td>
                        <div className="request-number-cell">
                          <span className="request-number-cell__number">
                            {request.requestNumber}
                          </span>
                          <span className="request-number-cell__type">
                            {getPartnershipLabel(request.partnershipType)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <span className="client-cell__name">
                            {request.user?.name || "-"}
                          </span>
                          <span className="client-cell__email">
                            {request.user?.email || "-"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="items-cell">
                          <span className="items-cell__count">
                            {request.items?.length || 0} produit(s)
                          </span>
                          <span className="items-cell__qty">
                            {request.items?.reduce(
                              (acc, item) => acc + item.requestedQuantity,
                              0,
                            ) || 0}{" "}
                            unités
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`priority-badge priority-badge--${priorityInfo.class}`}
                        >
                          {priorityInfo.label}
                        </span>
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
                          {formatDate(request.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleOpenView(request)}
                            title="Voir les détails"
                          >
                            <FiEye />
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                className="action-btn action-btn--approve"
                                onClick={() => handleOpenApprove(request)}
                                title="Approuver"
                              >
                                <FiCheck />
                              </button>
                              <button
                                className="action-btn action-btn--reject"
                                onClick={() => handleOpenReject(request)}
                                title="Rejeter"
                              >
                                <FiX />
                              </button>
                            </>
                          )}
                          {(request.status === "approved" ||
                            request.status === "partial") && (
                            <button
                              className="action-btn action-btn--convert"
                              onClick={() => handleConvertToOrder(request._id)}
                              title="Convertir en commande"
                              disabled={isConverting}
                            >
                              <FiShoppingCart />
                            </button>
                          )}
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() =>
                              setDeleteModal({ open: true, request })
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
              <div className="reappro-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({totalRequests} demandes)
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
          <div className="reappro-list__mobile-cards">
            {filteredRequests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;
              const priorityInfo = getPriorityInfo(request.priority);

              return (
                <div key={request._id} className="reappro-card">
                  <div className="reappro-card__header">
                    <div className="reappro-card__number">
                      <h3>{request.requestNumber}</h3>
                      <span
                        className={`priority-badge priority-badge--${priorityInfo.class}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="reappro-card__body">
                    <div className="reappro-card__info">
                      <FiUser />
                      <span>{request.user?.name || "-"}</span>
                    </div>
                    <div className="reappro-card__info">
                      <FiPackage />
                      <span>
                        {request.items?.length || 0} produit(s) -
                        {request.items?.reduce(
                          (acc, item) => acc + item.requestedQuantity,
                          0,
                        ) || 0}{" "}
                        unités
                      </span>
                    </div>
                    <div className="reappro-card__info">
                      <FiTruck />
                      <span>
                        {getPartnershipLabel(request.partnershipType)}
                      </span>
                    </div>
                    <div className="reappro-card__info">
                      <FiCalendar />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  <div className="reappro-card__actions">
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenView(request)}
                    >
                      <FiEye /> Détails
                    </button>
                    {request.status === "pending" && (
                      <>
                        <button
                          className="btn btn--success btn--sm"
                          onClick={() => handleOpenApprove(request)}
                        >
                          <FiCheck /> Approuver
                        </button>
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => handleOpenReject(request)}
                        >
                          <FiX /> Rejeter
                        </button>
                      </>
                    )}
                    {(request.status === "approved" ||
                      request.status === "partial") && (
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => handleConvertToOrder(request._id)}
                        disabled={isConverting}
                      >
                        <FiShoppingCart /> Convertir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="reappro-list__pagination">
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
      {viewModal.open && viewModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setViewModal({ open: false, request: null })}
        >
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                Demande {viewModal.request.requestNumber}
              </h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, request: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="reappro-detail">
                {/* Header avec statuts */}
                <div className="reappro-detail__header">
                  <div className="reappro-detail__header-info">
                    <span className="reappro-detail__type">
                      {getPartnershipLabel(viewModal.request.partnershipType)}
                    </span>
                    <span
                      className={`priority-badge priority-badge--${getPriorityInfo(viewModal.request.priority).class}`}
                    >
                      Priorité:{" "}
                      {getPriorityInfo(viewModal.request.priority).label}
                    </span>
                  </div>
                  <div className="reappro-detail__header-badges">
                    {(() => {
                      const statusInfo = getStatusInfo(
                        viewModal.request.status,
                      );
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
                  </div>
                </div>

                {/* Client */}
                <div className="reappro-detail__section">
                  <h4 className="reappro-detail__section-title">
                    <FiUser /> Client
                  </h4>
                  <div className="reappro-detail__grid">
                    <div className="reappro-detail__item">
                      <span className="reappro-detail__item-label">Nom</span>
                      <span className="reappro-detail__item-value">
                        {viewModal.request.user?.name || "-"}
                      </span>
                    </div>
                    <div className="reappro-detail__item">
                      <span className="reappro-detail__item-label">Email</span>
                      <span className="reappro-detail__item-value">
                        {viewModal.request.user?.email || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Articles demandés */}
                <div className="reappro-detail__section">
                  <h4 className="reappro-detail__section-title">
                    <FiPackage /> Articles demandés (
                    {viewModal.request.items?.length || 0})
                  </h4>
                  <div className="reappro-detail__items">
                    {viewModal.request.items?.map((item, index) => (
                      <div key={index} className="reappro-item">
                        <div className="reappro-item__image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className="reappro-item__info">
                          <span className="reappro-item__name">
                            {item.name}
                          </span>
                          <span className="reappro-item__stock">
                            Stock actuel: {item.currentStock}
                          </span>
                        </div>
                        <div className="reappro-item__quantities">
                          <div className="reappro-item__qty">
                            <span className="reappro-item__qty-label">
                              Demandé
                            </span>
                            <span className="reappro-item__qty-value">
                              {item.requestedQuantity}
                            </span>
                          </div>
                          {item.approvedQuantity > 0 && (
                            <div className="reappro-item__qty reappro-item__qty--approved">
                              <span className="reappro-item__qty-label">
                                Approuvé
                              </span>
                              <span className="reappro-item__qty-value">
                                {item.approvedQuantity}
                              </span>
                            </div>
                          )}
                        </div>
                        {item.notes && (
                          <div className="reappro-item__notes">
                            <FiMessageSquare />
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Livraison */}
                <div className="reappro-detail__section">
                  <h4 className="reappro-detail__section-title">
                    <FiTruck /> Livraison
                  </h4>
                  <div className="reappro-detail__grid">
                    <div className="reappro-detail__item">
                      <span className="reappro-detail__item-label">Mode</span>
                      <span className="reappro-detail__item-value">
                        {viewModal.request.deliveryMethod === "pickup"
                          ? "Retrait sur place"
                          : "Livraison"}
                      </span>
                    </div>
                    {viewModal.request.requestedDeliveryDate && (
                      <div className="reappro-detail__item">
                        <span className="reappro-detail__item-label">
                          Date souhaitée
                        </span>
                        <span className="reappro-detail__item-value">
                          {formatDate(viewModal.request.requestedDeliveryDate)}
                        </span>
                      </div>
                    )}
                    {viewModal.request.estimatedDeliveryDate && (
                      <div className="reappro-detail__item">
                        <span className="reappro-detail__item-label">
                          Date estimée
                        </span>
                        <span className="reappro-detail__item-value">
                          {formatDate(viewModal.request.estimatedDeliveryDate)}
                        </span>
                      </div>
                    )}
                  </div>
                  {!viewModal.request.deliveryAddress?.useDefault &&
                    viewModal.request.deliveryAddress && (
                      <div className="reappro-detail__address">
                        <p>
                          <strong>
                            {viewModal.request.deliveryAddress.companyName}
                          </strong>
                          <br />
                          {viewModal.request.deliveryAddress.contactName}
                          <br />
                          {viewModal.request.deliveryAddress.street}
                          <br />
                          {viewModal.request.deliveryAddress.postalCode}{" "}
                          {viewModal.request.deliveryAddress.city}
                          <br />
                          {viewModal.request.deliveryAddress.country}
                        </p>
                      </div>
                    )}
                </div>

                {/* Dates */}
                <div className="reappro-detail__section">
                  <h4 className="reappro-detail__section-title">
                    <FiCalendar /> Historique
                  </h4>
                  <div className="reappro-detail__grid">
                    <div className="reappro-detail__item">
                      <span className="reappro-detail__item-label">
                        Créée le
                      </span>
                      <span className="reappro-detail__item-value">
                        {formatDateTime(viewModal.request.createdAt)}
                      </span>
                    </div>
                    {viewModal.request.processedAt && (
                      <div className="reappro-detail__item">
                        <span className="reappro-detail__item-label">
                          Traitée le
                        </span>
                        <span className="reappro-detail__item-value">
                          {formatDateTime(viewModal.request.processedAt)}
                        </span>
                      </div>
                    )}
                    {viewModal.request.processedBy && (
                      <div className="reappro-detail__item">
                        <span className="reappro-detail__item-label">
                          Traitée par
                        </span>
                        <span className="reappro-detail__item-value">
                          {viewModal.request.processedBy.name || "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Raison du rejet */}
                {viewModal.request.status === "rejected" &&
                  viewModal.request.rejectionReason && (
                    <div className="reappro-detail__section reappro-detail__section--danger">
                      <h4 className="reappro-detail__section-title">
                        <FiXCircle /> Raison du refus
                      </h4>
                      <p className="reappro-detail__rejection">
                        {viewModal.request.rejectionReason}
                      </p>
                    </div>
                  )}

                {/* Notes */}
                {(viewModal.request.customerNotes ||
                  viewModal.request.internalNotes) && (
                  <div className="reappro-detail__section">
                    <h4 className="reappro-detail__section-title">
                      <FiMessageSquare /> Notes
                    </h4>
                    {viewModal.request.customerNotes && (
                      <div className="reappro-detail__note">
                        <span className="reappro-detail__note-label">
                          Note client:
                        </span>
                        <p>{viewModal.request.customerNotes}</p>
                      </div>
                    )}
                    {viewModal.request.internalNotes && (
                      <div className="reappro-detail__note reappro-detail__note--internal">
                        <span className="reappro-detail__note-label">
                          Notes internes:
                        </span>
                        <p>{viewModal.request.internalNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Commande générée */}
                {viewModal.request.generatedOrder && (
                  <div className="reappro-detail__section reappro-detail__section--success">
                    <h4 className="reappro-detail__section-title">
                      <FiShoppingCart /> Commande Pro générée
                    </h4>
                    <p>Cette demande a été convertie en commande Pro.</p>
                  </div>
                )}

                {/* Historique des modifications */}
                {viewModal.request.history &&
                  viewModal.request.history.length > 0 && (
                    <div className="reappro-detail__section">
                      <h4 className="reappro-detail__section-title">
                        <FiClock /> Historique des modifications
                      </h4>
                      <div className="reappro-detail__history">
                        {viewModal.request.history
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
                onClick={() => setViewModal({ open: false, request: null })}
              >
                Fermer
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, request: null });
                  handleOpenNotesModal(viewModal.request);
                }}
              >
                <FiMessageSquare /> Notes
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, request: null });
                  handleOpenStatusModal(viewModal.request);
                }}
              >
                <FiEdit /> Statut
              </button>
              {viewModal.request.status === "pending" && (
                <>
                  <button
                    className="btn btn--danger"
                    onClick={() => {
                      setViewModal({ open: false, request: null });
                      handleOpenReject(viewModal.request);
                    }}
                  >
                    <FiX /> Rejeter
                  </button>
                  <button
                    className="btn btn--success"
                    onClick={() => {
                      setViewModal({ open: false, request: null });
                      handleOpenApprove(viewModal.request);
                    }}
                  >
                    <FiCheck /> Approuver
                  </button>
                </>
              )}
              {(viewModal.request.status === "approved" ||
                viewModal.request.status === "partial") && (
                <button
                  className="btn btn--primary"
                  onClick={() => handleConvertToOrder(viewModal.request._id)}
                  disabled={isConverting}
                >
                  <FiShoppingCart /> Convertir en commande
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Approbation */}
      {approveModal.open && approveModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setApproveModal({ open: false, request: null })}
        >
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Approuver la demande</h3>
              <button
                className="modal__close"
                onClick={() => setApproveModal({ open: false, request: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Demande <strong>{approveModal.request.requestNumber}</strong> de{" "}
                <strong>{approveModal.request.user?.name}</strong>
              </p>

              <div className="approve-items">
                <h4>Quantités à approuver</h4>
                {approvedItems.map((item) => (
                  <div key={item.product} className="approve-item">
                    <div className="approve-item__info">
                      <span className="approve-item__name">{item.name}</span>
                      <span className="approve-item__requested">
                        Demandé: {item.requestedQuantity}
                      </span>
                    </div>
                    <div className="approve-item__input">
                      <label>Approuvé:</label>
                      <input
                        type="number"
                        value={item.approvedQuantity}
                        onChange={(e) =>
                          handleApprovedQtyChange(item.product, e.target.value)
                        }
                        min="0"
                        max={item.requestedQuantity}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Date de livraison estimée (optionnel)</label>
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Note (optionnel)</label>
                <textarea
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  rows="3"
                  placeholder="Ajouter une note..."
                ></textarea>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setApproveModal({ open: false, request: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--success"
                onClick={handleApprove}
                disabled={isApproving}
              >
                {isApproving ? "Approbation..." : "Approuver"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {rejectModal.open && rejectModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setRejectModal({ open: false, request: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiXCircle />
              </div>
              <h3 className="modal__title">Rejeter la demande</h3>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Vous allez rejeter la demande{" "}
                <strong>{rejectModal.request.requestNumber}</strong>.
              </p>

              <div className="form-group">
                <label>
                  Raison du refus <span className="required">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  placeholder="Expliquez la raison du refus..."
                ></textarea>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setRejectModal({ open: false, request: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleReject}
                disabled={isRejecting}
              >
                {isRejecting ? "Rejet en cours..." : "Rejeter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changement Statut */}
      {statusModal.open && statusModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModal({ open: false, request: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Modifier le statut</h3>
              <button
                className="modal__close"
                onClick={() => setStatusModal({ open: false, request: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Demande <strong>{statusModal.request.requestNumber}</strong>
              </p>

              <div className="form-group">
                <label>Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="draft">Brouillon</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvée</option>
                  <option value="partial">Partiellement approuvée</option>
                  <option value="processing">En cours</option>
                  <option value="ready">Prête</option>
                  <option value="completed">Terminée</option>
                  <option value="rejected">Rejetée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note (optionnel)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows="3"
                  placeholder="Ajouter une note sur ce changement..."
                ></textarea>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setStatusModal({ open: false, request: null })}
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

      {/* Modal Notes */}
      {notesModal.open && notesModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setNotesModal({ open: false, request: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Notes internes</h3>
              <button
                className="modal__close"
                onClick={() => setNotesModal({ open: false, request: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Demande <strong>{notesModal.request.requestNumber}</strong>
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
                onClick={() => setNotesModal({ open: false, request: null })}
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
      {deleteModal.open && deleteModal.request && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, request: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer la demande</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer la demande{" "}
                <strong>"{deleteModal.request.requestNumber}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, request: null })}
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

export default AdminReapproRequestListScreen;
