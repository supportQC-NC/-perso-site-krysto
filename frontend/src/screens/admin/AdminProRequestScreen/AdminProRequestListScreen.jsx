import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiTrash2,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
  FiMessageSquare,
  FiBriefcase,
  FiMapPin,
  FiMail,
  FiFileText,
  FiPercent,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import {
  useGetProRequestsQuery,
  useGetProRequestStatsQuery,
  useApproveProRequestMutation,
  useRejectProRequestMutation,
  useDeleteProRequestMutation,
} from "../../../slices/proRequestApiSlice";
import { toast } from "react-toastify";
import "./AdminProRequestListScreen.css";

const AdminProRequestListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [partnershipFilter, setPartnershipFilter] = useState(
    searchParams.get("partnership") || "",
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
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    request: null,
  });

  // États des formulaires
  const [discountRate, setDiscountRate] = useState(20);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (statusFilter) params.status = statusFilter;
    if (partnershipFilter) params.partnershipType = partnershipFilter;

    return params;
  };

  // Queries
  const {
    data: requestsData,
    isLoading,
    isError,
    refetch,
  } = useGetProRequestsQuery(buildQueryParams());

  const { data: stats } = useGetProRequestStatsQuery();

  // Mutations
  const [approveRequest, { isLoading: isApproving }] =
    useApproveProRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectProRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteProRequestMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (partnershipFilter) params.set("partnership", partnershipFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [keyword, statusFilter, partnershipFilter, page, setSearchParams]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, statusFilter, partnershipFilter]);

  // Filtrer côté client pour la recherche
  const getFilteredRequests = () => {
    if (!requestsData?.proRequests) return [];

    let filtered = requestsData.proRequests;

    if (keyword) {
      const search = keyword.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.companyName?.toLowerCase().includes(search) ||
          req.email?.toLowerCase().includes(search) ||
          req.firstName?.toLowerCase().includes(search) ||
          req.lastName?.toLowerCase().includes(search) ||
          req.ridetNumber?.toLowerCase().includes(search),
      );
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setPartnershipFilter("");
    setPage(1);
  };

  const handleOpenView = (request) => {
    setViewModal({ open: true, request });
  };

  const handleOpenApprove = (request) => {
    setDiscountRate(20);
    setAdminNotes("");
    setApproveModal({ open: true, request });
  };

  const handleOpenReject = (request) => {
    setRejectionReason("");
    setRejectModal({ open: true, request });
  };

  const handleApprove = async () => {
    if (!approveModal.request) return;

    try {
      await approveRequest({
        id: approveModal.request._id,
        discountRate: Number(discountRate) || 0,
        adminNotes,
      }).unwrap();

      toast.success("Demande approuvée ! L'utilisateur est maintenant Pro.");
      setApproveModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'approbation");
    }
  };

  const handleReject = async () => {
    if (!rejectModal.request) return;

    if (!rejectionReason.trim()) {
      toast.error("Veuillez indiquer une raison du refus");
      return;
    }

    try {
      await rejectRequest({
        id: rejectModal.request._id,
        rejectionReason,
      }).unwrap();

      toast.success("Demande rejetée. L'utilisateur a été notifié.");
      setRejectModal({ open: false, request: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors du rejet");
    }
  };

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
      pending: { label: "En attente", class: "pending", icon: FiClock },
      approved: { label: "Approuvée", class: "approved", icon: FiCheckCircle },
      rejected: { label: "Rejetée", class: "rejected", icon: FiXCircle },
      cancelled: { label: "Annulée", class: "cancelled", icon: FiX },
    };
    return statusMap[status] || statusMap.pending;
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

  const totalPages = requestsData?.totalPages || 1;
  const totalRequests = requestsData?.total || 0;

  return (
    <div className="pro-request-list">
      {/* Header */}
      <div className="pro-request-list__header">
        <div className="pro-request-list__header-top">
          <div>
            <h1>Demandes Pro</h1>
            <p>Gérez les demandes de compte professionnel</p>
          </div>
          <div className="pro-request-list__header-actions">
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
      <div className="pro-request-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiUsers />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.requests?.total || 0}
            </span>
            <span className="quick-stat__label">Total demandes</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.requests?.pending || 0}
            </span>
            <span className="quick-stat__label">En attente</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiCheckCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.requests?.approved || 0}
            </span>
            <span className="quick-stat__label">Approuvées</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--danger">
            <FiXCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.requests?.rejected || 0}
            </span>
            <span className="quick-stat__label">Rejetées</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="pro-request-list__filters">
        <div className="pro-request-list__search">
          <FiSearch className="pro-request-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par entreprise, email, nom, RIDET..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="pro-request-list__filter-row">
          <div className="pro-request-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>

          <div className="pro-request-list__filter-group">
            <label>Type de partenariat</label>
            <select
              value={partnershipFilter}
              onChange={(e) => setPartnershipFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="revendeur">Revendeur</option>
              <option value="depot_vente">Dépôt-vente</option>
            </select>
          </div>
        </div>

        <div className="pro-request-list__filter-actions">
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
        <div className="pro-request-list__container">
          <div className="pro-request-list__loader">
            <FiRefreshCw />
            <span>Chargement des demandes...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="pro-request-list__container">
          <div className="pro-request-list__empty">
            <FiAlertCircle className="pro-request-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les demandes.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="pro-request-list__container">
          <div className="pro-request-list__empty">
            <FiUsers className="pro-request-list__empty-icon" />
            <h3>Aucune demande trouvée</h3>
            <p>Aucune demande ne correspond à vos critères.</p>
            {(keyword || statusFilter || partnershipFilter) && (
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
          <div className="pro-request-list__container">
            <table className="pro-request-list__table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const statusInfo = getStatusInfo(request.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={request._id}>
                      <td>
                        <div className="company-cell">
                          <span className="company-cell__name">
                            {request.companyName}
                          </span>
                          <span className="company-cell__ridet">
                            RIDET: {request.ridetNumber}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span className="contact-cell__name">
                            {request.firstName} {request.lastName}
                          </span>
                          <span className="contact-cell__email">
                            {request.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="partnership-badge">
                          {getPartnershipLabel(request.partnershipType)}
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
              <div className="pro-request-list__pagination">
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
          <div className="pro-request-list__mobile-cards">
            {filteredRequests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={request._id} className="request-card">
                  <div className="request-card__header">
                    <div className="request-card__company">
                      <h3>{request.companyName}</h3>
                      <span className="request-card__ridet">
                        RIDET: {request.ridetNumber}
                      </span>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="request-card__body">
                    <div className="request-card__info">
                      <FiUser />
                      <span>
                        {request.firstName} {request.lastName}
                      </span>
                    </div>
                    <div className="request-card__info">
                      <FiMail />
                      <span>{request.email}</span>
                    </div>
                    <div className="request-card__info">
                      <FiBriefcase />
                      <span>
                        {getPartnershipLabel(request.partnershipType)}
                      </span>
                    </div>
                    <div className="request-card__info">
                      <FiCalendar />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  <div className="request-card__actions">
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
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="pro-request-list__pagination">
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
              <h3 className="modal__title">Détail de la demande</h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, request: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="request-detail">
                <div className="request-detail__header">
                  <div>
                    <h2>{viewModal.request.companyName}</h2>
                    <span className="request-detail__ridet">
                      RIDET: {viewModal.request.ridetNumber}
                    </span>
                  </div>
                  {(() => {
                    const statusInfo = getStatusInfo(viewModal.request.status);
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

                <div className="request-detail__section">
                  <h4 className="request-detail__section-title">
                    <FiBriefcase /> Informations entreprise
                  </h4>
                  <div className="request-detail__grid">
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">
                        Raison sociale
                      </span>
                      <span className="request-detail__item-value">
                        {viewModal.request.legalStatus || "-"}
                      </span>
                    </div>
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">
                        Type de partenariat
                      </span>
                      <span className="request-detail__item-value">
                        {getPartnershipLabel(viewModal.request.partnershipType)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="request-detail__section">
                  <h4 className="request-detail__section-title">
                    <FiUser /> Contact
                  </h4>
                  <div className="request-detail__grid">
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">
                        Nom complet
                      </span>
                      <span className="request-detail__item-value">
                        {viewModal.request.firstName}{" "}
                        {viewModal.request.lastName}
                      </span>
                    </div>
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">Email</span>
                      <span className="request-detail__item-value">
                        {viewModal.request.email}
                      </span>
                    </div>
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">
                        Téléphone
                      </span>
                      <span className="request-detail__item-value">
                        {viewModal.request.phone || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {viewModal.request.address && (
                  <div className="request-detail__section">
                    <h4 className="request-detail__section-title">
                      <FiMapPin /> Adresse
                    </h4>
                    <p className="request-detail__address">
                      {viewModal.request.address.street}
                      <br />
                      {viewModal.request.address.postalCode}{" "}
                      {viewModal.request.address.city}
                      <br />
                      {viewModal.request.address.country}
                    </p>
                  </div>
                )}

                {viewModal.request.message && (
                  <div className="request-detail__section">
                    <h4 className="request-detail__section-title">
                      <FiMessageSquare /> Message
                    </h4>
                    <p className="request-detail__message">
                      {viewModal.request.message}
                    </p>
                  </div>
                )}

                <div className="request-detail__section">
                  <h4 className="request-detail__section-title">
                    <FiCalendar /> Historique
                  </h4>
                  <div className="request-detail__grid">
                    <div className="request-detail__item">
                      <span className="request-detail__item-label">
                        Demande créée
                      </span>
                      <span className="request-detail__item-value">
                        {formatDateTime(viewModal.request.createdAt)}
                      </span>
                    </div>
                    {viewModal.request.processedAt && (
                      <div className="request-detail__item">
                        <span className="request-detail__item-label">
                          Traitée le
                        </span>
                        <span className="request-detail__item-value">
                          {formatDateTime(viewModal.request.processedAt)}
                        </span>
                      </div>
                    )}
                    {viewModal.request.processedBy && (
                      <div className="request-detail__item">
                        <span className="request-detail__item-label">
                          Traitée par
                        </span>
                        <span className="request-detail__item-value">
                          {viewModal.request.processedBy.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {viewModal.request.status === "rejected" &&
                  viewModal.request.rejectionReason && (
                    <div className="request-detail__section request-detail__section--danger">
                      <h4 className="request-detail__section-title">
                        <FiXCircle /> Raison du refus
                      </h4>
                      <p className="request-detail__rejection">
                        {viewModal.request.rejectionReason}
                      </p>
                    </div>
                  )}

                {viewModal.request.adminNotes && (
                  <div className="request-detail__section">
                    <h4 className="request-detail__section-title">
                      <FiFileText /> Notes admin
                    </h4>
                    <p className="request-detail__notes">
                      {viewModal.request.adminNotes}
                    </p>
                  </div>
                )}

                {viewModal.request.user && (
                  <div className="request-detail__section">
                    <h4 className="request-detail__section-title">
                      <FiUser /> Compte utilisateur
                    </h4>
                    <div className="request-detail__user">
                      <span>{viewModal.request.user.name}</span>
                      <span>{viewModal.request.user.email}</span>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--success">
                <FiCheckCircle />
              </div>
              <h3 className="modal__title">Approuver la demande</h3>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Vous allez approuver la demande de{" "}
                <strong>{approveModal.request.companyName}</strong>.
                <br />
                L'utilisateur{" "}
                <strong>
                  {approveModal.request.firstName}{" "}
                  {approveModal.request.lastName}
                </strong>{" "}
                deviendra un compte Pro.
              </p>

              <div className="form-group">
                <label>
                  <FiPercent style={{ marginRight: "8px" }} />
                  Taux de remise accordé (%)
                </label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  min="0"
                  max="100"
                  placeholder="Ex: 20"
                />
                <small className="form-help">
                  Remise sur le catalogue (entre 0 et 100%)
                </small>
              </div>

              <div className="form-group">
                <label>
                  <FiFileText style={{ marginRight: "8px" }} />
                  Notes admin (optionnel)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows="3"
                  placeholder="Notes internes visibles uniquement par les administrateurs..."
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
                Vous allez rejeter la demande de{" "}
                <strong>{rejectModal.request.companyName}</strong>.
                <br />
                L'utilisateur sera notifié par email.
              </p>

              <div className="form-group">
                <label>
                  Raison du refus <span className="required">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  placeholder="Expliquez la raison du refus (sera envoyée à l'utilisateur)..."
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
                Êtes-vous sûr de vouloir supprimer la demande de{" "}
                <strong>"{deleteModal.request.companyName}"</strong> ?
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

export default AdminProRequestListScreen;
