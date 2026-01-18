import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetCampaignsQuery,
  useGetMailingStatsQuery,
  useDeleteCampaignMutation,
  useDuplicateCampaignMutation,
  useSendCampaignMutation,
  useCancelCampaignMutation,
} from "../../slices/mailingApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminMailingScreen.css";

const AdminMailingScreen = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "",
    template: "",
    page: 1,
    limit: 10,
  });

  // Queries
  const {
    data: campaignsData,
    isLoading,
    error,
    refetch,
  } = useGetCampaignsQuery(filters);
  const { data: stats } = useGetMailingStatsQuery();

  // Mutations
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [duplicateCampaign] = useDuplicateCampaignMutation();
  const [sendCampaign, { isLoading: isSending }] = useSendCampaignMutation();
  const [cancelCampaign] = useCancelCampaignMutation();

  const campaigns = campaignsData?.campaigns || [];
  const totalPages = campaignsData?.totalPages || 1;

  // Template labels et icônes
  const templateConfig = {
    promo: { label: "Promotion", icon: "🏷️", color: "#e53935" },
    nouveautes: { label: "Nouveautés", icon: "✨", color: "#2d6a4f" },
    destockage: { label: "Déstockage", icon: "🔥", color: "#f57c00" },
    evenement: { label: "Événement", icon: "🎉", color: "#7b1fa2" },
    newsletter: { label: "Newsletter", icon: "📬", color: "#1976d2" },
    custom: { label: "Personnalisé", icon: "💌", color: "#455a64" },
  };

  // Status labels
  const statusConfig = {
    draft: { label: "Brouillon", class: "draft" },
    scheduled: { label: "Programmée", class: "scheduled" },
    sending: { label: "En cours", class: "sending" },
    sent: { label: "Envoyée", class: "sent" },
    failed: { label: "Échouée", class: "failed" },
    cancelled: { label: "Annulée", class: "cancelled" },
  };

  // Handlers
  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer la campagne "${name}" ?`)) {
      try {
        await deleteCampaign(id).unwrap();
        toast.success("Campagne supprimée");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const result = await duplicateCampaign(id).unwrap();
      toast.success("Campagne dupliquée");
      navigate(`/admin/mailing/${result._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la duplication");
    }
  };

  const handleSend = async (campaign) => {
    const confirmMsg = `Envoyer la campagne "${campaign.name}" à tous les destinataires ?\n\nCette action est irréversible.`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const result = await sendCampaign(campaign._id).unwrap();
        toast.success(
          `Campagne envoyée ! ${result.stats.sent} email(s) envoyé(s)`
        );
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de l'envoi");
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Annuler cette campagne programmée ?")) {
      try {
        await cancelCampaign(id).unwrap();
        toast.success("Campagne annulée");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
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

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-mailing">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📧 Campagnes Mailing</h1>
          <p>Créez et envoyez des emails à vos clients et prospects</p>
        </div>
        <Link to="/admin/mailing/new" className="btn-new-campaign">
          ✉️ Nouvelle campagne
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalCampaigns || 0}</span>
            <span className="stat-label">Campagnes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.sentCampaigns || 0}</span>
            <span className="stat-label">Envoyées</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.draftCampaigns || 0}</span>
            <span className="stat-label">Brouillons</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalSent || 0}</span>
            <span className="stat-label">Emails envoyés</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">
              {stats?.potentialRecipients?.all || 0}
            </span>
            <span className="stat-label">Destinataires</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Statut</label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }))
            }
          >
            <option value="">Tous</option>
            <option value="draft">Brouillons</option>
            <option value="scheduled">Programmées</option>
            <option value="sent">Envoyées</option>
            <option value="failed">Échouées</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Template</label>
          <select
            value={filters.template}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, template: e.target.value, page: 1 }))
            }
          >
            <option value="">Tous</option>
            <option value="promo">🏷️ Promotion</option>
            <option value="nouveautes">✨ Nouveautés</option>
            <option value="destockage">🔥 Déstockage</option>
            <option value="evenement">🎉 Événement</option>
            <option value="newsletter">📬 Newsletter</option>
            <option value="custom">💌 Personnalisé</option>
          </select>
        </div>
        <button
          className="btn-reset-filters"
          onClick={() => setFilters({ status: "", template: "", page: 1, limit: 10 })}
        >
          Réinitialiser
        </button>
      </div>

      {/* Campaigns List */}
      <div className="campaigns-list">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="campaign-card">
              <div className="campaign-header">
                <div className="campaign-type">
                  <span
                    className="type-badge"
                    style={{
                      backgroundColor: templateConfig[campaign.template]?.color + "20",
                      color: templateConfig[campaign.template]?.color,
                    }}
                  >
                    {templateConfig[campaign.template]?.icon}{" "}
                    {templateConfig[campaign.template]?.label}
                  </span>
                  <span className={`status-badge ${statusConfig[campaign.status]?.class}`}>
                    {statusConfig[campaign.status]?.label}
                  </span>
                </div>
                <div className="campaign-date">
                  {campaign.status === "sent" ? (
                    <span>Envoyée le {formatDate(campaign.sentAt)}</span>
                  ) : (
                    <span>Créée le {formatDate(campaign.createdAt)}</span>
                  )}
                </div>
              </div>

              <div className="campaign-content">
                <h3>{campaign.name}</h3>
                <p className="campaign-subject">
                  <strong>Sujet:</strong> {campaign.subject}
                </p>
                {campaign.content?.headline && (
                  <p className="campaign-headline">{campaign.content.headline}</p>
                )}
              </div>

              {campaign.status === "sent" && (
                <div className="campaign-stats">
                  <div className="stat-item">
                    <span className="stat-number">{campaign.stats?.totalRecipients || 0}</span>
                    <span className="stat-text">Destinataires</span>
                  </div>
                  <div className="stat-item success">
                    <span className="stat-number">{campaign.stats?.sent || 0}</span>
                    <span className="stat-text">Envoyés</span>
                  </div>
                  <div className="stat-item error">
                    <span className="stat-number">{campaign.stats?.failed || 0}</span>
                    <span className="stat-text">Échoués</span>
                  </div>
                </div>
              )}

              <div className="campaign-actions">
                {campaign.status === "draft" && (
                  <>
                    <Link
                      to={`/admin/mailing/${campaign._id}/edit`}
                      className="action-btn edit"
                    >
                      ✏️ Modifier
                    </Link>
                    <button
                      onClick={() => handleSend(campaign)}
                      className="action-btn send"
                      disabled={isSending}
                    >
                      🚀 Envoyer
                    </button>
                  </>
                )}
                {campaign.status === "scheduled" && (
                  <button
                    onClick={() => handleCancel(campaign._id)}
                    className="action-btn cancel"
                  >
                    ❌ Annuler
                  </button>
                )}
                <Link
                  to={`/admin/mailing/${campaign._id}/preview`}
                  className="action-btn preview"
                >
                  👁️ Aperçu
                </Link>
                <button
                  onClick={() => handleDuplicate(campaign._id)}
                  className="action-btn duplicate"
                >
                  📋 Dupliquer
                </button>
                {campaign.status !== "sending" && (
                  <button
                    onClick={() => handleDelete(campaign._id, campaign.name)}
                    className="action-btn delete"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-campaigns">
            <div className="no-campaigns-icon">📭</div>
            <h3>Aucune campagne</h3>
            <p>Créez votre première campagne pour commencer à communiquer avec vos clients</p>
            <Link to="/admin/mailing/new" className="btn-create-first">
              ✉️ Créer ma première campagne
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            ← Précédent
          </button>
          <span>
            Page {filters.page} sur {totalPages}
          </span>
          <button
            disabled={filters.page === totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMailingScreen;
