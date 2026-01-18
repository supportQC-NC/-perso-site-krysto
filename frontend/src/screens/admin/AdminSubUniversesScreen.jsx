import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetSubUniversesQuery,
  useCreateSubUniverseMutation,
  useUpdateSubUniverseMutation,
  useDeleteSubUniverseMutation,
  useGetSubUniverseStatsQuery,
} from "../../slices/subuniverseApiSlice";
import { useGetUniversesQuery } from "../../slices/universeApiSlice";
import { useUploadProductImageMutation } from "../../slices/productApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminSubUniversesScreen.css";

const AdminSubUniversesScreen = () => {
  const [filterUniverse, setFilterUniverse] = useState("");

  const {
    data: subUniverses,
    isLoading,
    error,
    refetch,
  } = useGetSubUniversesQuery(
    filterUniverse ? { universe: filterUniverse } : {},
  );
  const { data: universes } = useGetUniversesQuery();
  const { data: stats } = useGetSubUniverseStatsQuery();

  const [createSubUniverse, { isLoading: isCreating }] =
    useCreateSubUniverseMutation();
  const [updateSubUniverse, { isLoading: isUpdating }] =
    useUpdateSubUniverseMutation();
  const [deleteSubUniverse] = useDeleteSubUniverseMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubUniverse, setEditingSubUniverse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    universe: "",
    isActive: true,
    displayOrder: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      universe: "",
      isActive: true,
      displayOrder: 0,
    });
    setEditingSubUniverse(null);
  };

  const openModal = (subUniverse = null) => {
    if (subUniverse) {
      setEditingSubUniverse(subUniverse);
      setFormData({
        name: subUniverse.name,
        description: subUniverse.description,
        image: subUniverse.image || "",
        universe: subUniverse.universe?._id || subUniverse.universe || "",
        isActive: subUniverse.isActive,
        displayOrder: subUniverse.displayOrder,
      });
    } else {
      resetForm();
      // Pré-sélectionner l'univers si un filtre est actif
      if (filterUniverse) {
        setFormData((prev) => ({ ...prev, universe: filterUniverse }));
      }
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const result = await uploadImage(formDataUpload).unwrap();
      setFormData((prev) => ({ ...prev, image: result.image }));
      toast.success("Image téléchargée");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors du téléchargement");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.universe) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingSubUniverse) {
        await updateSubUniverse({
          id: editingSubUniverse._id,
          ...formData,
        }).unwrap();
        toast.success("Sous-univers mis à jour");
      } else {
        await createSubUniverse(formData).unwrap();
        toast.success("Sous-univers créé");
      }
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id, name, productCount) => {
    if (productCount > 0) {
      toast.error(
        `Impossible de supprimer "${name}" car il contient ${productCount} produit(s)`,
      );
      return;
    }

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer le sous-univers "${name}" ?`,
      )
    ) {
      try {
        await deleteSubUniverse(id).unwrap();
        toast.success("Sous-univers supprimé");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleToggleActive = async (subUniverse) => {
    try {
      await updateSubUniverse({
        id: subUniverse._id,
        isActive: !subUniverse.isActive,
      }).unwrap();
      toast.success(
        `Sous-univers ${!subUniverse.isActive ? "activé" : "désactivé"}`,
      );
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  // Obtenir le nom de l'univers parent
  const getUniverseName = (universeId) => {
    if (!universeId) return "Non défini";
    if (typeof universeId === "object") return universeId.name;
    const universe = universes?.find((u) => u._id === universeId);
    return universe?.name || "Inconnu";
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-subuniverses">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>📂 Gestion des Sous-Univers</h1>
          <p>Organisez vos univers en sous-catégories</p>
        </div>
        <button onClick={() => openModal()} className="btn-add-subuniverse">
          ➕ Nouveau sous-univers
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <span className="stat-value">
              {stats?.total || subUniverses?.length || 0}
            </span>
            <span className="stat-label">Total sous-univers</span>
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
          <div className="stat-icon">🌍</div>
          <div className="stat-info">
            <span className="stat-value">{universes?.length || 0}</span>
            <span className="stat-label">Univers parents</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">
              {subUniverses?.reduce(
                (acc, su) => acc + (su.productCount || 0),
                0,
              ) || 0}
            </span>
            <span className="stat-label">Produits total</span>
          </div>
        </div>
      </div>

      {/* Filtre par univers */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>🌍 Filtrer par univers</label>
          <select
            value={filterUniverse}
            onChange={(e) => setFilterUniverse(e.target.value)}
          >
            <option value="">Tous les univers</option>
            {universes?.map((universe) => (
              <option key={universe._id} value={universe._id}>
                {universe.name}
              </option>
            ))}
          </select>
        </div>
        {filterUniverse && (
          <button
            className="btn-clear-filter"
            onClick={() => setFilterUniverse("")}
          >
            ✕ Effacer le filtre
          </button>
        )}
      </div>

      {/* SubUniverses Grid */}
      <div className="subuniverses-grid">
        {subUniverses && subUniverses.length > 0 ? (
          subUniverses.map((subUniverse) => (
            <div
              key={subUniverse._id}
              className={`subuniverse-card ${!subUniverse.isActive ? "inactive" : ""}`}
            >
              <div className="subuniverse-image">
                {subUniverse.image ? (
                  <img src={subUniverse.image} alt={subUniverse.name} />
                ) : (
                  <div className="no-image">📂</div>
                )}
                <div className="subuniverse-overlay">
                  <span className="product-count">
                    {subUniverse.productCount || 0} produit(s)
                  </span>
                </div>
                {!subUniverse.isActive && (
                  <span className="inactive-badge">Inactif</span>
                )}
              </div>
              <div className="subuniverse-content">
                <div className="subuniverse-parent">
                  <span className="parent-badge">
                    🌍 {getUniverseName(subUniverse.universe)}
                  </span>
                </div>
                <h3>{subUniverse.name}</h3>
                <p>{subUniverse.description}</p>
                <div className="subuniverse-meta">
                  <span className="order-badge">
                    Ordre: {subUniverse.displayOrder}
                  </span>
                  <span className="slug-badge">{subUniverse.slug}</span>
                </div>
              </div>
              <div className="subuniverse-actions">
                <button
                  onClick={() => handleToggleActive(subUniverse)}
                  className={`action-btn toggle ${subUniverse.isActive ? "active" : ""}`}
                  title={subUniverse.isActive ? "Désactiver" : "Activer"}
                >
                  {subUniverse.isActive ? "👁️" : "👁️‍🗨️"}
                </button>
                <button
                  onClick={() => openModal(subUniverse)}
                  className="action-btn edit"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      subUniverse._id,
                      subUniverse.name,
                      subUniverse.productCount,
                    )
                  }
                  className="action-btn delete"
                  title="Supprimer"
                  disabled={subUniverse.productCount > 0}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>
              {filterUniverse
                ? "Aucun sous-univers dans cet univers"
                : "Aucun sous-univers créé"}
            </p>
            <button onClick={() => openModal()} className="btn-add-first">
              ➕ Créer votre premier sous-univers
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingSubUniverse
                  ? "✏️ Modifier le sous-univers"
                  : "➕ Nouveau sous-univers"}
              </h2>
              <button onClick={closeModal} className="modal-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Univers parent - OBLIGATOIRE */}
                <div className="form-group">
                  <label>Univers parent *</label>
                  <select
                    name="universe"
                    value={formData.universe}
                    onChange={handleChange}
                    required
                    className="universe-select"
                  >
                    <option value="">-- Sélectionnez un univers --</option>
                    {universes?.map((universe) => (
                      <option key={universe._id} value={universe._id}>
                        🌍 {universe.name}
                      </option>
                    ))}
                  </select>
                  {!formData.universe && (
                    <span className="field-hint">
                      ⚠️ Vous devez sélectionner un univers parent
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Nom du sous-univers *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Décoration intérieure"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez ce sous-univers..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image (optionnel)</label>
                  <div className="image-upload-container">
                    {formData.image ? (
                      <div className="image-preview-small">
                        <img src={formData.image} alt="Preview" />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image: "" }))
                          }
                          className="remove-image"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          hidden
                        />
                        {isUploading
                          ? "Téléchargement..."
                          : "📷 Choisir une image"}
                      </label>
                    )}
                  </div>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Ou entrez une URL"
                    className="url-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ordre d'affichage</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />
                      <span>Actif (visible sur le site)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-cancel"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={isCreating || isUpdating || !formData.universe}
                >
                  {isCreating || isUpdating
                    ? "Enregistrement..."
                    : editingSubUniverse
                      ? "💾 Enregistrer"
                      : "➕ Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubUniversesScreen;
