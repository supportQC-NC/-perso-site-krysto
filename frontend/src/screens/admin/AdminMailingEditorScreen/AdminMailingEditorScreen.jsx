import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiEye,
  FiSend,
  FiSettings,
  FiSmartphone,
  FiMonitor,
  FiPlus,
  FiTrash2,
  FiCopy,
  FiMove,
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiCheck,
  FiLayout,
  FiType,
  FiImage,
  FiMousePointer,
  FiMinus,
  FiGrid,
  FiShare2,
  FiTag,
  FiShoppingBag,
  FiCode,
  FiAlignLeft,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useGetMailingTemplateByIdQuery,
  useCreateMailingTemplateMutation,
  useUpdateMailingTemplateMutation,
  usePreviewBlocksMutation,
  useCreateBlockMutation,
  useGetBlockTypesQuery,
} from "../../../slices/maillingTemplateApiSlice.js";
import {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useGetCampaignByIdQuery,
  useSendTestEmailMutation,
} from "../../../slices/mailingApiSlice";
import { toast } from "react-toastify";
import BlockPanel from "../../../components/admin/BlockPanel/BlockPanel.jsx";
import BlockCanvas from "../../../components/admin/BlockCanvas/BlockCanvas.jsx";
import BlockProperties from "../../../components/admin/BlockProperties/BlockProperties.jsx";
import SettingsPanel from "../../../components/admin/SettingsPanel/SettingsPanel.jsx";
import PreviewModal from "../../../components/admin/PreviewModal/PreviewModal.jsx";
import "./AdminMailingEditorScreen.css";

