import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiLink,
  FiImage,
  FiYoutube,
  FiFileText,
  FiUpload,
  FiTrash2,
  FiEye,
  FiInfo,
  FiTag,
  FiFolder,
  FiChevronRight,
  FiRefreshCw,
  FiCheckCircle,
  FiEdit2,
  FiList,
  FiHeart,
  FiArchive,
  FiExternalLink,
  FiGlobe,
} from "react-icons/fi";
import {
  useGetVeilleByIdQuery,
  useCreateVeilleMutation,
  useUpdateVeilleMutation,
  useToggleVeilleFavoriteMutation,
  useArchiveVeilleMutation,
} from "../../../slices/veilleApiSlice";
import { useGetVeilleCategoriesQuery } from "../../../slices/veilleCategoryApiSlice";
import { useUploadProductImageMutation } from "../../../slices/productApiSlice";
import { toast } from "react-toastify";
import "./AdminVeilleEditScreen.css";

const AdminVeilleEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Refs
  const imageInputRef = useRef(null);

  // State du formulaire
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contentType: "link",
    url: "",
    imageUrl: "",
    uploadedImage: "",
    category: "",
    tags: [],
    source: "",
    priority: "medium",
    notes: "",
    isFavorite: false,
    isArchived: false,
  });

  // State pour les tags et l'image
  const [tagInput, setTagInput] = useState("");
  const [imageSource, setImageSource] = useState("url");
  const [youtubePreview, setYoutubePreview] = useState(null);

  // State pour la modal de succès
  const [successModal, setSuccessModal] = useState({
    open: false,
    isCreate: false,
    veilleId: null,
    veilleTitle: "",
  });

  // Queries
  const {
    data: veille,
    isLoading: isLoadingVeille,
    isError,
    error,
    refetch,
  } = useGetVeilleByIdQuery(id, { skip: !isEditMode });

  const { data: categories } = useGetVeilleCategoriesQuery({
    activeOnly: true,
  });

  // Mutations
  const [createVeille, { isLoading: isCreating }] = useCreateVeilleMutation();
  const [updateVeille, { isLoading: isUpdating }] = useUpdateVeilleMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();
  const [toggleFavorite] = useToggleVeilleFavoriteMutation();
  const [archiveVeille] = useArchiveVeilleMutation();

  const isSubmitting = isCreating || isUpdating;

  // Charger les données en mode édition
  useEffect(() => {
    if (veille && isEditMode) {
      setFormData({
        title: veille.title || "",
        description: veille.description || "",
        contentType: veille.contentType || "link",
        url: veille.url || "",
        imageUrl: veille.imageUrl || "",
        uploadedImage: veille.uploadedImage || "",
        category: veille.category?._id || "",
        tags: veille.tags || [],
        source: veille.source || "",
        priority: veille.priority || "medium",
        notes: veille.notes || "",
        isFavorite: veille.isFavorite || false,
        isArchived: veille.isArchived || false,
      });

      if (veille.uploadedImage) {
        setImageSource("upload");
      }

      if (veille.contentType === "youtube" && veille.youtubeVideoId) {
        setYoutubePreview(veille.youtubeVideoId);
      }
    }
  }, [veille, isEditMode]);

  // Extraire l'ID YouTube de l'URL
  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "url" && formData.contentType === "youtube") {
      const videoId = extractYoutubeId(value);
      setYoutubePreview(videoId);
    }
  };

  const handleContentTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      contentType: type,
      url: "",
      imageUrl: "",
      uploadedImage: "",
    }));
    setYoutubePreview(null);
  };

  // Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await uploadImage(formDataUpload).unwrap();
      setFormData((prev) => ({
        ...prev,
        uploadedImage: res.image,
        imageUrl: "",
      }));
      toast.success("Image uploadée avec succès");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'upload");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      uploadedImage: "",
      imageUrl: "",
    }));
  };

  // Gestion des tags
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Quick actions
  const handleToggleFavorite = async () => {
    if (isEditMode) {
      try {
        await toggleFavorite(id).unwrap();
        refetch();
      } catch (err) {
        toast.error("Erreur");
      }
    } else {
      setFormData((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleArchive = async () => {
    if (isEditMode) {
      try {
        await archiveVeille(id).unwrap();
        toast.success("Veille archivée");
        refetch();
      } catch (err) {
        toast.error("Erreur");
      }
    } else {
      setFormData((prev) => ({ ...prev, isArchived: !prev.isArchived }));
    }
  };

  // Modal handlers
  const handleContinueEditing = () => {
    setSuccessModal({
      open: false,
      isCreate: false,
      veilleId: null,
      veilleTitle: "",
    });
    if (isEditMode) refetch();
  };

  const handleGoToList = () => {
    setSuccessModal({
      open: false,
      isCreate: false,
      veilleId: null,
      veilleTitle: "",
    });
    navigate("/admin/veilles");
  };

  const handleCreateAnother = () => {
    setSuccessModal({
      open: false,
      isCreate: false,
      veilleId: null,
      veilleTitle: "",
    });
    setFormData({
      title: "",
      description: "",
      contentType: "link",
      url: "",
      imageUrl: "",
      uploadedImage: "",
      category: formData.category,
      tags: [],
      source: "",
      priority: "medium",
      notes: "",
      isFavorite: false,
      isArchived: false,
    });
    setYoutubePreview(null);
    navigate("/admin/veilles/create", { replace: true });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    if (!formData.category) {
      toast.error("La catégorie est requise");
      return;
    }

    if (formData.contentType === "link" && !formData.url) {
      toast.error("L'URL est requise pour un lien");
      return;
    }
    if (formData.contentType === "youtube" && !formData.url) {
      toast.error("L'URL YouTube est requise");
      return;
    }
    if (
      formData.contentType === "image" &&
      !formData.imageUrl &&
      !formData.uploadedImage
    ) {
      toast.error("Une image est requise");
      return;
    }

    try {
      if (isEditMode) {
        await updateVeille({ id, ...formData }).unwrap();
        setSuccessModal({
          open: true,
          isCreate: false,
          veilleId: id,
          veilleTitle: formData.title,
        });
      } else {
        const result = await createVeille(formData).unwrap();
        setSuccessModal({
          open: true,
          isCreate: true,
          veilleId: result._id,
          veilleTitle: formData.title,
        });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Une erreur est survenue");
    }
  };

  const getCurrentImage = () => formData.uploadedImage || formData.imageUrl;

  const getSelectedCategoryColor = () => {
    const cat = categories?.find((c) => c._id === formData.category);
    return cat?.color || "#6B7280";
  };

  if (isEditMode && isLoadingVeille) {
    return (
      <div className="veille-edit">
        <div className="veille-edit__loading">
          <FiRefreshCw className="spin" />
          <span>Chargement de la veille...</span>
        </div>
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div className="veille-edit">
        <div className="veille-edit__loading">
          <FiInfo />
          <span>Erreur : {error?.data?.message || "Veille non trouvée"}</span>
          <Link to="/admin/veilles" className="btn btn--primary">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="veille-edit">
      {/* Breadcrumb */}
      <div className="veille-edit__breadcrumb">
        <Link to="/admin/dashboard">Dashboard</Link>
        <FiChevronRight />
        <Link to="/admin/veilles">Veilles</Link>
        <FiChevronRight />
        <span>{isEditMode ? "Modifier" : "Nouvelle veille"}</span>
      </div>

      {/* Header */}
      <div className="veille-edit__header">
        <div className="veille-edit__header-top">
          <div>
            <h1>{isEditMode ? "Modifier la veille" : "Nouvelle veille"}</h1>
            <p>
              {isEditMode
                ? `Modification de "${veille?.title}"`
                : "Ajoutez un lien, une image ou une vidéo à votre veille"}
            </p>
          </div>
          <div className="veille-edit__header-actions">
            {isEditMode && veille?.url && (
              <a
                href={veille.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--outline"
              >
                <FiExternalLink />
                <span>Ouvrir</span>
              </a>
            )}
            <Link to="/admin/veilles" className="btn btn--secondary">
              <FiX />
              <span>Annuler</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="veille-edit__form">
          {/* Main Content */}
          <div className="veille-edit__main">
            {/* Type de contenu */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiGlobe /> Type de contenu
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="content-type-selector">
                  {["link", "image", "youtube", "document"].map((type) => (
                    <label
                      key={type}
                      className={`content-type-option ${formData.contentType === type ? "content-type-option--selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="contentType"
                        value={type}
                        checked={formData.contentType === type}
                        onChange={() => handleContentTypeChange(type)}
                      />
                      <div
                        className={`content-type-option__icon content-type-option__icon--${type}`}
                      >
                        {type === "link" && <FiLink />}
                        {type === "image" && <FiImage />}
                        {type === "youtube" && <FiYoutube />}
                        {type === "document" && <FiFileText />}
                      </div>
                      <span className="content-type-option__label">
                        {type === "link"
                          ? "Lien"
                          : type === "image"
                            ? "Image"
                            : type === "youtube"
                              ? "YouTube"
                              : "Document"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiInfo /> Informations
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="form-group">
                  <label>
                    Titre <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Titre de la veille..."
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description ou résumé..."
                    style={{ minHeight: "100px" }}
                  />
                </div>

                {/* URL pour link, youtube, document */}
                {(formData.contentType === "link" ||
                  formData.contentType === "youtube" ||
                  formData.contentType === "document") && (
                  <div className="form-group">
                    <label>
                      URL <span className="required">*</span>
                    </label>
                    <div className="url-input-group">
                      <div className="url-input-wrapper">
                        <input
                          type="url"
                          name="url"
                          value={formData.url}
                          onChange={handleChange}
                          placeholder={
                            formData.contentType === "youtube"
                              ? "https://www.youtube.com/watch?v=..."
                              : "https://example.com/article"
                          }
                        />
                        {formData.url && (
                          <a
                            href={formData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn--outline"
                          >
                            <FiExternalLink />
                          </a>
                        )}
                      </div>

                      {formData.contentType === "youtube" && (
                        <div className="youtube-preview">
                          {youtubePreview ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubePreview}`}
                              title="YouTube video preview"
                              allowFullScreen
                            />
                          ) : (
                            <div className="youtube-preview__placeholder">
                              <FiYoutube />
                              <span>
                                Entrez une URL YouTube pour voir l'aperçu
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Image */}
                {formData.contentType === "image" && (
                  <div className="form-group">
                    <label>
                      Image <span className="required">*</span>
                    </label>
                    <div className="image-source-tabs">
                      <button
                        type="button"
                        className={`image-source-tab ${imageSource === "url" ? "image-source-tab--active" : ""}`}
                        onClick={() => setImageSource("url")}
                      >
                        <FiLink /> URL externe
                      </button>
                      <button
                        type="button"
                        className={`image-source-tab ${imageSource === "upload" ? "image-source-tab--active" : ""}`}
                        onClick={() => setImageSource("upload")}
                      >
                        <FiUpload /> Upload
                      </button>
                    </div>

                    {imageSource === "url" ? (
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    ) : (
                      <div className="image-upload__actions">
                        <input
                          type="file"
                          ref={imageInputRef}
                          className="image-upload__input"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button
                          type="button"
                          className="image-upload__btn image-upload__btn--primary"
                          onClick={() => imageInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <FiUpload />
                          {isUploading ? "Upload..." : "Choisir une image"}
                        </button>
                      </div>
                    )}

                    {getCurrentImage() && (
                      <div
                        className="veille-image-preview"
                        style={{ marginTop: "var(--space-md)" }}
                      >
                        <img src={getCurrentImage()} alt="Aperçu" />
                        <div className="veille-image-preview__actions">
                          <button
                            type="button"
                            className="btn btn--sm"
                            onClick={handleRemoveImage}
                          >
                            <FiTrash2 /> Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="Nom du site, auteur..."
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiFileText /> Notes personnelles
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Vos notes sur cette veille..."
                    className="notes-textarea"
                  />
                  <p className="form-group__hint">Ces notes sont privées.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="veille-edit__sidebar">
            {/* Catégorie */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiFolder /> Catégorie
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="form-group">
                  <label>
                    Catégorie <span className="required">*</span>
                  </label>
                  <div className="category-select-wrapper">
                    <span
                      className="category-select-color"
                      style={{ background: getSelectedCategoryColor() }}
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner...</option>
                      {categories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Priorité */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiTag /> Priorité
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="priority-selector">
                  {["low", "medium", "high"].map((p) => (
                    <label
                      key={p}
                      className={`priority-option priority-option--${p} ${formData.priority === p ? "priority-option--selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={formData.priority === p}
                        onChange={handleChange}
                      />
                      {p === "low"
                        ? "Basse"
                        : p === "medium"
                          ? "Moyenne"
                          : "Haute"}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="veille-edit__card">
              <div className="veille-edit__card-header">
                <h2>
                  <FiTag /> Tags
                </h2>
              </div>
              <div className="veille-edit__card-body">
                <div className="tags-input">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tags-input__tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="tags-input__input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    onBlur={addTag}
                    placeholder="Ajouter un tag..."
                  />
                </div>
                <p className="form-group__hint">
                  Appuyez sur Entrée pour ajouter
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            {isEditMode && (
              <div className="veille-edit__card">
                <div className="veille-edit__card-header">
                  <h2>
                    <FiEye /> Actions rapides
                  </h2>
                </div>
                <div className="veille-edit__card-body">
                  <div className="veille-quick-actions">
                    <button
                      type="button"
                      className={`veille-quick-action veille-quick-action--favorite ${formData.isFavorite ? "active" : ""}`}
                      onClick={handleToggleFavorite}
                    >
                      <FiHeart />
                      {formData.isFavorite
                        ? "Retirer des favoris"
                        : "Ajouter aux favoris"}
                    </button>
                    <button
                      type="button"
                      className={`veille-quick-action veille-quick-action--archive ${formData.isArchived ? "active" : ""}`}
                      onClick={handleArchive}
                    >
                      <FiArchive />
                      {formData.isArchived ? "Désarchiver" : "Archiver"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Métadonnées */}
            {isEditMode && veille && (
              <div className="veille-edit__card">
                <div className="veille-edit__card-header">
                  <h2>
                    <FiInfo /> Informations
                  </h2>
                </div>
                <div className="veille-edit__card-body">
                  <div className="metadata-display">
                    <div className="metadata-item">
                      <span className="metadata-item__label">Créé le</span>
                      <span className="metadata-item__value">
                        {new Date(veille.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-item__label">Modifié le</span>
                      <span className="metadata-item__value">
                        {new Date(veille.updatedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-item__label">Statut</span>
                      <span className="metadata-item__value">
                        {veille.status === "unread"
                          ? "Non lu"
                          : veille.status === "read"
                            ? "Lu"
                            : veille.status === "favorite"
                              ? "Favori"
                              : "Archivé"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="veille-edit__actions">
          <div className="veille-edit__actions-secondary">
            <Link to="/admin/veilles" className="btn btn--outline">
              Annuler
            </Link>
          </div>
          <div className="veille-edit__actions-main">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || isUploading}
            >
              <FiSave />
              {isSubmitting
                ? "Enregistrement..."
                : isEditMode
                  ? "Mettre à jour"
                  : "Créer la veille"}
            </button>
          </div>
        </div>
      </form>

      {/* Modal de succès */}
      {successModal.open && (
        <div className="modal-overlay">
          <div className="modal modal--success">
            <div className="modal__header">
              <div className="modal__icon modal__icon--success">
                <FiCheckCircle />
              </div>
              <h3 className="modal__title">
                {successModal.isCreate
                  ? "Veille créée !"
                  : "Veille mise à jour !"}
              </h3>
            </div>
            <div className="modal__body">
              <p>
                La veille <strong>"{successModal.veilleTitle}"</strong> a été{" "}
                {successModal.isCreate ? "créée" : "mise à jour"} avec succès.
              </p>
              <p className="modal__subtitle">Que souhaitez-vous faire ?</p>
            </div>
            <div className="modal__actions modal__actions--stacked">
              <button
                className="btn btn--primary btn--block"
                onClick={handleContinueEditing}
              >
                <FiEdit2 /> Continuer à modifier
              </button>
              {successModal.isCreate && (
                <button
                  className="btn btn--secondary btn--block"
                  onClick={handleCreateAnother}
                >
                  <FiEye /> Créer une autre veille
                </button>
              )}
              <button
                className="btn btn--outline btn--block"
                onClick={handleGoToList}
              >
                <FiList /> Retour à la liste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVeilleEditScreen;
