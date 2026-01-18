import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetUniversesQuery,
  useCreateUniverseMutation,
  useUpdateUniverseMutation,
  useDeleteUniverseMutation,
} from "../../slices/universeApiSlice";
import { useUploadProductImageMutation } from "../../slices/productApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminUniversesScreen.css";

const AdminUniversesScreen = () => {
  const { data: universes, isLoading, error, refetch } = useGetUniversesQuery();
  const [createUniverse, { isLoading: isCreating }] =
    useCreateUniverseMutation();
  const [updateUniverse, { isLoading: isUpdating }] =
    useUpdateUniverseMutation();
  const [deleteUniverse] = useDeleteUniverseMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniverse, setEditingUniverse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    displayOrder: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
      displayOrder: universes?.length || 0,
    });
    setEditingUniverse(null);
  };

  const openModal = (universe = null) => {
    if (universe) {
      setEditingUniverse(universe);
      setFormData({
        name: universe.name,
        description: universe.description,
        image: universe.image,
        isActive: universe.isActive,
        displayOrder: universe.displayOrder,
      });
    } else {
      resetForm();
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

    if (!formData.name || !formData.description || !formData.image) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      if (editingUniverse) {
        await updateUniverse({ id: editingUniverse._id, ...formData }).unwrap();
        toast.success("Univers mis à jour");
      } else {
        await createUniverse(formData).unwrap();
        toast.success("Univers créé");
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
      window.confirm(`Êtes-vous sûr de vouloir supprimer l'univers "${name}" ?`)
    ) {
      try {
        await deleteUniverse(id).unwrap();
        toast.success("Univers supprimé");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleToggleActive = async (universe) => {
    try {
      await updateUniverse({
        id: universe._id,
        isActive: !universe.isActive,
      }).unwrap();
      toast.success(`Univers ${!universe.isActive ? "activé" : "désactivé"}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <p className="error-message">Erreur de chargement</p>;

  return (
    <div className="admin-universes">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🌍 Gestion des Univers</h1>
          <p>Organisez vos produits par univers thématiques</p>
        </div>
        <button onClick={() => openModal()} className="btn-add-universe">
          ➕ Nouvel univers
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">🌍</div>
          <div className="stat-info">
            <span className="stat-value">{universes?.length || 0}</span>
            <span className="stat-label">Total univers</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">
              {universes?.filter((u) => u.isActive).length || 0}
            </span>
            <span className="stat-label">Actifs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">
              {universes?.reduce((acc, u) => acc + (u.productCount || 0), 0) ||
                0}
            </span>
            <span className="stat-label">Produits total</span>
          </div>
        </div>
      </div>

      {/* Universes Grid */}
      <div className="universes-grid">
        {universes && universes.length > 0 ? (
          universes.map((universe) => (
            <div
              key={universe._id}
              className={`universe-card ${!universe.isActive ? "inactive" : ""}`}
            >
              <div className="universe-image">
                <img src={universe.image} alt={universe.name} />
                <div className="universe-overlay">
                  <span className="product-count">
                    {universe.productCount || 0} produit(s)
                  </span>
                </div>
                {!universe.isActive && (
                  <span className="inactive-badge">Inactif</span>
                )}
              </div>
              <div className="universe-content">
                <h3>{universe.name}</h3>
                <p>{universe.description}</p>
                <div className="universe-meta">
                  <span className="order-badge">
                    Ordre: {universe.displayOrder}
                  </span>
                  <span className="slug-badge">{universe.slug}</span>
                </div>
              </div>
              <div className="universe-actions">
                <button
                  onClick={() => handleToggleActive(universe)}
                  className={`action-btn toggle ${universe.isActive ? "active" : ""}`}
                  title={universe.isActive ? "Désactiver" : "Activer"}
                >
                  {universe.isActive ? "👁️" : "👁️‍🗨️"}
                </button>
                <button
                  onClick={() => openModal(universe)}
                  className="action-btn edit"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      universe._id,
                      universe.name,
                      universe.productCount,
                    )
                  }
                  className="action-btn delete"
                  title="Supprimer"
                  disabled={universe.productCount > 0}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>Aucun univers créé</p>
            <button onClick={() => openModal()} className="btn-add-first">
              ➕ Créer votre premier univers
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
                {editingUniverse
                  ? "✏️ Modifier l'univers"
                  : "➕ Nouvel univers"}
              </h2>
              <button onClick={closeModal} className="modal-close">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nom de l'univers *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Maison & Déco"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez cet univers..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image *</label>
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
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating
                    ? "Enregistrement..."
                    : editingUniverse
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

export default AdminUniversesScreen;
