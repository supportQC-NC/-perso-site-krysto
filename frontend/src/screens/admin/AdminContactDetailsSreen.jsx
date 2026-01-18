import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetContactByIdQuery,
  useMarkContactAsReadMutation,
  useUpdateContactStatusMutation,
  useRespondToContactMutation,
  useAddContactNotesMutation,
  useDeleteContactMutation,
} from "../../slices/contactApiSlice";
import FormTextarea from "../../components/Form/FormTextarea";
import FormSelect from "../../components/Form/FormSelect";
import FormButton from "../../components/Form/FormButton";
import Loader from "../../components/global/Loader";
import "./AdminContactDetailsScreen.css";

const AdminContactDetailsSreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: contact,
    isLoading,
    error,
    refetch,
  } = useGetContactByIdQuery(id);
  const [markAsRead] = useMarkContactAsReadMutation();
  const [updateStatus] = useUpdateContactStatusMutation();
  const [respondToContact, { isLoading: isResponding }] =
    useRespondToContactMutation();
  const [addNotes, { isLoading: isSavingNotes }] = useAddContactNotesMutation();
  const [deleteContact] = useDeleteContactMutation();

  const [responseContent, setResponseContent] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (contact) {
      setNotes(contact.notes || "");
      setStatus(contact.status || "nouveau");
      // Marquer comme lu automatiquement
      if (!contact.isRead) {
        markAsRead(id);
      }
    }
  }, [contact, id, markAsRead]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("Statut mis à jour");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!responseContent.trim()) {
      toast.error("Veuillez saisir une réponse");
      return;
    }
    try {
      await respondToContact({ id, content: responseContent }).unwrap();
      toast.success("Réponse envoyée avec succès");
      setResponseContent("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi");
    }
  };

  const handleSaveNotes = async () => {
    try {
      await addNotes({ id, notes }).unwrap();
      toast.success("Notes enregistrées");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteContact(id).unwrap();
        toast.success("Message supprimé");
        navigate("/admin/contacts");
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      nouveau: "Nouveau",
      lu: "Lu",
      en_cours: "En cours",
      traite: "Traité",
      archive: "Archivé",
    };
    return labels[status] || status;
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      information: "Demande d'information",
      commande: "Question sur une commande",
      partenariat: "Proposition de partenariat",
      presse: "Contact presse",
      autre: "Autre",
    };
    return labels[subject] || subject;
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

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Message non trouvé</p>;
  if (!contact) return null;

  return (
    <div className="contact-detail-container">
      {/* Header */}
      <div className="contact-detail-header">
        <Link to="/admin/contacts" className="back-link">
          ← Retour aux messages
        </Link>
        <div className="header-actions">
          <button onClick={handleDelete} className="btn-delete">
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <div className="contact-detail-grid">
        {/* Colonne principale */}
        <div className="contact-detail-main">
          {/* Carte Message */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>📩 Message reçu</h2>
              <span className={`status-badge status-${contact.status}`}>
                {getStatusLabel(contact.status)}
              </span>
            </div>
            <div className="detail-card-content">
              {/* Infos expéditeur */}
              <div className="sender-info">
                <div className="sender-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="sender-details">
                  <h3>{contact.name}</h3>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  {contact.phone && (
                    <span className="sender-phone">📱 {contact.phone}</span>
                  )}
                </div>
              </div>

              {/* Meta infos */}
              <div className="message-meta">
                <div className="meta-item">
                  <span className="meta-label">Sujet</span>
                  <span className="meta-value">
                    {getSubjectLabel(contact.subject)}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Date</span>
                  <span className="meta-value">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
              </div>

              {/* Contenu du message */}
              <div className="message-body">
                <p>{contact.message}</p>
              </div>
            </div>
          </div>

          {/* Carte Réponse */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>✉️ Répondre</h2>
            </div>
            <div className="detail-card-content">
              {contact.response?.content ? (
                <div className="previous-response">
                  <div className="response-header">
                    <span>
                      ✅ Réponse envoyée le{" "}
                      {formatDate(contact.response.respondedAt)}
                    </span>
                  </div>
                  <p>{contact.response.content}</p>
                </div>
              ) : (
                <form onSubmit={handleRespond}>
                  <FormTextarea
                    label="Votre réponse"
                    name="response"
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    placeholder="Saisissez votre réponse au client..."
                    rows={6}
                    maxLength={2000}
                  />
                  <FormButton type="submit" isLoading={isResponding}>
                    📤 Envoyer la réponse
                  </FormButton>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="contact-detail-sidebar">
          {/* Statut */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>📊 Statut</h2>
            </div>
            <div className="detail-card-content">
              <FormSelect
                label="Changer le statut"
                name="status"
                value={status}
                onChange={handleStatusChange}
                options={[
                  { value: "nouveau", label: "Nouveau" },
                  { value: "lu", label: "Lu" },
                  { value: "en_cours", label: "En cours" },
                  { value: "traite", label: "Traité" },
                  { value: "archive", label: "Archivé" },
                ]}
              />
            </div>
          </div>

          {/* Notes internes */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>📝 Notes internes</h2>
            </div>
            <div className="detail-card-content">
              <FormTextarea
                label="Notes (visibles uniquement par l'équipe)"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoutez des notes..."
                rows={4}
                maxLength={500}
              />
              <FormButton
                type="button"
                onClick={handleSaveNotes}
                isLoading={isSavingNotes}
                variant="secondary"
              >
                💾 Enregistrer les notes
              </FormButton>
            </div>
          </div>

          {/* Infos techniques */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>ℹ️ Informations</h2>
            </div>
            <div className="detail-card-content">
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">ID</span>
                  <span className="info-value">{contact._id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Reçu le</span>
                  <span className="info-value">
                    {formatDate(contact.createdAt)}
                  </span>
                </div>
                {contact.readAt && (
                  <div className="info-row">
                    <span className="info-label">Lu le</span>
                    <span className="info-value">
                      {formatDate(contact.readAt)}
                    </span>
                  </div>
                )}
                {contact.ipAddress && (
                  <div className="info-row">
                    <span className="info-label">Adresse IP</span>
                    <span className="info-value">{contact.ipAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2>⚡ Actions</h2>
            </div>
            <div className="detail-card-content">
              <div className="quick-actions-list">
                <a
                  href={`mailto:${contact.email}`}
                  className="quick-action-link"
                >
                  📧 Envoyer un email direct
                </a>
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="quick-action-link"
                  >
                    📱 Appeler le client
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactDetailsSreen;