const AdminMailingEditorScreen = () => {
  const { id } = useParams(); // ID de la campagne si édition
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template"); // ID du template si création depuis template
  const navigate = useNavigate();

  // États de l'éditeur
  const [blocks, setBlocks] = useState([]);
  const [settings, setSettings] = useState({
    maxWidth: 600,
    backgroundColor: "#f4f4f4",
    contentBackgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    baseFontSize: 16,
    baseTextColor: "#333333",
    baseLinkColor: "#2d6a4f",
    primaryColor: "#2d6a4f",
    secondaryColor: "#40916c",
    accentColor: "#ffc107",
    contentPadding: 0,
    borderRadius: 16,
    preheaderText: "",
    mobileOptimized: true,
  });

  // Infos de la campagne
  const [campaignInfo, setCampaignInfo] = useState({
    name: "Nouvelle campagne",
    subject: "Sujet de l'email",
    recipients: "all",
    filters: {},
  });

  // États UI
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [activePanel, setActivePanel] = useState("blocks"); // 'blocks', 'settings'
  const [viewMode, setViewMode] = useState("desktop"); // 'desktop', 'mobile'
  const [previewModal, setPreviewModal] = useState({ open: false, html: "" });
  const [testEmailModal, setTestEmailModal] = useState({ open: false });
  const [testEmail, setTestEmail] = useState("");
  const [saveAsTemplateModal, setSaveAsTemplateModal] = useState({
    open: false,
  });
  const [templateName, setTemplateName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Queries
  const { data: templateData, isLoading: isLoadingTemplate } =
    useGetMailingTemplateByIdQuery(templateId, { skip: !templateId });
  const { data: campaignData, isLoading: isLoadingCampaign } =
    useGetCampaignByIdQuery(id, { skip: !id });
  const { data: blockTypesData } = useGetBlockTypesQuery();

  // Mutations
  const [createCampaign, { isLoading: isCreating }] =
    useCreateCampaignMutation();
  const [updateCampaign, { isLoading: isUpdating }] =
    useUpdateCampaignMutation();
  const [createBlock] = useCreateBlockMutation();
  const [previewBlocks, { isLoading: isPreviewing }] =
    usePreviewBlocksMutation();
  const [sendTestEmail, { isLoading: isSendingTest }] =
    useSendTestEmailMutation();
  const [createTemplate, { isLoading: isSavingTemplate }] =
    useCreateMailingTemplateMutation();

  // Charger le template si création depuis template
  useEffect(() => {
    if (templateData && !id) {
      setBlocks(templateData.blocks || []);
      setSettings((prev) => ({ ...prev, ...templateData.settings }));
      setCampaignInfo((prev) => ({
        ...prev,
        name: `Campagne - ${templateData.name}`,
      }));
    }
  }, [templateData, id]);

  // Charger la campagne si édition
  useEffect(() => {
    if (campaignData) {
      setBlocks(campaignData.blocks || []);
      setSettings((prev) => ({ ...prev, ...campaignData.settings }));
      setCampaignInfo({
        name: campaignData.name,
        subject: campaignData.subject,
        recipients: campaignData.recipients,
        filters: campaignData.filters || {},
      });
    }
  }, [campaignData]);

  // Marquer les changements
  useEffect(() => {
    setHasChanges(true);
  }, [blocks, settings, campaignInfo]);

  // Générer un ID unique pour les blocs
  const generateBlockId = () =>
    `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Ajouter un bloc
  const handleAddBlock = async (type, index = null) => {
    try {
      const result = await createBlock({ type }).unwrap();
      const newBlock = { ...result, id: generateBlockId() };

      setBlocks((prev) => {
        if (index !== null) {
          const newBlocks = [...prev];
          newBlocks.splice(index, 0, newBlock);
          return newBlocks;
        }
        return [...prev, newBlock];
      });

      setSelectedBlockId(newBlock.id);
      toast.success("Bloc ajouté");
    } catch (err) {
      toast.error("Erreur lors de l'ajout du bloc");
    }
  };

  // Supprimer un bloc
  const handleDeleteBlock = (blockId) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
    toast.success("Bloc supprimé");
  };

  // Dupliquer un bloc
  const handleDuplicateBlock = (blockId) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const block = blocks[blockIndex];
    const newBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: generateBlockId(),
    };

    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(blockIndex + 1, 0, newBlock);
      return newBlocks;
    });

    setSelectedBlockId(newBlock.id);
    toast.success("Bloc dupliqué");
  };

  // Déplacer un bloc
  const handleMoveBlock = (blockId, direction) => {
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(blockIndex, 1);
      newBlocks.splice(newIndex, 0, removed);
      return newBlocks;
    });
  };

  // Mettre à jour un bloc
  const handleUpdateBlock = (blockId, updates) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...updates } : b)),
    );
  };

  // Mettre à jour les données d'un bloc
  const handleUpdateBlockData = (blockId, dataUpdates) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, data: { ...b.data, ...dataUpdates } } : b,
      ),
    );
  };

  // Mettre à jour les styles d'un bloc
  const handleUpdateBlockStyles = (blockId, styleUpdates) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, styles: { ...b.styles, ...styleUpdates } }
          : b,
      ),
    );
  };

  // Réorganiser les blocs (drag & drop)
  const handleReorderBlocks = (startIndex, endIndex) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);
      return newBlocks;
    });
  };

  // Prévisualiser
  const handlePreview = async () => {
    try {
      const result = await previewBlocks({ blocks, settings }).unwrap();
      setPreviewModal({ open: true, html: result.html });
    } catch (err) {
      toast.error("Erreur lors de la prévisualisation");
    }
  };

  // Envoyer un email de test
  const handleSendTest = async () => {
    if (!testEmail) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }

    // D'abord sauvegarder si c'est une nouvelle campagne
    if (!id) {
      toast.error("Veuillez d'abord sauvegarder la campagne");
      return;
    }

    try {
      await sendTestEmail({ id, email: testEmail }).unwrap();
      toast.success(`Email de test envoyé à ${testEmail}`);
      setTestEmailModal({ open: false });
      setTestEmail("");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'envoi");
    }
  };

  // Sauvegarder la campagne
  const handleSave = async (status = "draft") => {
    if (!campaignInfo.name || !campaignInfo.subject) {
      toast.error("Veuillez remplir le nom et le sujet de la campagne");
      setActivePanel("settings");
      return;
    }

    const campaignPayload = {
      name: campaignInfo.name,
      subject: campaignInfo.subject,
      template: "custom",
      content: {
        body: "", // On utilise les blocs maintenant
      },
      blocks,
      settings,
      recipients: campaignInfo.recipients,
      filters: campaignInfo.filters,
      status,
    };

    try {
      if (id) {
        await updateCampaign({ id, ...campaignPayload }).unwrap();
        toast.success("Campagne mise à jour");
      } else {
        const result = await createCampaign(campaignPayload).unwrap();
        toast.success("Campagne créée");
        navigate(`/admin/mailing/editor/${result._id}`, { replace: true });
      }
      setHasChanges(false);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // Sauvegarder comme template
  const handleSaveAsTemplate = async () => {
    if (!templateName) {
      toast.error("Veuillez entrer un nom pour le template");
      return;
    }

    try {
      await createTemplate({
        name: templateName,
        description: "",
        category: "custom",
        blocks,
        settings,
        isPublic: false,
      }).unwrap();
      toast.success("Template sauvegardé");
      setSaveAsTemplateModal({ open: false });
      setTemplateName("");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  // Obtenir le bloc sélectionné
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Loading state
  if (isLoadingTemplate || isLoadingCampaign) {
    return (
      <div className="mailing-editor__loading">
        <FiRefreshCw className="spin" />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="mailing-editor">
      {/* Header */}
      <header className="mailing-editor__header">
        <div className="mailing-editor__header-left">
          <button
            className="btn btn--icon"
            onClick={() => navigate("/admin/mailing")}
            title="Retour"
          >
            <FiArrowLeft />
          </button>
          <div className="mailing-editor__title">
            <input
              type="text"
              value={campaignInfo.name}
              onChange={(e) =>
                setCampaignInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nom de la campagne"
              className="mailing-editor__title-input"
            />
            {hasChanges && (
              <span className="unsaved-badge">Non sauvegardé</span>
            )}
          </div>
        </div>

        <div className="mailing-editor__header-center">
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === "desktop" ? "active" : ""}`}
              onClick={() => setViewMode("desktop")}
              title="Vue desktop"
            >
              <FiMonitor />
            </button>
            <button
              className={`view-toggle__btn ${viewMode === "mobile" ? "active" : ""}`}
              onClick={() => setViewMode("mobile")}
              title="Vue mobile"
            >
              <FiSmartphone />
            </button>
          </div>
        </div>

        <div className="mailing-editor__header-right">
          <button
            className="btn btn--secondary"
            onClick={handlePreview}
            disabled={isPreviewing}
          >
            <FiEye />
            <span>Aperçu</span>
          </button>
          <button
            className="btn btn--secondary"
            onClick={() => setTestEmailModal({ open: true })}
            disabled={!id}
            title={!id ? "Sauvegardez d'abord" : "Envoyer un test"}
          >
            <FiSend />
            <span>Test</span>
          </button>
          <button
            className="btn btn--primary"
            onClick={() => handleSave("draft")}
            disabled={isCreating || isUpdating}
          >
            <FiSave />
            <span>{isCreating || isUpdating ? "..." : "Sauvegarder"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="mailing-editor__main">
        {/* Left Panel - Blocks */}
        <aside className="mailing-editor__sidebar mailing-editor__sidebar--left">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${activePanel === "blocks" ? "active" : ""}`}
              onClick={() => setActivePanel("blocks")}
            >
              <FiPlus />
              Blocs
            </button>
            <button
              className={`sidebar-tab ${activePanel === "settings" ? "active" : ""}`}
              onClick={() => setActivePanel("settings")}
            >
              <FiSettings />
              Réglages
            </button>
          </div>

          <div className="sidebar-content">
            {activePanel === "blocks" ? (
              <BlockPanel
                blockTypes={blockTypesData}
                onAddBlock={handleAddBlock}
              />
            ) : (
              <SettingsPanel
                settings={settings}
                onUpdateSettings={setSettings}
                campaignInfo={campaignInfo}
                onUpdateCampaignInfo={setCampaignInfo}
                onSaveAsTemplate={() => setSaveAsTemplateModal({ open: true })}
              />
            )}
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="mailing-editor__canvas-wrapper">
          <div
            className={`mailing-editor__canvas ${viewMode === "mobile" ? "mailing-editor__canvas--mobile" : ""}`}
          >
            <BlockCanvas
              blocks={blocks}
              settings={settings}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
              onAddBlock={handleAddBlock}
              onDeleteBlock={handleDeleteBlock}
              onDuplicateBlock={handleDuplicateBlock}
              onMoveBlock={handleMoveBlock}
              onReorderBlocks={handleReorderBlocks}
              viewMode={viewMode}
            />
          </div>
        </main>

        {/* Right Panel - Properties */}
        <aside className="mailing-editor__sidebar mailing-editor__sidebar--right">
          {selectedBlock ? (
            <BlockProperties
              block={selectedBlock}
              onUpdateData={(updates) =>
                handleUpdateBlockData(selectedBlock.id, updates)
              }
              onUpdateStyles={(updates) =>
                handleUpdateBlockStyles(selectedBlock.id, updates)
              }
              onDelete={() => handleDeleteBlock(selectedBlock.id)}
              onDuplicate={() => handleDuplicateBlock(selectedBlock.id)}
              onClose={() => setSelectedBlockId(null)}
            />
          ) : (
            <div className="properties-empty">
              <FiMousePointer />
              <p>Sélectionnez un bloc pour modifier ses propriétés</p>
            </div>
          )}
        </aside>
      </div>

      {/* Preview Modal */}
      {previewModal.open && (
        <PreviewModal
          html={previewModal.html}
          onClose={() => setPreviewModal({ open: false, html: "" })}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
        />
      )}

      {/* Test Email Modal */}
      {testEmailModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setTestEmailModal({ open: false })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Envoyer un email de test</h3>
              <button
                className="modal__close"
                onClick={() => setTestEmailModal({ open: false })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Adresse email</label>
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
                onClick={() => setTestEmailModal({ open: false })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSendTest}
                disabled={isSendingTest || !testEmail}
              >
                {isSendingTest ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save as Template Modal */}
      {saveAsTemplateModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setSaveAsTemplateModal({ open: false })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Sauvegarder comme template</h3>
              <button
                className="modal__close"
                onClick={() => setSaveAsTemplateModal({ open: false })}
              >
                <FiX />
              </button>
            </div>
            <div className="modal__body">
              <div className="form-group">
                <label>Nom du template</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Mon template"
                />
              </div>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setSaveAsTemplateModal({ open: false })}
              >
                Annuler
              </button>
              <button
                className="btn btn--primary"
                onClick={handleSaveAsTemplate}
                disabled={isSavingTemplate || !templateName}
              >
                {isSavingTemplate ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMailingEditorScreen;
