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
  FiMail,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUserCheck,
  FiX,
  FiCalendar,
  FiTag,
  FiDownload,
  FiUsers,
  FiTrendingUp,
  FiUserX,
  FiGlobe,
  FiPlus,
  FiCheck,
} from "react-icons/fi";
import {
  useGetProspectsQuery,
  useGetProspectStatsQuery,
  useUpdateProspectMutation,
  useDeleteProspectMutation,
  useBulkDeleteProspectsMutation,
  useMarkProspectAsConvertedMutation,
  useBulkAddTagsToProspectsMutation,
  useLazyExportProspectsQuery,
} from "../../../slices/prospectApiSlice";
import { toast } from "react-toastify";
import "./AdminProspectListScreen.css";

const AdminProspectListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [sourceFilter, setSourceFilter] = useState(
    searchParams.get("source") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 20;

  // États de sélection
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, prospect: null });
  const [editModal, setEditModal] = useState({ open: false, prospect: null });
  const [convertModal, setConvertModal] = useState({
    open: false,
    prospect: null,
  });
  const [tagsModal, setTagsModal] = useState({ open: false });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    prospect: null,
  });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ open: false });

  // États des formulaires
  const [editStatus, setEditStatus] = useState("");
  const [editTags, setEditTags] = useState("");
  const [convertUserId, setConvertUserId] = useState("");
  const [bulkTags, setBulkTags] = useState("");

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {
      page,
      limit: pageSize,
      sortBy: "subscribedAt",
      sortOrder: "desc",
    };

    if (statusFilter) params.status = statusFilter;
    if (sourceFilter) params.source = sourceFilter;
    if (keyword) params.email = keyword;

    return params;
  };

  // Queries
  const {
    data: prospectsData,
    isLoading,
    isError,
    refetch,
  } = useGetProspectsQuery(buildQueryParams());

  const { data: stats } = useGetProspectStatsQuery();

  // Mutations
  const [updateProspect, { isLoading: isUpdating }] =
    useUpdateProspectMutation();
  const [deleteProspect, { isLoading: isDeleting }] =
    useDeleteProspectMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeleteProspectsMutation();
  const [markAsConverted, { isLoading: isConverting }] =
    useMarkProspectAsConvertedMutation();
  const [bulkAddTags, { isLoading: isAddingTags }] =
    useBulkAddTagsToProspectsMutation();
  const [triggerExport, { isLoading: isExporting }] =
    useLazyExportProspectsQuery();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (sourceFilter) params.set("source", sourceFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [keyword, statusFilter, sourceFilter, page, setSearchParams]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
    setSelectAll(false);
  }, [keyword, statusFilter, sourceFilter]);

  // Gérer la sélection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      const allIds = prospectsData?.prospects?.map((p) => p._id) || [];
      setSelectedIds(allIds);
      setSelectAll(true);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
      setSelectAll(false);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setSourceFilter("");
    setPage(1);
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleOpenView = (prospect) => {
    setViewModal({ open: true, prospect });
  };

  const handleOpenEdit = (prospect) => {
    setEditStatus(prospect.status);
    setEditTags(prospect.tags?.join(", ") || "");
    setEditModal({ open: true, prospect });
  };

  const handleOpenConvert = (prospect) => {
    setConvertUserId("");
    setConvertModal({ open: true, prospect });
  };

  const handleOpenTagsModal = () => {
    setBulkTags("");
    setTagsModal({ open: true });
  };

  // Modifier un prospect
  const handleUpdate = async () => {
    if (!editModal.prospect) return;

    const tagsArray = editTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    try {
      await updateProspect({
        id: editModal.prospect._id,
        status: editStatus,
        tags: tagsArray,
      }).unwrap();

      toast.success("Prospect mis à jour");
      setEditModal({ open: false, prospect: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Marquer comme converti
  const handleConvert = async () => {
    if (!convertModal.prospect) return;

    try {
      await markAsConverted({
        id: convertModal.prospect._id,
        userId: convertUserId || null,
      }).unwrap();

      toast.success("Prospect marqué comme converti");
      setConvertModal({ open: false, prospect: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Ajouter des tags en masse
  const handleBulkAddTags = async () => {
    if (selectedIds.length === 0) return;

    const tagsArray = bulkTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    if (tagsArray.length === 0) {
      toast.error("Veuillez entrer au moins un tag");
      return;
    }

    try {
      await bulkAddTags({
        ids: selectedIds,
        tags: tagsArray,
      }).unwrap();

      toast.success(`Tags ajoutés à ${selectedIds.length} prospect(s)`);
      setTagsModal({ open: false });
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Supprimer un prospect
  const handleDelete = async () => {
    if (!deleteModal.prospect) return;

    try {
      await deleteProspect(deleteModal.prospect._id).unwrap();
      toast.success("Prospect supprimé");
      setDeleteModal({ open: false, prospect: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Suppression en masse
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      await bulkDelete(selectedIds).unwrap();
      toast.success(`${selectedIds.length} prospect(s) supprimé(s)`);
      setBulkDeleteModal({ open: false });
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Export CSV
  const handleExport = async () => {
    try {
      const result = await triggerExport({
        status: statusFilter || undefined,
        source: sourceFilter || undefined,
      }).unwrap();

      // Créer et télécharger le fichier CSV
      const blob = new Blob([result], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prospects-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Export réussi");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'export");
    }
  };

  // Helpers
  const getStatusInfo = (status) => {
    const statusMap = {
      active: { label: "Actif", class: "active", icon: FiCheckCircle },
      unsubscribed: {
        label: "Désabonné",
        class: "unsubscribed",
        icon: FiUserX,
      },
      bounced: { label: "Email invalide", class: "bounced", icon: FiXCircle },
      converted: { label: "Converti", class: "converted", icon: FiUserCheck },
    };
    return statusMap[status] || statusMap.active;
  };

  const getSourceLabel = (source) => {
    const labels = {
      landing_page: "Page d'accueil",
      footer: "Footer",
      popup: "Pop-up",
      checkout: "Commande",
      import: "Import",
      manual: "Manuel",
    };
    return labels[source] || source;
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

  const prospects = prospectsData?.prospects || [];
  const totalPages = prospectsData?.totalPages || 1;
  const totalProspects = prospectsData?.total || 0;

  return (
    <div className="prospect-list">
      {/* Header */}
      <div className="prospect-list__header">
        <div className="prospect-list__header-top">
          <div>
            <h1>Prospects</h1>
            <p>Gérez vos abonnés newsletter et prospects</p>
          </div>
          <div className="prospect-list__header-actions">
            <button
              className="btn btn--outline"
              onClick={handleExport}
              disabled={isExporting}
              title="Exporter en CSV"
            >
              <FiDownload />
              {isExporting ? "Export..." : "Exporter"}
            </button>
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
      <div className="prospect-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiUsers />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.total || 0}</span>
            <span className="quick-stat__label">Total prospects</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiMail />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.active || 0}</span>
            <span className="quick-stat__label">Actifs</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiUserX />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.unsubscribed || 0}
            </span>
            <span className="quick-stat__label">Désabonnés</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--info">
            <FiUserCheck />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.converted || 0}</span>
            <span className="quick-stat__label">Convertis</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--secondary">
            <FiTrendingUp />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.recentSubscriptions || 0}
            </span>
            <span className="quick-stat__label">30 derniers jours</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="prospect-list__filters">
        <div className="prospect-list__search">
          <FiSearch className="prospect-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="prospect-list__filter-row">
          <div className="prospect-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="unsubscribed">Désabonné</option>
              <option value="bounced">Email invalide</option>
              <option value="converted">Converti</option>
            </select>
          </div>

          <div className="prospect-list__filter-group">
            <label>Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">Toutes les sources</option>
              <option value="landing_page">Page d'accueil</option>
              <option value="footer">Footer</option>
              <option value="popup">Pop-up</option>
              <option value="checkout">Commande</option>
              <option value="import">Import</option>
              <option value="manual">Manuel</option>
            </select>
          </div>
        </div>

        <div className="prospect-list__filter-actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Actions en masse */}
      {selectedIds.length > 0 && (
        <div className="prospect-list__bulk-actions">
          <span className="bulk-actions__count">
            {selectedIds.length} sélectionné(s)
          </span>
          <div className="bulk-actions__buttons">
            <button
              className="btn btn--outline btn--sm"
              onClick={handleOpenTagsModal}
            >
              <FiTag /> Ajouter tags
            </button>
            <button
              className="btn btn--danger btn--sm"
              onClick={() => setBulkDeleteModal({ open: true })}
            >
              <FiTrash2 /> Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Contenu */}
      {isLoading ? (
        <div className="prospect-list__container">
          <div className="prospect-list__loader">
            <FiRefreshCw />
            <span>Chargement des prospects...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="prospect-list__container">
          <div className="prospect-list__empty">
            <FiAlertCircle className="prospect-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les prospects.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : prospects.length === 0 ? (
        <div className="prospect-list__container">
          <div className="prospect-list__empty">
            <FiMail className="prospect-list__empty-icon" />
            <h3>Aucun prospect trouvé</h3>
            <p>Aucun prospect ne correspond à vos critères.</p>
            {(keyword || statusFilter || sourceFilter) && (
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
          <div className="prospect-list__container">
            <table className="prospect-list__table">
              <thead>
                <tr>
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Source</th>
                  <th>Tags</th>
                  <th>Inscrit le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map((prospect) => {
                  const statusInfo = getStatusInfo(prospect.status);
                  const StatusIcon = statusInfo.icon;
                  const isSelected = selectedIds.includes(prospect._id);

                  return (
                    <tr
                      key={prospect._id}
                      className={isSelected ? "tr--selected" : ""}
                    >
                      <td className="td-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(prospect._id)}
                        />
                      </td>
                      <td>
                        <div className="email-cell">
                          <span className="email-cell__email">
                            {prospect.email}
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
                        <span className="source-badge">
                          <FiGlobe />
                          {getSourceLabel(prospect.source)}
                        </span>
                      </td>
                      <td>
                        <div className="tags-cell">
                          {prospect.tags && prospect.tags.length > 0 ? (
                            prospect.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="tag">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="no-tags">-</span>
                          )}
                          {prospect.tags && prospect.tags.length > 3 && (
                            <span className="tags-more">
                              +{prospect.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="date-cell">
                          {formatDate(prospect.subscribedAt)}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleOpenView(prospect)}
                            title="Voir les détails"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--edit"
                            onClick={() => handleOpenEdit(prospect)}
                            title="Modifier"
                          >
                            <FiEdit />
                          </button>
                          {prospect.status === "active" && (
                            <button
                              className="action-btn action-btn--convert"
                              onClick={() => handleOpenConvert(prospect)}
                              title="Marquer comme converti"
                            >
                              <FiUserCheck />
                            </button>
                          )}
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() =>
                              setDeleteModal({ open: true, prospect })
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
              <div className="prospect-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({totalProspects} prospects)
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
          <div className="prospect-list__mobile-cards">
            {prospects.map((prospect) => {
              const statusInfo = getStatusInfo(prospect.status);
              const StatusIcon = statusInfo.icon;
              const isSelected = selectedIds.includes(prospect._id);

              return (
                <div
                  key={prospect._id}
                  className={`prospect-card ${isSelected ? "prospect-card--selected" : ""}`}
                >
                  <div className="prospect-card__header">
                    <div className="prospect-card__checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(prospect._id)}
                      />
                    </div>
                    <div className="prospect-card__email">
                      <FiMail />
                      <span>{prospect.email}</span>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="prospect-card__body">
                    <div className="prospect-card__info">
                      <FiGlobe />
                      <span>{getSourceLabel(prospect.source)}</span>
                    </div>
                    <div className="prospect-card__info">
                      <FiCalendar />
                      <span>{formatDate(prospect.subscribedAt)}</span>
                    </div>
                    {prospect.tags && prospect.tags.length > 0 && (
                      <div className="prospect-card__tags">
                        <FiTag />
                        <div className="tags-list">
                          {prospect.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">
                              {tag}
                            </span>
                          ))}
                          {prospect.tags.length > 3 && (
                            <span className="tags-more">
                              +{prospect.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="prospect-card__actions">
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenView(prospect)}
                    >
                      <FiEye /> Détails
                    </button>
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => handleOpenEdit(prospect)}
                    >
                      <FiEdit /> Modifier
                    </button>
                    {prospect.status === "active" && (
                      <button
                        className="btn btn--primary btn--sm"
                        onClick={() => handleOpenConvert(prospect)}
                      >
                        <FiUserCheck /> Convertir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="prospect-list__pagination">
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
      {viewModal.open && viewModal.prospect && (
        <div
          className="modal-overlay"
          onClick={() => setViewModal({ open: false, prospect: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Détail du prospect</h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, prospect: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="prospect-detail">
                {/* Email et statut */}
                <div className="prospect-detail__header">
                  <div className="prospect-detail__email">
                    <FiMail />
                    <span>{viewModal.prospect.email}</span>
                  </div>
                  {(() => {
                    const statusInfo = getStatusInfo(viewModal.prospect.status);
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

                {/* Infos */}
                <div className="prospect-detail__section">
                  <h4>Informations</h4>
                  <div className="prospect-detail__grid">
                    <div className="prospect-detail__item">
                      <span className="prospect-detail__item-label">
                        Source
                      </span>
                      <span className="prospect-detail__item-value">
                        {getSourceLabel(viewModal.prospect.source)}
                      </span>
                    </div>
                    <div className="prospect-detail__item">
                      <span className="prospect-detail__item-label">
                        Inscrit le
                      </span>
                      <span className="prospect-detail__item-value">
                        {formatDateTime(viewModal.prospect.subscribedAt)}
                      </span>
                    </div>
                    {viewModal.prospect.unsubscribedAt && (
                      <div className="prospect-detail__item">
                        <span className="prospect-detail__item-label">
                          Désabonné le
                        </span>
                        <span className="prospect-detail__item-value">
                          {formatDateTime(viewModal.prospect.unsubscribedAt)}
                        </span>
                      </div>
                    )}
                    {viewModal.prospect.convertedAt && (
                      <div className="prospect-detail__item">
                        <span className="prospect-detail__item-label">
                          Converti le
                        </span>
                        <span className="prospect-detail__item-value">
                          {formatDateTime(viewModal.prospect.convertedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="prospect-detail__section">
                  <h4>Tags</h4>
                  <div className="prospect-detail__tags">
                    {viewModal.prospect.tags &&
                    viewModal.prospect.tags.length > 0 ? (
                      viewModal.prospect.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="no-tags">Aucun tag</span>
                    )}
                  </div>
                </div>

                {/* Infos techniques */}
                <div className="prospect-detail__section">
                  <h4>Informations techniques</h4>
                  <div className="prospect-detail__grid">
                    {viewModal.prospect.ipAddress && (
                      <div className="prospect-detail__item">
                        <span className="prospect-detail__item-label">
                          Adresse IP
                        </span>
                        <span className="prospect-detail__item-value prospect-detail__item-value--mono">
                          {viewModal.prospect.ipAddress}
                        </span>
                      </div>
                    )}
                    {viewModal.prospect.userAgent && (
                      <div className="prospect-detail__item prospect-detail__item--full">
                        <span className="prospect-detail__item-label">
                          User Agent
                        </span>
                        <span className="prospect-detail__item-value prospect-detail__item-value--small">
                          {viewModal.prospect.userAgent}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Utilisateur converti */}
                {viewModal.prospect.convertedToUser && (
                  <div className="prospect-detail__section prospect-detail__section--success">
                    <h4>
                      <FiUserCheck /> Converti en client
                    </h4>
                    <p>Ce prospect a été converti en utilisateur enregistré.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setViewModal({ open: false, prospect: null })}
              >
                Fermer
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, prospect: null });
                  handleOpenEdit(viewModal.prospect);
                }}
              >
                <FiEdit /> Modifier
              </button>
              {viewModal.prospect.status === "active" && (
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    setViewModal({ open: false, prospect: null });
                    handleOpenConvert(viewModal.prospect);
                  }}
                >
                  <FiUserCheck /> Marquer converti
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {editModal.open && editModal.prospect && (
        <div
          className="modal-overlay"
          onClick={() => setEditModal({ open: false, prospect: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Modifier le prospect</h3>
              <button
                className="modal__close"
                onClick={() => setEditModal({ open: false, prospect: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                <strong>{editModal.prospect.email}</strong>
              </p>

              <div className="form-group">
                <label>Statut</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="active">Actif</option>
                  <option value="unsubscribed">Désabonné</option>
                  <option value="bounced">Email invalide</option>
                  <option value="converted">Converti</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Ex: vip, promo2024, nouméa"
                />
                <span className="form-help">
                  Entrez les tags séparés par des virgules
                </span>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setEditModal({ open: false, prospect: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Convertir */}
      {convertModal.open && convertModal.prospect && (
        <div
          className="modal-overlay"
          onClick={() => setConvertModal({ open: false, prospect: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--success">
                <FiUserCheck />
              </div>
              <h3 className="modal__title">Marquer comme converti</h3>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Marquer <strong>{convertModal.prospect.email}</strong> comme
                converti en client.
              </p>

              <div className="form-group">
                <label>ID Utilisateur (optionnel)</label>
                <input
                  type="text"
                  value={convertUserId}
                  onChange={(e) => setConvertUserId(e.target.value)}
                  placeholder="ID de l'utilisateur associé"
                />
                <span className="form-help">
                  Si le prospect s'est créé un compte, entrez l'ID de
                  l'utilisateur pour les lier.
                </span>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setConvertModal({ open: false, prospect: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--success"
                onClick={handleConvert}
                disabled={isConverting}
              >
                {isConverting ? "Conversion..." : "Marquer converti"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Tags en masse */}
      {tagsModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setTagsModal({ open: false })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Ajouter des tags</h3>
              <button
                className="modal__close"
                onClick={() => setTagsModal({ open: false })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Ajouter des tags à <strong>{selectedIds.length}</strong>{" "}
                prospect(s) sélectionné(s).
              </p>

              <div className="form-group">
                <label>
                  Tags à ajouter <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={bulkTags}
                  onChange={(e) => setBulkTags(e.target.value)}
                  placeholder="Ex: promo2024, vip"
                />
                <span className="form-help">
                  Entrez les tags séparés par des virgules
                </span>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setTagsModal({ open: false })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleBulkAddTags}
                disabled={isAddingTags || !bulkTags.trim()}
              >
                {isAddingTags ? "Ajout..." : "Ajouter les tags"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {deleteModal.open && deleteModal.prospect && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, prospect: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer le prospect</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer le prospect{" "}
                <strong>"{deleteModal.prospect.email}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, prospect: null })}
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

      {/* Modal Suppression en masse */}
      {bulkDeleteModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setBulkDeleteModal({ open: false })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer les prospects</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer{" "}
                <strong>{selectedIds.length} prospect(s)</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setBulkDeleteModal({ open: false })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting
                  ? "Suppression..."
                  : `Supprimer (${selectedIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProspectListScreen;
