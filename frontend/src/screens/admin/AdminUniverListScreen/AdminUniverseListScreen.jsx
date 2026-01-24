import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiUpload,
  FiX,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import {
  useGetUniversesQuery,
  useGetUniverseStatsQuery,
  useCreateUniverseMutation,
  useUpdateUniverseMutation,
  useDeleteUniverseMutation,
  useReorderUniversesMutation,
} from "../../../slices/universeApiSlice";
import { useUploadProductImageMutation } from "../../../slices/productApiSlice";
import { toast } from "react-toastify";
import "./AdminUniverseListScreen.css";

const UniverseListScreen = () => {
  // États pour les modales
  const [editModal, setEditModal] = useState({ open: false, universe: null });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    universe: null,
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    displayOrder: 0,
  });

  // Ref pour l'input file
  const imageInputRef = useRef(null);

  // Queries
  const {
    data: universes,
    isLoading,
    isError,
    refetch,
  } = useGetUniversesQuery({ sortBy: "displayOrder", sortOrder: "asc" });

  const { data: stats } = useGetUniverseStatsQuery();

  // Mutations
  const [createUniverse, { isLoading: isCreating }] =
    useCreateUniverseMutation();
  const [updateUniverse, { isLoading: isUpdating }] =
    useUpdateUniverseMutation();
  const [deleteUniverse, { isLoading: isDeleting }] =
    useDeleteUniverseMutation();
  const [reorderUniverses] = useReorderUniversesMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const isSubmitting = isCreating || isUpdating;

  // Ouvrir la modal de création
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
      displayOrder: universes?.length || 0,
    });
    setEditModal({ open: true, universe: null });
  };

  // Ouvrir la modal d'édition
  const handleOpenEdit = (universe) => {
    setFormData({
      name: universe.name || "",
      description: universe.description || "",
      image: universe.image || "",
      isActive: universe.isActive ?? true,
      displayOrder: universe.displayOrder || 0,
    });
    setEditModal({ open: true, universe });
  };

  // Fermer la modal d'édition
  const handleCloseEdit = () => {
    setEditModal({ open: false, universe: null });
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
      displayOrder: 0,
    });
  };

  // Gérer les changements du formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload d'image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await uploadImage(formDataUpload).unwrap();
      setFormData((prev) => ({ ...prev, image: res.image }));
      toast.success("Image uploadée avec succès");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'upload");
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("La description est requise");
      return;
    }
    if (!formData.image) {
      toast.error("L'image est requise");
      return;
    }

    try {
      if (editModal.universe) {
        // Mode édition
        await updateUniverse({
          id: editModal.universe._id,
          ...formData,
        }).unwrap();
        toast.success("Univers mis à jour avec succès");
      } else {
        // Mode création
        await createUniverse(formData).unwrap();
        toast.success("Univers créé avec succès");
      }
      handleCloseEdit();
    } catch (err) {
      toast.error(err?.data?.message || "Une erreur est survenue");
    }
  };

  // Supprimer un univers
  const handleDelete = async () => {
    if (!deleteModal.universe) return;

    try {
      await deleteUniverse(deleteModal.universe._id).unwrap();
      toast.success("Univers supprimé avec succès");
      setDeleteModal({ open: false, universe: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Réordonner (monter)
  const handleMoveUp = async (index) => {
    if (index === 0 || !universes) return;

    const newUniverses = [...universes];
    [newUniverses[index - 1], newUniverses[index]] = [
      newUniverses[index],
      newUniverses[index - 1],
    ];

    const orders = newUniverses.map((u, i) => ({ id: u._id, displayOrder: i }));

    try {
      await reorderUniverses(orders).unwrap();
      toast.success("Ordre mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la réorganisation");
    }
  };

  // Réordonner (descendre)
  const handleMoveDown = async (index) => {
    if (!universes || index === universes.length - 1) return;

    const newUniverses = [...universes];
    [newUniverses[index], newUniverses[index + 1]] = [
      newUniverses[index + 1],
      newUniverses[index],
    ];

    const orders = newUniverses.map((u, i) => ({ id: u._id, displayOrder: i }));

    try {
      await reorderUniverses(orders).unwrap();
      toast.success("Ordre mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la réorganisation");
    }
  };

  return (
    <div className="universe-list">
      {/* Header */}
      <div className="universe-list__header">
        <div className="universe-list__header-top">
          <div>
            <h1>Univers</h1>
            <p>Gérez les univers de produits</p>
          </div>
          <div className="universe-list__header-actions">
            <button
              className="btn btn--secondary"
              onClick={refetch}
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
            <button className="btn btn--primary" onClick={handleOpenCreate}>
              <FiPlus />
              <span>Nouvel univers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="universe-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiLayers />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.total || 0}</span>
            <span className="quick-stat__label">Total</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiCheckCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.active || 0}</span>
            <span className="quick-stat__label">Actifs</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiXCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">{stats?.inactive || 0}</span>
            <span className="quick-stat__label">Inactifs</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--secondary">
            <FiPackage />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {stats?.productsWithoutUniverse || 0}
            </span>
            <span className="quick-stat__label">Sans univers</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="universe-list__loader">
          <FiRefreshCw className="spin" />
          <span>Chargement des univers...</span>
        </div>
      ) : isError ? (
        <div className="universe-list__empty">
          <FiLayers className="universe-list__empty-icon" />
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les univers.</p>
          <button className="btn btn--primary" onClick={refetch}>
            Réessayer
          </button>
        </div>
      ) : universes?.length === 0 ? (
        <div className="universe-list__empty">
          <FiLayers className="universe-list__empty-icon" />
          <h3>Aucun univers</h3>
          <p>Commencez par créer votre premier univers de produits.</p>
          <button className="btn btn--primary" onClick={handleOpenCreate}>
            <FiPlus /> Créer un univers
          </button>
        </div>
      ) : (
        <div className="universe-list__grid">
          {universes?.map((universe, index) => (
            <div key={universe._id} className="universe-card">
              <div className="universe-card__image">
                {universe.image ? (
                  <img src={universe.image} alt={universe.name} />
                ) : (
                  <div className="universe-card__image-placeholder">
                    <FiImage />
                    <span>Pas d'image</span>
                  </div>
                )}
                <span className="universe-card__order">{index + 1}</span>
                <span
                  className={`universe-card__status status-badge ${
                    universe.isActive
                      ? "status-badge--active"
                      : "status-badge--inactive"
                  }`}
                >
                  {universe.isActive ? "Actif" : "Inactif"}
                </span>
              </div>

              <div className="universe-card__content">
                <div className="universe-card__body">
                  <h3 className="universe-card__name">{universe.name}</h3>
                  <p className="universe-card__description">
                    {universe.description}
                  </p>
                  <div className="universe-card__meta">
                    <div className="universe-card__meta-item">
                      <FiPackage />
                      <span>{universe.productCount || 0} produits</span>
                    </div>
                  </div>
                </div>

                <div className="universe-card__actions">
                  <button
                    className="action-btn action-btn--reorder"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Monter"
                  >
                    <FiChevronUp />
                  </button>
                  <button
                    className="action-btn action-btn--reorder"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === universes.length - 1}
                    title="Descendre"
                  >
                    <FiChevronDown />
                  </button>
                  <button
                    className="action-btn action-btn--edit"
                    onClick={() => handleOpenEdit(universe)}
                    title="Modifier"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="action-btn action-btn--delete"
                    onClick={() => setDeleteModal({ open: true, universe })}
                    title="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Création/Édition */}
      {editModal.open && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">
                {editModal.universe ? "Modifier l'univers" : "Nouvel univers"}
              </h3>
              <button className="modal__close" onClick={handleCloseEdit}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                {/* Image */}
                <div className="form-group">
                  <label>
                    Image <span className="required">*</span>
                  </label>
                  <div
                    className={`image-upload-preview ${
                      !formData.image ? "image-upload-preview--empty" : ""
                    }`}
                  >
                    {formData.image ? (
                      <img src={formData.image} alt="Aperçu" />
                    ) : (
                      <>
                        <FiImage />
                        <span>Aucune image</span>
                      </>
                    )}
                  </div>
                  <div className="image-upload-actions">
                    <input
                      type="file"
                      ref={imageInputRef}
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <FiUpload />
                      {isUploading ? "Upload..." : "Choisir"}
                    </button>
                    {formData.image && (
                      <button
                        type="button"
                        className="btn btn--outline"
                        onClick={handleRemoveImage}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>

                {/* Nom */}
                <div className="form-group">
                  <label>
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Maison & Déco"
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez cet univers..."
                  />
                  <p className="form-group__hint">Maximum 500 caractères</p>
                </div>

                {/* Actif */}
                <div className="toggle-row">
                  <span className="toggle-row__label">Univers actif</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <span className="toggle-switch__slider"></span>
                  </label>
                </div>
              </div>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleCloseEdit}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting
                    ? "Enregistrement..."
                    : editModal.universe
                      ? "Mettre à jour"
                      : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, universe: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer l'univers</h3>
            </div>
            <div className="modal__body">
              <p>
                Êtes-vous sûr de vouloir supprimer l'univers{" "}
                <strong>"{deleteModal.universe?.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
              {deleteModal.universe?.productCount > 0 && (
                <p style={{ color: "var(--error)", fontWeight: 500 }}>
                  ⚠️ Cet univers contient {deleteModal.universe.productCount}{" "}
                  produit(s). Vous devez d'abord les déplacer ou les supprimer.
                </p>
              )}
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, universe: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={isDeleting || deleteModal.universe?.productCount > 0}
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

export default UniverseListScreen;
