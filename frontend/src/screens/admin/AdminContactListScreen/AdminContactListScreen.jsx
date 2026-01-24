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
  FiMail,
  FiCheckCircle,
  FiClock,
  FiX,
  FiCalendar,
  FiMessageSquare,
  FiPhone,
  FiUser,
  FiSend,
  FiEdit3,
  FiInbox,
  FiArchive,
  FiCheck,
  FiMessageCircle,
  FiFileText,
} from "react-icons/fi";
import {
  useGetContactsQuery,
  useGetContactStatsQuery,
  useMarkContactAsReadMutation,
  useUpdateContactStatusMutation,
  useRespondToContactMutation,
  useAddContactNotesMutation,
  useDeleteContactMutation,
} from "../../../slices/contactApiSlice";
import { toast } from "react-toastify";
import "./AdminContactListScreen.css";

const AdminContactListScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "",
  );
  const [subjectFilter, setSubjectFilter] = useState(
    searchParams.get("subject") || "",
  );
  const [isReadFilter, setIsReadFilter] = useState(
    searchParams.get("isRead") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 15;

  // États des modales
  const [viewModal, setViewModal] = useState({ open: false, contact: null });
  const [respondModal, setRespondModal] = useState({
    open: false,
    contact: null,
  });
  const [statusModal, setStatusModal] = useState({
    open: false,
    contact: null,
  });
  const [notesModal, setNotesModal] = useState({ open: false, contact: null });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    contact: null,
  });

  // États des formulaires
  const [responseContent, setResponseContent] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  // Construction des params pour l'API
  const buildQueryParams = () => {
    const params = {
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (statusFilter) params.status = statusFilter;
    if (subjectFilter) params.subject = subjectFilter;
    if (isReadFilter !== "") params.isRead = isReadFilter === "true";

    return params;
  };

  // Queries
  const {
    data: contactsData,
    isLoading,
    isError,
    refetch,
  } = useGetContactsQuery(buildQueryParams());

  const { data: stats } = useGetContactStatsQuery();

  // Mutations
  const [markAsRead] = useMarkContactAsReadMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateContactStatusMutation();
  const [respondToContact, { isLoading: isResponding }] =
    useRespondToContactMutation();
  const [addNotes, { isLoading: isAddingNotes }] = useAddContactNotesMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);
    if (subjectFilter) params.set("subject", subjectFilter);
    if (isReadFilter !== "") params.set("isRead", isReadFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [
    keyword,
    statusFilter,
    subjectFilter,
    isReadFilter,
    page,
    setSearchParams,
  ]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, statusFilter, subjectFilter, isReadFilter]);

  // Handlers
  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setSubjectFilter("");
    setIsReadFilter("");
    setPage(1);
  };

  // Ouvrir le détail et marquer comme lu
  const handleOpenView = async (contact) => {
    setViewModal({ open: true, contact });

    // Marquer comme lu si non lu
    if (!contact.isRead) {
      try {
        await markAsRead(contact._id).unwrap();
      } catch (err) {
        console.error("Erreur marquage lu:", err);
      }
    }
  };

  const handleOpenRespond = (contact) => {
    setResponseContent(contact.response?.content || "");
    setRespondModal({ open: true, contact });
  };

  const handleOpenStatus = (contact) => {
    setNewStatus(contact.status);
    setStatusModal({ open: true, contact });
  };

  const handleOpenNotes = (contact) => {
    setNotes(contact.notes || "");
    setNotesModal({ open: true, contact });
  };

  // Répondre au contact
  const handleRespond = async () => {
    if (!respondModal.contact || !responseContent.trim()) {
      toast.error("Veuillez entrer une réponse");
      return;
    }

    try {
      await respondToContact({
        id: respondModal.contact._id,
        content: responseContent,
      }).unwrap();

      toast.success("Réponse envoyée avec succès");
      setRespondModal({ open: false, contact: null });
      setResponseContent("");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi de la réponse");
    }
  };

  // Changer le statut
  const handleUpdateStatus = async () => {
    if (!statusModal.contact) return;

    try {
      await updateStatus({
        id: statusModal.contact._id,
        status: newStatus,
      }).unwrap();

      toast.success("Statut mis à jour");
      setStatusModal({ open: false, contact: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  // Ajouter des notes
  const handleAddNotes = async () => {
    if (!notesModal.contact) return;

    try {
      await addNotes({
        id: notesModal.contact._id,
        notes,
      }).unwrap();

      toast.success("Notes enregistrées");
      setNotesModal({ open: false, contact: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Supprimer un contact
  const handleDelete = async () => {
    if (!deleteModal.contact) return;

    try {
      await deleteContact(deleteModal.contact._id).unwrap();
      toast.success("Message supprimé");
      setDeleteModal({ open: false, contact: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Helpers
  const getStatusInfo = (status) => {
    const statusMap = {
      nouveau: { label: "Nouveau", class: "new", icon: FiInbox },
      lu: { label: "Lu", class: "read", icon: FiEye },
      en_cours: { label: "En cours", class: "pending", icon: FiClock },
      traite: { label: "Traité", class: "done", icon: FiCheckCircle },
      archive: { label: "Archivé", class: "archived", icon: FiArchive },
    };
    return statusMap[status] || statusMap.nouveau;
  };

  const getSubjectInfo = (subject) => {
    const subjectMap = {
      information: { label: "Demande d'information", class: "info" },
      commande: { label: "Question commande", class: "order" },
      partenariat: { label: "Partenariat", class: "partner" },
      presse: { label: "Contact presse", class: "press" },
      autre: { label: "Autre", class: "other" },
    };
    return subjectMap[subject] || subjectMap.autre;
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

  const truncateMessage = (message, maxLength = 80) => {
    if (!message) return "";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  // Calculer les stats depuis les données
  const getStatsCount = (statusKey) => {
    if (!stats?.byStatus) return 0;
    const found = stats.byStatus.find((s) => s._id === statusKey);
    return found?.count || 0;
  };

  const contacts = contactsData?.contacts || [];
  const totalPages = contactsData?.totalPages || 1;
  const totalContacts = contactsData?.total || 0;

  // Filtrer par keyword côté client (nom, email)
  const filteredContacts = keyword
    ? contacts.filter(
        (c) =>
          c.name?.toLowerCase().includes(keyword.toLowerCase()) ||
          c.email?.toLowerCase().includes(keyword.toLowerCase()),
      )
    : contacts;

  return (
    <div className="contact-list">
      {/* Header */}
      <div className="contact-list__header">
        <div className="contact-list__header-top">
          <div>
            <h1>Messages de contact</h1>
            <p>Gérez les demandes reçues via le formulaire de contact</p>
          </div>
          <div className="contact-list__header-actions">
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
      <div className="contact-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiMessageSquare />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.total || 0}</span>
            <span className="quick-stat__label">Total messages</span>
          </div>
        </div>
        <div className="quick-stat quick-stat--highlight-danger">
          <div className="quick-stat__icon quick-stat__icon--danger">
            <FiInbox />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.unread || 0}</span>
            <span className="quick-stat__label">Non lus</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiClock />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {getStatsCount("en_cours")}
            </span>
            <span className="quick-stat__label">En cours</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiCheckCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{getStatsCount("traite")}</span>
            <span className="quick-stat__label">Traités</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="contact-list__filters">
        <div className="contact-list__search">
          <FiSearch className="contact-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="contact-list__filter-row">
          <div className="contact-list__filter-group">
            <label>Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="nouveau">Nouveau</option>
              <option value="lu">Lu</option>
              <option value="en_cours">En cours</option>
              <option value="traite">Traité</option>
              <option value="archive">Archivé</option>
            </select>
          </div>

          <div className="contact-list__filter-group">
            <label>Sujet</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Tous les sujets</option>
              <option value="information">Demande d'information</option>
              <option value="commande">Question commande</option>
              <option value="partenariat">Partenariat</option>
              <option value="presse">Contact presse</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="contact-list__filter-group">
            <label>État</label>
            <select
              value={isReadFilter}
              onChange={(e) => setIsReadFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="false">Non lus</option>
              <option value="true">Lus</option>
            </select>
          </div>
        </div>

        <div className="contact-list__filter-actions">
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
        <div className="contact-list__container">
          <div className="contact-list__loader">
            <FiRefreshCw />
            <span>Chargement des messages...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="contact-list__container">
          <div className="contact-list__empty">
            <FiAlertCircle className="contact-list__empty-icon" />
            <h3>Erreur de chargement</h3>
            <p>Impossible de charger les messages.</p>
            <button className="btn btn--primary" onClick={refetch}>
              Réessayer
            </button>
          </div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="contact-list__container">
          <div className="contact-list__empty">
            <FiMessageSquare className="contact-list__empty-icon" />
            <h3>Aucun message trouvé</h3>
            <p>Aucun message ne correspond à vos critères.</p>
            {(keyword || statusFilter || subjectFilter || isReadFilter) && (
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
          <div className="contact-list__container">
            <table className="contact-list__table">
              <thead>
                <tr>
                  <th>Expéditeur</th>
                  <th>Sujet</th>
                  <th>Message</th>
                  <th>Statut</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => {
                  const statusInfo = getStatusInfo(contact.status);
                  const StatusIcon = statusInfo.icon;
                  const subjectInfo = getSubjectInfo(contact.subject);

                  return (
                    <tr
                      key={contact._id}
                      className={!contact.isRead ? "tr--unread" : ""}
                    >
                      <td>
                        <div className="sender-cell">
                          <div className="sender-cell__avatar">
                            {!contact.isRead && (
                              <span className="unread-dot"></span>
                            )}
                            <FiUser />
                          </div>
                          <div className="sender-cell__info">
                            <span className="sender-cell__name">
                              {contact.name}
                            </span>
                            <span className="sender-cell__email">
                              {contact.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`subject-badge subject-badge--${subjectInfo.class}`}
                        >
                          {subjectInfo.label}
                        </span>
                      </td>
                      <td>
                        <span className="message-preview">
                          {truncateMessage(contact.message)}
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
                          {formatDate(contact.createdAt)}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() => handleOpenView(contact)}
                            title="Voir les détails"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--respond"
                            onClick={() => handleOpenRespond(contact)}
                            title="Répondre"
                          >
                            <FiSend />
                          </button>
                          <button
                            className="action-btn action-btn--status"
                            onClick={() => handleOpenStatus(contact)}
                            title="Changer statut"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() =>
                              setDeleteModal({ open: true, contact })
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
              <div className="contact-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages} ({totalContacts} messages)
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
          <div className="contact-list__mobile-cards">
            {filteredContacts.map((contact) => {
              const statusInfo = getStatusInfo(contact.status);
              const StatusIcon = statusInfo.icon;
              const subjectInfo = getSubjectInfo(contact.subject);

              return (
                <div
                  key={contact._id}
                  className={`contact-card ${!contact.isRead ? "contact-card--unread" : ""}`}
                  onClick={() => handleOpenView(contact)}
                >
                  <div className="contact-card__header">
                    <div className="contact-card__sender">
                      {!contact.isRead && <span className="unread-dot"></span>}
                      <FiUser />
                      <div className="contact-card__sender-info">
                        <span className="contact-card__name">
                          {contact.name}
                        </span>
                        <span className="contact-card__email">
                          {contact.email}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`status-badge status-badge--${statusInfo.class}`}
                    >
                      <StatusIcon />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="contact-card__body">
                    <div className="contact-card__subject">
                      <span
                        className={`subject-badge subject-badge--${subjectInfo.class}`}
                      >
                        {subjectInfo.label}
                      </span>
                    </div>
                    <p className="contact-card__message">
                      {truncateMessage(contact.message, 120)}
                    </p>
                    <div className="contact-card__date">
                      <FiCalendar />
                      <span>{formatDate(contact.createdAt)}</span>
                    </div>
                  </div>

                  <div
                    className="contact-card__actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => handleOpenView(contact)}
                    >
                      <FiEye /> Voir
                    </button>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => handleOpenRespond(contact)}
                    >
                      <FiSend /> Répondre
                    </button>
                    <button
                      className="btn btn--outline btn--sm"
                      onClick={() => handleOpenStatus(contact)}
                    >
                      <FiEdit3 /> Statut
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="contact-list__pagination">
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
      {viewModal.open && viewModal.contact && (
        <div
          className="modal-overlay"
          onClick={() => setViewModal({ open: false, contact: null })}
        >
          <div
            className="modal modal--large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3 className="modal__title">Détail du message</h3>
              <button
                className="modal__close"
                onClick={() => setViewModal({ open: false, contact: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="contact-detail">
                {/* Header avec statut */}
                <div className="contact-detail__header">
                  {(() => {
                    const subjectInfo = getSubjectInfo(
                      viewModal.contact.subject,
                    );
                    return (
                      <span
                        className={`subject-badge subject-badge--${subjectInfo.class}`}
                      >
                        {subjectInfo.label}
                      </span>
                    );
                  })()}
                  {(() => {
                    const statusInfo = getStatusInfo(viewModal.contact.status);
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

                {/* Expéditeur */}
                <div className="contact-detail__section">
                  <h4>Expéditeur</h4>
                  <div className="contact-detail__sender">
                    <div className="contact-detail__sender-avatar">
                      <FiUser />
                    </div>
                    <div className="contact-detail__sender-info">
                      <span className="contact-detail__sender-name">
                        {viewModal.contact.name}
                      </span>
                      <div className="contact-detail__sender-contacts">
                        <span>
                          <FiMail /> {viewModal.contact.email}
                        </span>
                        {viewModal.contact.phone && (
                          <span>
                            <FiPhone /> {viewModal.contact.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="contact-detail__section">
                  <h4>Message</h4>
                  <div className="contact-detail__message">
                    {viewModal.contact.message}
                  </div>
                </div>

                {/* Réponse (si existante) */}
                {viewModal.contact.response?.content && (
                  <div className="contact-detail__section contact-detail__section--response">
                    <h4>
                      <FiSend /> Réponse envoyée
                    </h4>
                    <div className="contact-detail__response">
                      <p>{viewModal.contact.response.content}</p>
                      {viewModal.contact.response.respondedAt && (
                        <span className="contact-detail__response-date">
                          Envoyée le{" "}
                          {formatDateTime(
                            viewModal.contact.response.respondedAt,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes internes */}
                {viewModal.contact.notes && (
                  <div className="contact-detail__section contact-detail__section--notes">
                    <h4>
                      <FiFileText /> Notes internes
                    </h4>
                    <p>{viewModal.contact.notes}</p>
                  </div>
                )}

                {/* Informations */}
                <div className="contact-detail__section">
                  <h4>Informations</h4>
                  <div className="contact-detail__grid">
                    <div className="contact-detail__item">
                      <span className="contact-detail__item-label">
                        Reçu le
                      </span>
                      <span className="contact-detail__item-value">
                        {formatDateTime(viewModal.contact.createdAt)}
                      </span>
                    </div>
                    {viewModal.contact.readAt && (
                      <div className="contact-detail__item">
                        <span className="contact-detail__item-label">
                          Lu le
                        </span>
                        <span className="contact-detail__item-value">
                          {formatDateTime(viewModal.contact.readAt)}
                        </span>
                      </div>
                    )}
                    {viewModal.contact.ipAddress && (
                      <div className="contact-detail__item">
                        <span className="contact-detail__item-label">
                          Adresse IP
                        </span>
                        <span className="contact-detail__item-value contact-detail__item-value--mono">
                          {viewModal.contact.ipAddress}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setViewModal({ open: false, contact: null })}
              >
                Fermer
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, contact: null });
                  handleOpenNotes(viewModal.contact);
                }}
              >
                <FiFileText /> Notes
              </button>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setViewModal({ open: false, contact: null });
                  handleOpenStatus(viewModal.contact);
                }}
              >
                <FiEdit3 /> Statut
              </button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  setViewModal({ open: false, contact: null });
                  handleOpenRespond(viewModal.contact);
                }}
              >
                <FiSend /> Répondre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Répondre */}
      {respondModal.open && respondModal.contact && (
        <div
          className="modal-overlay"
          onClick={() => setRespondModal({ open: false, contact: null })}
        >
          <div
            className="modal modal--large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3 className="modal__title">Répondre au message</h3>
              <button
                className="modal__close"
                onClick={() => setRespondModal({ open: false, contact: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              {/* Récap du message original */}
              <div className="respond-original">
                <div className="respond-original__header">
                  <span className="respond-original__label">Message de :</span>
                  <span className="respond-original__sender">
                    {respondModal.contact.name} &lt;{respondModal.contact.email}
                    &gt;
                  </span>
                </div>
                <div className="respond-original__message">
                  {truncateMessage(respondModal.contact.message, 200)}
                </div>
              </div>

              {respondModal.contact.response?.content && (
                <div className="respond-previous">
                  <span className="respond-previous__label">
                    <FiCheck /> Une réponse a déjà été envoyée
                  </span>
                </div>
              )}

              <div className="form-group">
                <label>
                  Votre réponse <span className="required">*</span>
                </label>
                <textarea
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  placeholder="Rédigez votre réponse..."
                  rows={8}
                />
                <span className="form-help">
                  La réponse sera envoyée par email à{" "}
                  {respondModal.contact.email}
                </span>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setRespondModal({ open: false, contact: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleRespond}
                disabled={isResponding || !responseContent.trim()}
              >
                {isResponding ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <FiSend /> Envoyer la réponse
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changer Statut */}
      {statusModal.open && statusModal.contact && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModal({ open: false, contact: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Changer le statut</h3>
              <button
                className="modal__close"
                onClick={() => setStatusModal({ open: false, contact: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Message de <strong>{statusModal.contact.name}</strong>
              </p>

              <div className="form-group">
                <label>Nouveau statut</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="lu">Lu</option>
                  <option value="en_cours">En cours de traitement</option>
                  <option value="traite">Traité</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setStatusModal({ open: false, contact: null })}
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
      {notesModal.open && notesModal.contact && (
        <div
          className="modal-overlay"
          onClick={() => setNotesModal({ open: false, contact: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Notes internes</h3>
              <button
                className="modal__close"
                onClick={() => setNotesModal({ open: false, contact: null })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__text">
                Notes pour le message de{" "}
                <strong>{notesModal.contact.name}</strong>
              </p>

              <div className="form-group">
                <label>Notes (visibles uniquement par les admins)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajouter des notes internes..."
                  rows={5}
                />
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setNotesModal({ open: false, contact: null })}
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
      {deleteModal.open && deleteModal.contact && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, contact: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header modal__header--centered">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer le message</h3>
            </div>
            <div className="modal__body modal__body--centered">
              <p>
                Êtes-vous sûr de vouloir supprimer le message de{" "}
                <strong>"{deleteModal.contact.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, contact: null })}
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

export default AdminContactListScreen;
