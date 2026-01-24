import { useState, useRef } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiUpload,
  FiX,
  FiGrid,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiLayers,
} from "react-icons/fi";
import {
  useGetSubUniversesQuery,
  useGetSubUniverseStatsQuery,
  useCreateSubUniverseMutation,
  useUpdateSubUniverseMutation,
  useDeleteSubUniverseMutation,
  useReorderSubUniversesMutation,
} from "../../../slices/subuniverseApiSlice";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import { useUploadProductImageMutation } from "../../../slices/productApiSlice";
import { toast } from "react-toastify";
import "./AdminListUniverseScreen.css";

const SubUniverseListScreen = () => {
  // État du filtre
  const [filterUniverse, setFilterUniverse] = useState("");

  // États pour les modales
  const [editModal, setEditModal] = useState({
    open: false,
    subUniverse: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    subUniverse: null,
  });

  // État du formulaire
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    universe: "",
    isActive: true,
    displayOrder: 0,
  });

  // Ref pour l'input file
  const imageInputRef = useRef(null);

  // Queries
  const {
    data: subUniverses,
    isLoading,
    isError,
    refetch,
  } = useGetSubUniversesQuery({
    universe: filterUniverse || undefined,
    sortBy: "displayOrder",
    sortOrder: "asc",
  });

  const { data: stats } = useGetSubUniverseStatsQuery();
  const { data: universes } = useGetActiveUniversesQuery();

  // Mutations
  const [createSubUniverse, { isLoading: isCreating }] =
    useCreateSubUniverseMutation();
  const [updateSubUniverse, { isLoading: isUpdating }] =
    useUpdateSubUniverseMutation();
  const [deleteSubUniverse, { isLoading: isDeleting }] =
    useDeleteSubUniverseMutation();
  const [reorderSubUniverses] = useReorderSubUniversesMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const isSubmitting = isCreating || isUpdating;

  // Ouvrir la modal de création
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      universe:
        filterUniverse || (universes?.length > 0 ? universes[0]._id : ""),
      isActive: true,
      displayOrder: subUniverses?.length || 0,
    });
    setEditModal({ open: true, subUniverse: null });
  };

  // Ouvrir la modal d'édition
  const handleOpenEdit = (subUniverse) => {
    setFormData({
      name: subUniverse.name || "",
      description: subUniverse.description || "",
      image: subUniverse.image || "",
      universe: subUniverse.universe?._id || subUniverse.universe || "",
      isActive: subUniverse.isActive ?? true,
      displayOrder: subUniverse.displayOrder || 0,
    });
    setEditModal({ open: true, subUniverse });
  };

  // Fermer la modal d'édition
  const handleCloseEdit = () => {
    setEditModal({ open: false, subUniverse: null });
    setFormData({
      name: "",
      description: "",
      image: "",
      universe: "",
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
    if (!formData.universe) {
      toast.error("L'univers parent est requis");
      return;
    }

    try {
      if (editModal.subUniverse) {
        // Mode édition
        await updateSubUniverse({
          id: editModal.subUniverse._id,
          ...formData,
        }).unwrap();
        toast.success("Sous-univers mis à jour avec succès");
      } else {
        // Mode création
        await createSubUniverse(formData).unwrap();
        toast.success("Sous-univers créé avec succès");
      }
      handleCloseEdit();
    } catch (err) {
      toast.error(err?.data?.message || "Une erreur est survenue");
    }
  };

  // Supprimer un sous-univers
  const handleDelete = async () => {
    if (!deleteModal.subUniverse) return;

    try {
      await deleteSubUniverse(deleteModal.subUniverse._id).unwrap();
      toast.success("Sous-univers supprimé avec succès");
      setDeleteModal({ open: false, subUniverse: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  // Filtrer les sous-univers par univers pour le réordonnancement
  const getFilteredSubUniverses = () => {
    if (!subUniverses) return [];
    if (!filterUniverse) return subUniverses;
    return subUniverses.filter(
      (su) => (su.universe?._id || su.universe) === filterUniverse,
    );
  };

  const filteredSubUniverses = getFilteredSubUniverses();

  // Réordonner (monter)
  const handleMoveUp = async (index) => {
    if (index === 0 || filteredSubUniverses.length === 0) return;

    const newSubUniverses = [...filteredSubUniverses];
    [newSubUniverses[index - 1], newSubUniverses[index]] = [
      newSubUniverses[index],
      newSubUniverses[index - 1],
    ];

    const orders = newSubUniverses.map((su, i) => ({
      id: su._id,
      displayOrder: i,
    }));

    try {
      await reorderSubUniverses(orders).unwrap();
      toast.success("Ordre mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la réorganisation");
    }
  };

  // Réordonner (descendre)
  const handleMoveDown = async (index) => {
    if (index === filteredSubUniverses.length - 1) return;

    const newSubUniverses = [...filteredSubUniverses];
    [newSubUniverses[index], newSubUniverses[index + 1]] = [
      newSubUniverses[index + 1],
      newSubUniverses[index],
    ];

    const orders = newSubUniverses.map((su, i) => ({
      id: su._id,
      displayOrder: i,
    }));

    try {
      await reorderSubUniverses(orders).unwrap();
      toast.success("Ordre mis à jour");
    } catch (err) {
      toast.error("Erreur lors de la réorganisation");
    }
  };

  return (
    <div className="subuniverse-list">
      {/* Header */}
      <div className="subuniverse-list__header">
        <div className="subuniverse-list__header-top">
          <div>
            <h1>Sous-Univers</h1>
            <p>Gérez les sous-catégories de vos univers</p>
          </div>
          <div className="subuniverse-list__header-actions">
            <button
              className="btn btn--secondary"
              onClick={refetch}
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
            <button className="btn btn--primary" onClick={handleOpenCreate}>
              <FiPlus />
              <span>Nouveau sous-univers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="subuniverse-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiGrid />
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
              {stats?.productsWithoutSubUniverse || 0}
            </span>
            <span className="quick-stat__label">Sans sous-univers</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="subuniverse-list__filters">
        <div className="subuniverse-list__filter-row">
          <div className="subuniverse-list__filter-group">
            <label>Filtrer par univers</label>
            <select
              value={filterUniverse}
              onChange={(e) => setFilterUniverse(e.target.value)}
            >
              <option value="">Tous les univers</option>
              {universes?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="subuniverse-list__loader">
          <FiRefreshCw className="spin" />
          <span>Chargement des sous-univers...</span>
        </div>
      ) : isError ? (
        <div className="subuniverse-list__empty">
          <FiGrid className="subuniverse-list__empty-icon" />
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les sous-univers.</p>
          <button className="btn btn--primary" onClick={refetch}>
            Réessayer
          </button>
        </div>
      ) : filteredSubUniverses.length === 0 ? (
        <div className="subuniverse-list__empty">
          <FiGrid className="subuniverse-list__empty-icon" />
          <h3>Aucun sous-univers</h3>
          <p>
            {filterUniverse
              ? "Aucun sous-univers dans cet univers."
              : "Commencez par créer votre premier sous-univers."}
          </p>
          <button className="btn btn--primary" onClick={handleOpenCreate}>
            <FiPlus /> Créer un sous-univers
          </button>
        </div>
      ) : (
        <div className="subuniverse-list__grid">
          {filteredSubUniverses.map((subUniverse, index) => (
            <div key={subUniverse._id} className="subuniverse-card">
              <div className="subuniverse-card__image">
                {subUniverse.image ? (
                  <img src={subUniverse.image} alt={subUniverse.name} />
                ) : (
                  <div className="subuniverse-card__image-placeholder">
                    <FiImage />
                    <span>Pas d'image</span>
                  </div>
                )}
                <span className="subuniverse-card__order">{index + 1}</span>
                <span
                  className={`subuniverse-card__status status-badge ${
                    subUniverse.isActive
                      ? "status-badge--active"
                      : "status-badge--inactive"
                  }`}
                >
                  {subUniverse.isActive ? "Actif" : "Inactif"}
                </span>
              </div>

              <div className="subuniverse-card__body">
                <div className="subuniverse-card__universe">
                  <FiLayers />
                  <span>{subUniverse.universe?.name || "Sans univers"}</span>
                </div>
                <h3 className="subuniverse-card__name">{subUniverse.name}</h3>
                <p className="subuniverse-card__description">
                  {subUniverse.description}
                </p>
                <div className="subuniverse-card__meta">
                  <div className="subuniverse-card__meta-item">
                    <FiPackage />
                    <span>{subUniverse.productCount || 0} produits</span>
                  </div>
                </div>
              </div>

              <div className="subuniverse-card__actions">
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
                  disabled={index === filteredSubUniverses.length - 1}
                  title="Descendre"
                >
                  <FiChevronDown />
                </button>
                <button
                  className="action-btn action-btn--edit"
                  onClick={() => handleOpenEdit(subUniverse)}
                  title="Modifier"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="action-btn action-btn--delete"
                  onClick={() => setDeleteModal({ open: true, subUniverse })}
                  title="Supprimer"
                >
                  <FiTrash2 />
                </button>
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
                {editModal.subUniverse
                  ? "Modifier le sous-univers"
                  : "Nouveau sous-univers"}
              </h3>
              <button className="modal__close" onClick={handleCloseEdit}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal__body">
                {/* Univers parent */}
                <div className="form-group">
                  <label>
                    Univers parent <span className="required">*</span>
                  </label>
                  <select
                    name="universe"
                    value={formData.universe}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner un univers</option>
                    {universes?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div className="form-group">
                  <label>Image (optionnel)</label>
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
                    placeholder="Ex: Accessoires de salle de bain"
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
                    placeholder="Décrivez ce sous-univers..."
                  />
                  <p className="form-group__hint">Maximum 500 caractères</p>
                </div>

                {/* Actif */}
                <div className="toggle-row">
                  <span className="toggle-row__label">Sous-univers actif</span>
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
                    : editModal.subUniverse
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
          onClick={() => setDeleteModal({ open: false, subUniverse: null })}
        >
          <div
            className="modal modal--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer le sous-univers</h3>
            </div>
            <div className="modal__body">
              <p>
                Êtes-vous sûr de vouloir supprimer le sous-univers{" "}
                <strong>"{deleteModal.subUniverse?.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
              {deleteModal.subUniverse?.productCount > 0 && (
                <p style={{ color: "var(--error)", fontWeight: 500 }}>
                  ⚠️ Ce sous-univers contient{" "}
                  {deleteModal.subUniverse.productCount} produit(s). Vous devez
                  d'abord les déplacer ou les supprimer.
                </p>
              )}
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() =>
                  setDeleteModal({ open: false, subUniverse: null })
                }
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={
                  isDeleting || deleteModal.subUniverse?.productCount > 0
                }
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

export default SubUniverseListScreen;
