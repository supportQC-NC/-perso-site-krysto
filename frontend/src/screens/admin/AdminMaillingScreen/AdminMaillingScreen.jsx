import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSend,
  FiCopy,
  FiSearch,
  FiRefreshCw,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLayout,
  FiFileText,
  FiPlay,
  FiPause,
  FiTrendingUp,
  FiMousePointer,
  FiInbox,
} from "react-icons/fi";
import {
  useGetCampaignsQuery,
  useGetMailingStatsQuery,
  useDeleteCampaignMutation,
  useDuplicateCampaignMutation,
  useSendCampaignMutation,
  useSendTestEmailMutation,
  useCancelCampaignMutation,
} from "../../../slices/mailingApiSlice.js";
import {
  useGetDefaultMailingTemplatesQuery,
  useSeedDefaultTemplatesMutation,
} from "../../../slices/maillingTemplateApiSlice.js";
import { toast } from "react-toastify";
import "./AdminMaillingScreen.css";

const AdminMailingScreen = () => {
  const navigate = useNavigate();

  // États des filtres
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // États des modales
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    campaign: null,
  });
  const [sendModal, setSendModal] = useState({ open: false, campaign: null });
  const [testModal, setTestModal] = useState({ open: false, campaign: null });
  const [previewModal, setPreviewModal] = useState({
    open: false,
    campaign: null,
  });
  const [newCampaignModal, setNewCampaignModal] = useState({ open: false });

  // État pour l'email de test
  const [testEmail, setTestEmail] = useState("");

  // Queries
  const {
    data: campaignsData,
    isLoading,
    isError,
    refetch,
  } = useGetCampaignsQuery({
    page,
    limit: pageSize,
    status: statusFilter || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: stats } = useGetMailingStatsQuery();
  const { data: defaultTemplates, isLoading: isLoadingTemplates } =
    useGetDefaultMailingTemplatesQuery();

  // Mutations
  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteCampaignMutation();
  const [duplicateCampaign, { isLoading: isDuplicating }] =
    useDuplicateCampaignMutation();
  const [sendCampaign, { isLoading: isSending }] = useSendCampaignMutation();
  const [sendTestEmail, { isLoading: isSendingTest }] =
    useSendTestEmailMutation();
  const [cancelCampaign, { isLoading: isCancelling }] =
    useCancelCampaignMutation();
  const [seedTemplates, { isLoading: isSeeding }] =
    useSeedDefaultTemplatesMutation();

  // Handlers
  const handleDelete = async () => {
    if (!deleteModal.campaign) return;
    try {
      await deleteCampaign(deleteModal.campaign._id).unwrap();
      toast.success("Campagne supprimée");
      setDeleteModal({ open: false, campaign: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (campaign) => {
    try {
      await duplicateCampaign(campaign._id).unwrap();
      toast.success("Campagne dupliquée");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la duplication");
    }
  };

  const handleSend = async () => {
    if (!sendModal.campaign) return;
    try {
      const result = await sendCampaign(sendModal.campaign._id).unwrap();
      toast.success(`Campagne envoyée ! ${result.stats.sent} emails envoyés`);
      setSendModal({ open: false, campaign: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi");
    }
  };

  const handleSendTest = async () => {
    if (!testModal.campaign || !testEmail) return;
    try {
      await sendTestEmail({
        id: testModal.campaign._id,
        email: testEmail,
      }).unwrap();
      toast.success(`Email de test envoyé à ${testEmail}`);
      setTestModal({ open: false, campaign: null });
      setTestEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi");
    }
  };

  const handleCancel = async (campaign) => {
    try {
      await cancelCampaign(campaign._id).unwrap();
      toast.success("Campagne annulée");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const handleSeedTemplates = async () => {
    try {
      const result = await seedTemplates().unwrap();
      toast.success(result.message);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'initialisation");
    }
  };

  const handleCreateFromTemplate = (template) => {
    // Naviguer vers l'éditeur avec le template sélectionné
    navigate(`/admin/mailing/editor?template=${template._id}`);
    setNewCampaignModal({ open: false });
  };

  const handleCreateBlank = () => {
    navigate("/admin/mailing/editor");
    setNewCampaignModal({ open: false });
  };

  // Helpers
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: {
        label: "Brouillon",
        icon: FiEdit,
        className: "status-badge--draft",
      },
      scheduled: {
        label: "Programmée",
        icon: FiClock,
        className: "status-badge--scheduled",
      },
      sending: {
        label: "En cours",
        icon: FiSend,
        className: "status-badge--sending",
      },
      sent: {
        label: "Envoyée",
        icon: FiCheckCircle,
        className: "status-badge--sent",
      },
      failed: {
        label: "Échouée",
        icon: FiAlertCircle,
        className: "status-badge--failed",
      },
      cancelled: {
        label: "Annulée",
        icon: FiXCircle,
        className: "status-badge--cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`status-badge ${config.className}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const campaigns = campaignsData?.campaigns || [];
  const totalPages = campaignsData?.totalPages || 1;

  return (
    <div className="mailing-admin">
      {/* Header */}
      <div className="mailing-admin__header">
        <div className="mailing-admin__header-top">
          <div>
            <h1>
              <FiMail /> Campagnes Mailing
            </h1>
            <p>Créez et gérez vos campagnes email avec l'éditeur de blocs</p>
          </div>
          <div className="mailing-admin__header-actions">
            <button className="btn btn--secondary" onClick={refetch}>
              <FiRefreshCw />
              Actualiser
            </button>
            <button
              className="btn btn--primary"
              onClick={() => setNewCampaignModal({ open: true })}
            >
              <FiPlus />
              Nouvelle campagne
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mailing-admin__stats">
          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--primary">
              <FiMail />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.totalCampaigns || 0}
              </span>
              <span className="stat-card__label">Campagnes</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--success">
              <FiCheckCircle />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.sentCampaigns || 0}
              </span>
              <span className="stat-card__label">Envoyées</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--warning">
              <FiEdit />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.draftCampaigns || 0}
              </span>
              <span className="stat-card__label">Brouillons</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--info">
              <FiUsers />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.potentialRecipients?.all || 0}
              </span>
              <span className="stat-card__label">Destinataires</span>
            </div>
          </div>

          <div className="stat-card stat-card--highlight">
            <div className="stat-card__icon stat-card__icon--highlight">
              <FiTrendingUp />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.averageOpenRate || 0}%
              </span>
              <span className="stat-card__label">Taux d'ouverture</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card__icon stat-card__icon--secondary">
              <FiMousePointer />
            </div>
            <div className="stat-card__content">
              <span className="stat-card__value">
                {stats.averageClickRate || 0}%
              </span>
              <span className="stat-card__label">Taux de clic</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mailing-admin__filters">
        <div className="mailing-admin__search">
          <FiSearch className="mailing-admin__search-icon" />
          <input
            type="text"
            placeholder="Rechercher une campagne..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="mailing-admin__filter-row">
          <div className="mailing-admin__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="scheduled">Programmée</option>
              <option value="sending">En cours</option>
              <option value="sent">Envoyée</option>
              <option value="failed">Échouée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          <div className="mailing-admin__filter-actions">
            {(keyword || statusFilter) && (
              <button
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setKeyword("");
                  setStatusFilter("");
                  setPage(1);
                }}
              >
                <FiX />
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="mailing-admin__container">
        {isLoading ? (
          <div className="mailing-admin__loader">
            <FiRefreshCw className="spin" />
            <p>Chargement des campagnes...</p>
          </div>
        ) : isError ? (
          <div className="mailing-admin__error">
            <FiAlertCircle />
            <p>Erreur lors du chargement des campagnes</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="mailing-admin__empty">
            <FiInbox />
            <h3>Aucune campagne</h3>
            <p>Créez votre première campagne mailing</p>
            <button
              className="btn btn--primary"
              onClick={() => setNewCampaignModal({ open: true })}
            >
              <FiPlus />
              Créer une campagne
            </button>
          </div>
        ) : (
          <>
            {/* Table Desktop */}
            <table className="mailing-admin__table">
              <thead>
                <tr>
                  <th>Campagne</th>
                  <th>Statut</th>
                  <th>Destinataires</th>
                  <th>Stats</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns
                  .filter(
                    (c) =>
                      !keyword ||
                      c.name.toLowerCase().includes(keyword.toLowerCase()) ||
                      c.subject.toLowerCase().includes(keyword.toLowerCase()),
                  )
                  .map((campaign) => (
                    <tr key={campaign._id}>
                      <td>
                        <div className="campaign-cell">
                          <span className="campaign-cell__name">
                            {campaign.name}
                          </span>
                          <span className="campaign-cell__subject">
                            {campaign.subject}
                          </span>
                        </div>
                      </td>
                      <td>{getStatusBadge(campaign.status)}</td>
                      <td>
                        <div className="recipients-cell">
                          <FiUsers size={14} />
                          <span>{campaign.stats?.totalRecipients || "-"}</span>
                        </div>
                      </td>
                      <td>
                        {campaign.status === "sent" ? (
                          <div className="stats-cell">
                            <span className="stats-cell__item">
                              <FiEye size={12} />
                              {campaign.openRate || 0}%
                            </span>
                            <span className="stats-cell__item">
                              <FiMousePointer size={12} />
                              {campaign.clickRate || 0}%
                            </span>
                          </div>
                        ) : (
                          <span className="stats-cell__na">-</span>
                        )}
                      </td>
                      <td>
                        <div className="date-cell">
                          {campaign.sentAt
                            ? formatDate(campaign.sentAt)
                            : formatDate(campaign.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          {campaign.status === "draft" && (
                            <>
                              <button
                                className="action-btn action-btn--edit"
                                title="Modifier"
                                onClick={() =>
                                  navigate(
                                    `/admin/mailing/editor/${campaign._id}`,
                                  )
                                }
                              >
                                <FiEdit />
                              </button>
                              <button
                                className="action-btn action-btn--test"
                                title="Envoyer un test"
                                onClick={() =>
                                  setTestModal({ open: true, campaign })
                                }
                              >
                                <FiSend />
                              </button>
                              <button
                                className="action-btn action-btn--send"
                                title="Envoyer"
                                onClick={() =>
                                  setSendModal({ open: true, campaign })
                                }
                              >
                                <FiPlay />
                              </button>
                            </>
                          )}
                          {campaign.status === "scheduled" && (
                            <button
                              className="action-btn action-btn--cancel"
                              title="Annuler"
                              onClick={() => handleCancel(campaign)}
                              disabled={isCancelling}
                            >
                              <FiPause />
                            </button>
                          )}
                          <button
                            className="action-btn action-btn--view"
                            title="Aperçu"
                            onClick={() =>
                              setPreviewModal({ open: true, campaign })
                            }
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--copy"
                            title="Dupliquer"
                            onClick={() => handleDuplicate(campaign)}
                            disabled={isDuplicating}
                          >
                            <FiCopy />
                          </button>
                          {campaign.status !== "sending" && (
                            <button
                              className="action-btn action-btn--delete"
                              title="Supprimer"
                              onClick={() =>
                                setDeleteModal({ open: true, campaign })
                              }
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Cards Mobile */}
            <div className="mailing-admin__mobile-cards">
              {campaigns
                .filter(
                  (c) =>
                    !keyword ||
                    c.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    c.subject.toLowerCase().includes(keyword.toLowerCase()),
                )
                .map((campaign) => (
                  <div key={campaign._id} className="campaign-card">
                    <div className="campaign-card__header">
                      <div className="campaign-card__info">
                        <h3 className="campaign-card__name">{campaign.name}</h3>
                        <p className="campaign-card__subject">
                          {campaign.subject}
                        </p>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>

                    <div className="campaign-card__meta">
                      <span>
                        <FiUsers size={14} />
                        {campaign.stats?.totalRecipients || "-"} destinataires
                      </span>
                      <span>
                        <FiCalendar size={14} />
                        {formatDate(campaign.sentAt || campaign.createdAt)}
                      </span>
                    </div>

                    {campaign.status === "sent" && (
                      <div className="campaign-card__stats">
                        <div className="campaign-card__stat">
                          <span className="campaign-card__stat-value">
                            {campaign.openRate || 0}%
                          </span>
                          <span className="campaign-card__stat-label">
                            Ouverture
                          </span>
                        </div>
                        <div className="campaign-card__stat">
                          <span className="campaign-card__stat-value">
                            {campaign.clickRate || 0}%
                          </span>
                          <span className="campaign-card__stat-label">
                            Clics
                          </span>
                        </div>
                        <div className="campaign-card__stat">
                          <span className="campaign-card__stat-value">
                            {campaign.stats?.sent || 0}
                          </span>
                          <span className="campaign-card__stat-label">
                            Envoyés
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="campaign-card__actions">
                      {campaign.status === "draft" && (
                        <>
                          <button
                            className="btn btn--primary btn--sm"
                            onClick={() =>
                              navigate(`/admin/mailing/editor/${campaign._id}`)
                            }
                          >
                            <FiEdit /> Modifier
                          </button>
                          <button
                            className="btn btn--success btn--sm"
                            onClick={() =>
                              setSendModal({ open: true, campaign })
                            }
                          >
                            <FiPlay /> Envoyer
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => handleDuplicate(campaign)}
                      >
                        <FiCopy />
                      </button>
                      {campaign.status !== "sending" && (
                        <button
                          className="btn btn--outline btn--sm"
                          onClick={() =>
                            setDeleteModal({ open: true, campaign })
                          }
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mailing-admin__pagination">
              <span className="pagination-info">
                Page {page} sur {totalPages} ({campaignsData?.total || 0}{" "}
                campagnes)
              </span>
              <div className="pagination-buttons">
                <button
                  className="btn btn--secondary btn--sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="btn btn--secondary btn--sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal: Nouvelle campagne */}
      {newCampaignModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setNewCampaignModal({ open: false })}
        >
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                <FiPlus /> Nouvelle campagne
              </h3>
              <button
                className="modal__close"
                onClick={() => setNewCampaignModal({ open: false })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Choisissez un template ou partez de zéro pour créer votre
                campagne.
              </p>

              {/* Option Blank */}
              <div
                className="template-option template-option--blank"
                onClick={handleCreateBlank}
              >
                <div className="template-option__icon">
                  <FiFileText />
                </div>
                <div className="template-option__content">
                  <h4>Partir de zéro</h4>
                  <p>Créez votre email en ajoutant des blocs un par un</p>
                </div>
              </div>

              <div className="templates-divider">
                <span>ou choisissez un template</span>
              </div>

              {/* Templates */}
              {isLoadingTemplates ? (
                <div className="templates-loading">
                  <FiRefreshCw className="spin" />
                  <span>Chargement des templates...</span>
                </div>
              ) : !defaultTemplates || defaultTemplates.length === 0 ? (
                <div className="templates-empty">
                  <p>Aucun template disponible</p>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={handleSeedTemplates}
                    disabled={isSeeding}
                  >
                    {isSeeding
                      ? "Initialisation..."
                      : "Initialiser les templates"}
                  </button>
                </div>
              ) : (
                <div className="templates-grid">
                  {defaultTemplates.map((template) => (
                    <div
                      key={template._id}
                      className="template-card"
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      <div
                        className="template-card__preview"
                        style={{
                          backgroundColor:
                            template.settings?.primaryColor || "#2d6a4f",
                        }}
                      >
                        <FiLayout />
                      </div>
                      <div className="template-card__content">
                        <h4>{template.name}</h4>
                        <p>{template.description}</p>
                        <span className="template-card__category">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmer envoi */}
      {sendModal.open && sendModal.campaign && (
        <div
          className="modal-overlay"
          onClick={() => setSendModal({ open: false, campaign: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--success">
                <FiSend />
              </div>
              <h3 className="modal__title">Envoyer la campagne</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Vous êtes sur le point d'envoyer la campagne{" "}
                <strong>"{sendModal.campaign.name}"</strong>.
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setSendModal({ open: false, campaign: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--success"
                onClick={handleSend}
                disabled={isSending}
              >
                {isSending ? "Envoi en cours..." : "Envoyer maintenant"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Email de test */}
      {testModal.open && testModal.campaign && (
        <div
          className="modal-overlay"
          onClick={() => {
            setTestModal({ open: false, campaign: null });
            setTestEmail("");
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Envoyer un email de test</h3>
              <button
                className="modal__close"
                onClick={() => {
                  setTestModal({ open: false, campaign: null });
                  setTestEmail("");
                }}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Envoyez un aperçu de la campagne{" "}
                <strong>"{testModal.campaign.name}"</strong> à une adresse
                email.
              </p>
              <div className="form-group">
                <label>
                  Adresse email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => {
                  setTestModal({ open: false, campaign: null });
                  setTestEmail("");
                }}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSendTest}
                disabled={isSendingTest || !testEmail}
              >
                {isSendingTest ? "Envoi..." : "Envoyer le test"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Supprimer */}
      {deleteModal.open && deleteModal.campaign && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, campaign: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer la campagne</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer la campagne{" "}
                <strong>"{deleteModal.campaign.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, campaign: null })}
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

      {/* Modal: Aperçu */}
      {previewModal.open && previewModal.campaign && (
        <div
          className="modal-overlay"
          onClick={() => setPreviewModal({ open: false, campaign: null })}
        >
          <div
            className="modal modal--preview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3 className="modal__title">
                Aperçu: {previewModal.campaign.name}
              </h3>
              <button
                className="modal__close"
                onClick={() => setPreviewModal({ open: false, campaign: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body modal__body--preview">
              <div className="preview-frame">
                <p className="preview-placeholder">
                  Aperçu de l'email (à implémenter avec le renderer)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMailingScreen;
