import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetProspectsQuery,
  useGetProspectStatsQuery,
  useDeleteProspectMutation,
  useUpdateProspectMutation,
  useBulkDeleteProspectsMutation,
} from "../../slices/prospectApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminProspectsScreen.css";

const AdminProspectsScreen = () => {
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    page: 1,
    limit: 20,
  });
  const [selectedProspects, setSelectedProspects] = useState([]);
  const [editingProspect, setEditingProspect] = useState(null);
  const [editForm, setEditForm] = useState({
    email: "",
    status: "",
    tags: [],
  });

  // Queries
  const {
    data: prospectsData,
    isLoading,
    error,
    refetch,
  } = useGetProspectsQuery(filters);
  const { data: stats, refetch: refetchStats } = useGetProspectStatsQuery();

  // Mutations
  const [deleteProspect] = useDeleteProspectMutation();
  const [updateProspect] = useUpdateProspectMutation();
  const [bulkDeleteProspects] = useBulkDeleteProspectsMutation();

  const prospects = prospectsData?.prospects || prospectsData || [];
  const totalPages = prospectsData?.totalPages || 1;
  const total = prospectsData?.total || prospects.length;

  // Handlers
  const handleDelete = async (id, email) => {
    if (window.confirm(`Supprimer l'inscription de ${email} ?`)) {
      try {
        await deleteProspect(id).unwrap();
        toast.success("Inscription supprimée");
        refetch();
        refetchStats();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProspects.length === 0) {
      toast.warning("Sélectionnez au moins une inscription");
      return;
    }

    if (
      window.confirm(
        `Supprimer ${selectedProspects.length} inscription(s) sélectionnée(s) ?`,
      )
    ) {
      try {
        await bulkDeleteProspects(selectedProspects).unwrap();
        toast.success(
          `${selectedProspects.length} inscription(s) supprimée(s)`,
        );
        setSelectedProspects([]);
        refetch();
        refetchStats();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleEditClick = (prospect) => {
    setEditingProspect(prospect._id);
    setEditForm({
      email: prospect.email,
      status: prospect.status,
      tags: prospect.tags || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingProspect(null);
    setEditForm({ email: "", status: "", tags: [] });
  };

  const handleUpdateProspect = async (prospectId) => {
    try {
      await updateProspect({ id: prospectId, ...editForm }).unwrap();
      toast.success("Inscription mise à jour");
      setEditingProspect(null);
      refetch();
      refetchStats();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleToggleStatus = async (prospect) => {
    const newStatus = prospect.status === "active" ? "unsubscribed" : "active";
    try {
      await updateProspect({
        id: prospect._id,
        status: newStatus,
      }).unwrap();
      toast.success(
        newStatus === "active"
          ? "Inscription réactivée"
          : "Inscription désactivée",
      );
      refetch();
      refetchStats();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProspects(prospects.map((p) => p._id));
    } else {
      setSelectedProspects([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProspects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSourceLabel = (source) => {
    const sources = {
      landing_page: "Page d'accueil",
      footer: "Footer",
      popup: "Pop-up",
      checkout: "Commande",
      import: "Import",
      manual: "Manuel",
    };
    return sources[source] || source || "Inconnu";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: "Actif", class: "active" },
      unsubscribed: { label: "Désabonné", class: "unsubscribed" },
      bounced: { label: "Erreur", class: "bounced" },
      converted: { label: "Converti", class: "converted" },
    };
    const config = statusConfig[status] || { label: status, class: "default" };
    return (
      <span className={`status-badge ${config.class}`}>{config.label}</span>
    );
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-prospects">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📧 Gestion Newsletter</h1>
          <p>Gérez les inscriptions à la newsletter</p>
        </div>
        {selectedProspects.length > 0 && (
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            🗑️ Supprimer ({selectedProspects.length})
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.total || 0}</span>
            <span className="stat-label">Total inscrits</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.active || 0}</span>
            <span className="stat-label">Actifs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.unsubscribed || 0}</span>
            <span className="stat-label">Désabonnés</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.converted || 0}</span>
            <span className="stat-label">Convertis</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Statut</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Tous</option>
            <option value="active">Actifs</option>
            <option value="unsubscribed">Désabonnés</option>
            <option value="bounced">Erreur</option>
            <option value="converted">Convertis</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Source</label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange("source", e.target.value)}
          >
            <option value="">Toutes</option>
            <option value="landing_page">Page d'accueil</option>
            <option value="footer">Footer</option>
            <option value="popup">Pop-up</option>
            <option value="checkout">Commande</option>
          </select>
        </div>
        <button
          className="btn-reset-filters"
          onClick={() =>
            setFilters({ status: "", source: "", page: 1, limit: 20 })
          }
        >
          Réinitialiser
        </button>
      </div>

      {/* Table */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Liste des inscrits</h2>
          <span className="prospect-count">{total} inscription(s)</span>
        </div>
        <div className="card-content">
          {prospects.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="admin-table prospects-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedProspects.length === prospects.length &&
                            prospects.length > 0
                          }
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
                    {prospects.map((prospect) => (
                      <tr
                        key={prospect._id}
                        className={
                          selectedProspects.includes(prospect._id)
                            ? "selected"
                            : ""
                        }
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProspects.includes(prospect._id)}
                            onChange={() => handleSelectOne(prospect._id)}
                          />
                        </td>
                        <td>
                          {editingProspect === prospect._id ? (
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  email: e.target.value,
                                })
                              }
                              className="edit-input"
                            />
                          ) : (
                            <a
                              href={`mailto:${prospect.email}`}
                              className="prospect-email"
                            >
                              {prospect.email}
                            </a>
                          )}
                        </td>
                        <td>
                          {editingProspect === prospect._id ? (
                            <select
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  status: e.target.value,
                                })
                              }
                              className="edit-select"
                            >
                              <option value="active">Actif</option>
                              <option value="unsubscribed">Désabonné</option>
                              <option value="bounced">Erreur</option>
                              <option value="converted">Converti</option>
                            </select>
                          ) : (
                            getStatusBadge(prospect.status)
                          )}
                        </td>
                        <td>
                          <span className="source-badge">
                            {getSourceLabel(prospect.source)}
                          </span>
                        </td>
                        <td>
                          <div className="tags-cell">
                            {prospect.tags?.length > 0 ? (
                              prospect.tags.map((tag, i) => (
                                <span key={i} className="tag-badge">
                                  {tag}
                                </span>
                              ))
                            ) : (
                              <span className="no-tags">-</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {formatDate(
                            prospect.subscribedAt || prospect.createdAt,
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {editingProspect === prospect._id ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateProspect(prospect._id)
                                  }
                                  className="action-btn save"
                                  title="Enregistrer"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="action-btn cancel"
                                  title="Annuler"
                                >
                                  ✕
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(prospect)}
                                  className="action-btn edit"
                                  title="Modifier"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(prospect)}
                                  className={`action-btn toggle ${prospect.status === "active" ? "active" : ""}`}
                                  title={
                                    prospect.status === "active"
                                      ? "Désactiver"
                                      : "Réactiver"
                                  }
                                >
                                  {prospect.status === "active" ? "🚫" : "✅"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(prospect._id, prospect.email)
                                  }
                                  className="action-btn delete"
                                  title="Supprimer"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                  >
                    ← Précédent
                  </button>
                  <span>
                    Page {filters.page} sur {totalPages}
                  </span>
                  <button
                    disabled={filters.page === totalPages}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-data">
              <span className="no-data-icon">📭</span>
              <p>Aucune inscription à la newsletter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProspectsScreen;
