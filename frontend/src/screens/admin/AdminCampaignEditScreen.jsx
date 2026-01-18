import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useSendTestEmailMutation,
  useCountRecipientsMutation,
  useLazyPreviewCampaignQuery,
} from "../../slices/mailingApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminCampaignEditScreen.css";

const AdminCampaignEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== "new";

  // Queries
  const { data: campaign, isLoading } = useGetCampaignByIdQuery(id, {
    skip: !isEditMode,
  });

  // Mutations
  const [createCampaign, { isLoading: isCreating }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();
  const [sendTestEmail, { isLoading: isSendingTest }] = useSendTestEmailMutation();
  const [countRecipients] = useCountRecipientsMutation();
  const [triggerPreview] = useLazyPreviewCampaignQuery();

  // State
  const [recipientCount, setRecipientCount] = useState(0);
  const [testEmail, setTestEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    template: "newsletter",
    recipients: "all",
    content: {
      headline: "",
      body: "",
      ctaText: "Découvrir",
      ctaUrl: "",
      promoCode: "",
      promoDiscount: "",
      promoExpiry: "",
      imageUrl: "",
    },
  });

  // Templates config
  const templates = [
    { value: "promo", label: "🏷️ Promotion", color: "#e53935" },
    { value: "nouveautes", label: "✨ Nouveautés", color: "#2d6a4f" },
    { value: "destockage", label: "🔥 Déstockage", color: "#f57c00" },
    { value: "evenement", label: "🎉 Événement", color: "#7b1fa2" },
    { value: "newsletter", label: "📬 Newsletter", color: "#1976d2" },
    { value: "custom", label: "💌 Personnalisé", color: "#455a64" },
  ];

  const recipientTypes = [
    { value: "all", label: "👥 Tous (utilisateurs newsletter + prospects)" },
    { value: "users", label: "👤 Utilisateurs uniquement" },
    { value: "prospects", label: "📧 Prospects uniquement" },
    { value: "newsletter_subscribers", label: "✉️ Abonnés newsletter uniquement" },
  ];

  // Load campaign data
  useEffect(() => {
    if (campaign && isEditMode) {
      setFormData({
        name: campaign.name || "",
        subject: campaign.subject || "",
        template: campaign.template || "newsletter",
        recipients: campaign.recipients || "all",
        content: {
          headline: campaign.content?.headline || "",
          body: campaign.content?.body || "",
          ctaText: campaign.content?.ctaText || "Découvrir",
          ctaUrl: campaign.content?.ctaUrl || "",
          promoCode: campaign.content?.promoCode || "",
          promoDiscount: campaign.content?.promoDiscount || "",
          promoExpiry: campaign.content?.promoExpiry
            ? new Date(campaign.content.promoExpiry).toISOString().split("T")[0]
            : "",
          imageUrl: campaign.content?.imageUrl || "",
        },
      });
    }
  }, [campaign, isEditMode]);

  // Count recipients when recipients type changes
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const result = await countRecipients({ recipients: formData.recipients }).unwrap();
        setRecipientCount(result.count);
      } catch (err) {
        console.error("Error counting recipients:", err);
      }
    };
    fetchCount();
  }, [formData.recipients, countRecipients]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      content: { ...prev.content, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.subject || !formData.content.body) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const payload = {
        ...formData,
        content: {
          ...formData.content,
          promoExpiry: formData.content.promoExpiry
            ? new Date(formData.content.promoExpiry).toISOString()
            : null,
        },
      };

      if (isEditMode) {
        await updateCampaign({ id, ...payload }).unwrap();
        toast.success("Campagne mise à jour");
      } else {
        const result = await createCampaign(payload).unwrap();
        toast.success("Campagne créée");
        navigate(`/admin/mailing/${result._id}/edit`);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error("Entrez une adresse email de test");
      return;
    }

    if (!isEditMode) {
      toast.error("Sauvegardez d'abord la campagne");
      return;
    }

    try {
      await sendTestEmail({ id, email: testEmail }).unwrap();
      toast.success(`Email de test envoyé à ${testEmail}`);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi");
    }
  };

  const handlePreview = async () => {
    if (!isEditMode) {
      toast.error("Sauvegardez d'abord la campagne");
      return;
    }

    try {
      const result = await triggerPreview(id).unwrap();
      setPreviewHtml(result.html);
      setShowPreview(true);
    } catch (err) {
      toast.error("Erreur lors de la prévisualisation");
    }
  };

  if (isLoading) return <Loader />;

  // Check if campaign is already sent
  if (campaign && (campaign.status === "sent" || campaign.status === "sending")) {
    return (
      <div className="admin-campaign-edit">
        <div className="campaign-sent-warning">
          <h2>⚠️ Campagne déjà envoyée</h2>
          <p>Cette campagne a déjà été envoyée et ne peut plus être modifiée.</p>
          <Link to="/admin/mailing" className="btn-back">
            ← Retour aux campagnes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-campaign-edit">
      <div className="edit-header">
        <Link to="/admin/mailing" className="btn-back">
          ← Retour
        </Link>
        <h1>{isEditMode ? "✏️ Modifier la campagne" : "✉️ Nouvelle campagne"}</h1>
      </div>

      <div className="edit-layout">
        {/* Form */}
        <form onSubmit={handleSubmit} className="campaign-form">
          {/* Basic Info */}
          <div className="form-section">
            <h2>📝 Informations générales</h2>

            <div className="form-group">
              <label>Nom de la campagne *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Newsletter Janvier 2025"
                required
              />
            </div>

            <div className="form-group">
              <label>Sujet de l'email *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Ex: 🎁 Découvrez nos offres exclusives !"
                required
              />
              <span className="field-hint">
                💡 Utilisez des emojis pour attirer l'attention
              </span>
            </div>
          </div>

          {/* Template Selection */}
          <div className="form-section">
            <h2>🎨 Type de template</h2>
            <div className="template-grid">
              {templates.map((tpl) => (
                <label
                  key={tpl.value}
                  className={`template-option ${formData.template === tpl.value ? "selected" : ""}`}
                  style={{ "--template-color": tpl.color }}
                >
                  <input
                    type="radio"
                    name="template"
                    value={tpl.value}
                    checked={formData.template === tpl.value}
                    onChange={handleChange}
                  />
                  <span className="template-label">{tpl.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div className="form-section">
            <h2>👥 Destinataires</h2>
            <div className="form-group">
              <label>Envoyer à</label>
              <select
                name="recipients"
                value={formData.recipients}
                onChange={handleChange}
              >
                {recipientTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="recipient-count">
                📊 <strong>{recipientCount}</strong> destinataire(s) sélectionné(s)
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="form-section">
            <h2>📄 Contenu de l'email</h2>

            <div className="form-group">
              <label>Titre principal</label>
              <input
                type="text"
                name="headline"
                value={formData.content.headline}
                onChange={handleContentChange}
                placeholder="Ex: Offres exceptionnelles !"
              />
            </div>

            <div className="form-group">
              <label>Contenu *</label>
              <textarea
                name="body"
                value={formData.content.body}
                onChange={handleContentChange}
                placeholder="Écrivez le contenu de votre email... (HTML supporté)"
                rows={8}
                required
              />
              <span className="field-hint">
                💡 Vous pouvez utiliser des balises HTML pour la mise en forme
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Texte du bouton</label>
                <input
                  type="text"
                  name="ctaText"
                  value={formData.content.ctaText}
                  onChange={handleContentChange}
                  placeholder="Ex: Découvrir"
                />
              </div>
              <div className="form-group">
                <label>URL du bouton</label>
                <input
                  type="url"
                  name="ctaUrl"
                  value={formData.content.ctaUrl}
                  onChange={handleContentChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de l'image (optionnel)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.content.imageUrl}
                onChange={handleContentChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Promo Fields (only for promo/destockage templates) */}
          {(formData.template === "promo" || formData.template === "destockage") && (
            <div className="form-section promo-section">
              <h2>🏷️ Informations promotion</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Code promo</label>
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.content.promoCode}
                    onChange={handleContentChange}
                    placeholder="Ex: PROMO20"
                  />
                </div>
                <div className="form-group">
                  <label>Réduction</label>
                  <input
                    type="text"
                    name="promoDiscount"
                    value={formData.content.promoDiscount}
                    onChange={handleContentChange}
                    placeholder="Ex: -20% sur tout le site"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date d'expiration</label>
                <input
                  type="date"
                  name="promoExpiry"
                  value={formData.content.promoExpiry}
                  onChange={handleContentChange}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-save"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? "Enregistrement..."
                : isEditMode
                ? "💾 Enregistrer"
                : "➕ Créer la campagne"}
            </button>
          </div>
        </form>

        {/* Sidebar */}
        <div className="edit-sidebar">
          {/* Preview & Test */}
          <div className="sidebar-card">
            <h3>👁️ Aperçu & Test</h3>
            {isEditMode ? (
              <>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="btn-preview"
                >
                  👁️ Prévisualiser
                </button>

                <div className="test-email-section">
                  <label>Envoyer un test</label>
                  <div className="test-email-input">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="email@test.com"
                    />
                    <button
                      type="button"
                      onClick={handleSendTest}
                      disabled={isSendingTest}
                    >
                      {isSendingTest ? "..." : "📤"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="sidebar-hint">
                Sauvegardez la campagne pour accéder à l'aperçu et aux tests.
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="sidebar-card tips">
            <h3>💡 Conseils</h3>
            <ul>
              <li>Utilisez un sujet accrocheur avec des emojis</li>
              <li>Gardez le contenu concis et direct</li>
              <li>Incluez toujours un appel à l'action clair</li>
              <li>Testez l'email avant l'envoi final</li>
              <li>Vérifiez les liens et images</li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="sidebar-card stats">
            <h3>📊 Statistiques</h3>
            <div className="quick-stat">
              <span className="stat-label">Destinataires</span>
              <span className="stat-value">{recipientCount}</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Template</span>
              <span className="stat-value">
                {templates.find((t) => t.value === formData.template)?.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Aperçu de l'email</h3>
              <button onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="preview-frame">
              <iframe
                srcDoc={previewHtml}
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignEditScreen;
