import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useCreateProductMutation,
} from "../../slices/productApiSlice";
import { useGetUniversesQuery } from "../../slices/universeApiSlice";
import { useGetSubUniversesByUniverseQuery } from "../../slices/subuniverseApiSlice";
import FormInput from "../../components/Form/FormInput";
import FormTextarea from "../../components/Form/FormTextarea";
import FormSelect from "../../components/Form/FormSelect";
import FormButton from "../../components/Form/FormButton";
import Loader from "../../components/global/Loader";
import "./AdminProductDetailsScreen.css";

const AdminProductDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id && id !== "create";

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductByIdQuery(id, { skip: !isEditMode });

  const { data: universes } = useGetUniversesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const [formData, setFormData] = useState({
    name: "",
    description_fr: "",
    image: "",
    images: [],
    brand: "Krysto",
    color: "",
    weight: "",
    dimensions: "",
    plasticType: "HDPE",
    plasticOrigin: "",
    category: "Maison",
    productType: "Cache-pot",
    universe: "",
    subUniverse: "", // NOUVEAU
    price: "",
    salePrice: "",
    countInStock: 0,
    careInstructions: "",
    isNewProduct: false,
    isFeatured: false,
    status: "draft",
    tags: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  // NOUVEAU: Charger les sous-univers en fonction de l'univers sélectionné
  const { data: subUniversesData, isLoading: isLoadingSubUniverses } =
    useGetSubUniversesByUniverseQuery(
      { universeId: formData.universe },
      { skip: !formData.universe },
    );

  useEffect(() => {
    if (product && isEditMode) {
      setFormData({
        name: product.name || "",
        description_fr: product.description_fr || "",
        image: product.image || "",
        images: product.images || [],
        brand: product.brand || "Krysto",
        color: product.color || "",
        weight: product.weight || "",
        dimensions: product.dimensions || "",
        plasticType: product.plasticType || "HDPE",
        plasticOrigin: product.plasticOrigin || "",
        category: product.category || "Maison",
        productType: product.productType || "Cache-pot",
        universe: product.universe?._id || product.universe || "",
        subUniverse: product.subUniverse?._id || product.subUniverse || "", // NOUVEAU
        price: product.price || "",
        salePrice: product.salePrice || "",
        countInStock: product.countInStock || 0,
        careInstructions: product.careInstructions || "",
        isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false,
        status: product.status || "draft",
        tags: product.tags?.join(", ") || "",
      });
      setPreviewImage(product.image || "");
    }
  }, [product, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // NOUVEAU: Réinitialiser le sous-univers si l'univers change
    if (name === "universe") {
      setFormData((prev) => ({
        ...prev,
        universe: value,
        subUniverse: "", // Reset du sous-univers
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const result = await uploadImage(formDataUpload).unwrap();
      setFormData((prev) => ({ ...prev, image: result.image }));
      setPreviewImage(result.image);
      toast.success("Image téléchargée");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors du téléchargement");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      countInStock: Number(formData.countInStock),
      universe: formData.universe || null,
      subUniverse: formData.subUniverse || null, // NOUVEAU
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    try {
      if (isEditMode) {
        await updateProduct({ id, ...productData }).unwrap();
        toast.success("Produit mis à jour");
      } else {
        await createProduct(productData).unwrap();
        toast.success("Produit créé");
        navigate("/admin/products");
      }
      refetch?.();
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Produit supprimé");
        navigate("/admin/products");
      } catch (err) {
        toast.error(err?.data?.message || "Erreur");
      }
    }
  };

  const categoryOptions = [
    { value: "Maison", label: "🏠 Maison" },
    { value: "Salle de bain", label: "🚿 Salle de bain" },
    { value: "Accessoires", label: "👜 Accessoires" },
    { value: "Jeux", label: "🎮 Jeux" },
    { value: "Bureau", label: "📎 Bureau" },
    { value: "Bijoux", label: "💍 Bijoux" },
    { value: "Coffrets", label: "🎁 Coffrets" },
  ];

  const productTypeOptions = {
    Maison: ["Cache-pot", "Sous-verre", "Dessous de plat", "Vase"],
    "Salle de bain": ["Peigne", "Porte-savon", "Gobelet", "Pack Salle de bain"],
    Accessoires: ["Lunettes", "Porte-clés", "Coque téléphone"],
    Jeux: ["Jeu de société", "Jouet"],
    Bureau: ["Stylo", "Pot à crayons", "Règle"],
    Bijoux: ["Bague", "Bracelet", "Collier", "Boucles d'oreilles"],
    Coffrets: ["Coffret cadeau"],
  };

  const plasticTypeOptions = [
    { value: "HDPE", label: "HDPE" },
    { value: "PET", label: "PET" },
    { value: "PP", label: "PP" },
    { value: "LDPE", label: "LDPE" },
    { value: "PVC", label: "PVC" },
    { value: "PS", label: "PS" },
    { value: "HDPE/PP", label: "HDPE/PP" },
    { value: "Autre", label: "Autre" },
  ];

  const statusOptions = [
    { value: "draft", label: "📝 Brouillon" },
    { value: "active", label: "✅ Actif" },
    { value: "archived", label: "📁 Archivé" },
  ];

  const universeOptions = [
    { value: "", label: "-- Aucun univers --" },
    ...(universes?.map((u) => ({ value: u._id, label: `🌍 ${u.name}` })) || []),
  ];

  // NOUVEAU: Options des sous-univers
  const subUniverseOptions = [
    { value: "", label: "-- Aucun sous-univers --" },
    ...(subUniversesData?.subUniverses?.map((su) => ({
      value: su._id,
      label: `📂 ${su.name}`,
    })) || []),
  ];

  if (isLoading && isEditMode) return <Loader />;
  if (error && isEditMode)
    return <p className="error-message">Produit non trouvé</p>;

  return (
    <div className="product-detail-container">
      {/* Header */}
      <div className="product-detail-header">
        <Link to="/admin/products" className="back-link">
          ← Retour aux produits
        </Link>
        <div className="header-actions">
          {isEditMode && (
            <button onClick={handleDelete} className="btn-delete">
              🗑️ Supprimer
            </button>
          )}
        </div>
      </div>

      <div className="product-detail-title">
        <h1>{isEditMode ? "✏️ Modifier le produit" : "➕ Nouveau produit"}</h1>
        <p>
          {isEditMode
            ? "Modifiez les informations du produit"
            : "Remplissez les informations pour créer un nouveau produit"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="product-detail-grid">
          {/* Colonne principale */}
          <div className="product-detail-main">
            {/* Informations de base */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>📋 Informations générales</h2>
              </div>
              <div className="detail-card-content">
                <FormInput
                  label="Nom du produit *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Cache-pot Tropical"
                  required
                />
                <FormTextarea
                  label="Description *"
                  name="description_fr"
                  value={formData.description_fr}
                  onChange={handleChange}
                  placeholder="Décrivez votre produit..."
                  rows={5}
                  required
                />
                <div className="form-row">
                  <FormInput
                    label="Marque"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Krysto"
                  />
                  <FormInput
                    label="Couleur *"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ex: Bleu océan"
                    required
                  />
                </div>
                <div className="form-row">
                  <FormInput
                    label="Poids *"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Ex: 250g"
                    required
                  />
                  <FormInput
                    label="Dimensions *"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="Ex: 15x15x20 cm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Univers, Sous-univers et Catégorie */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>🌍 Univers et Catégorie</h2>
              </div>
              <div className="detail-card-content">
                {/* NOUVEAU: Section Univers et Sous-univers */}
                <div className="universe-section">
                  <div className="form-row">
                    <FormSelect
                      label="Univers"
                      name="universe"
                      value={formData.universe}
                      onChange={handleChange}
                      options={universeOptions}
                    />
                    <FormSelect
                      label="Sous-univers"
                      name="subUniverse"
                      value={formData.subUniverse}
                      onChange={handleChange}
                      options={subUniverseOptions}
                      disabled={!formData.universe || isLoadingSubUniverses}
                    />
                  </div>
                  {formData.universe &&
                    !formData.subUniverse &&
                    subUniversesData?.subUniverses?.length > 0 && (
                      <p className="hint-text">
                        💡 Sélectionnez un sous-univers pour mieux catégoriser
                        votre produit
                      </p>
                    )}
                  {formData.universe &&
                    subUniversesData?.subUniverses?.length === 0 && (
                      <p className="hint-text warning">
                        ⚠️ Cet univers n'a pas encore de sous-univers
                      </p>
                    )}
                </div>

                <div className="form-row">
                  <FormSelect
                    label="Catégorie *"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categoryOptions}
                  />
                  <FormSelect
                    label="Type de produit *"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    options={
                      productTypeOptions[formData.category]?.map((type) => ({
                        value: type,
                        label: type,
                      })) || []
                    }
                  />
                </div>
                <div className="form-row">
                  <FormSelect
                    label="Type de plastique *"
                    name="plasticType"
                    value={formData.plasticType}
                    onChange={handleChange}
                    options={plasticTypeOptions}
                  />
                  <FormInput
                    label="Origine du plastique *"
                    name="plasticOrigin"
                    value={formData.plasticOrigin}
                    onChange={handleChange}
                    placeholder="Ex: Bouteilles recyclées NC"
                    required
                  />
                </div>
                <FormInput
                  label="Tags (séparés par des virgules)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="recyclé, écolo, fait main"
                />
              </div>
            </div>

            {/* Prix et Stock */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>💰 Prix et Stock</h2>
              </div>
              <div className="detail-card-content">
                <div className="form-row form-row-3">
                  <FormInput
                    label="Prix (XPF) *"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                  <FormInput
                    label="Prix promo (XPF)"
                    name="salePrice"
                    type="number"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="Laisser vide si pas de promo"
                    min="0"
                  />
                  <FormInput
                    label="Stock *"
                    name="countInStock"
                    type="number"
                    value={formData.countInStock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                {formData.salePrice && formData.price && (
                  <div className="promo-preview">
                    <span className="old-price">
                      {Number(formData.price).toLocaleString("fr-FR")} XPF
                    </span>
                    <span className="new-price">
                      {Number(formData.salePrice).toLocaleString("fr-FR")} XPF
                    </span>
                    <span className="discount">
                      -
                      {Math.round(
                        ((formData.price - formData.salePrice) /
                          formData.price) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions d'entretien */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>🧹 Instructions d'entretien</h2>
              </div>
              <div className="detail-card-content">
                <FormTextarea
                  label="Instructions"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                  placeholder="Comment entretenir ce produit..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="product-detail-sidebar">
            {/* Image principale */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>🖼️ Image principale</h2>
              </div>
              <div className="detail-card-content">
                <div className="image-upload-zone">
                  {previewImage ? (
                    <div className="image-preview">
                      <img src={previewImage} alt="Preview" />
                      <button
                        type="button"
                        className="btn-remove-image"
                        onClick={() => {
                          setPreviewImage("");
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                      <span className="upload-icon">📷</span>
                      <span>Cliquez pour ajouter une image</span>
                    </label>
                  )}
                </div>
                {isUploading && (
                  <p className="uploading-text">Téléchargement...</p>
                )}
                <FormInput
                  label="Ou URL de l'image"
                  name="image"
                  value={formData.image}
                  onChange={(e) => {
                    handleChange(e);
                    setPreviewImage(e.target.value);
                  }}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Statut */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>📊 Statut</h2>
              </div>
              <div className="detail-card-content">
                <FormSelect
                  label="Statut du produit"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                />
              </div>
            </div>

            {/* Options */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>⚙️ Options</h2>
              </div>
              <div className="detail-card-content">
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isNewProduct"
                      checked={formData.isNewProduct}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>🆕 Marquer comme nouveau</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span>⭐ Mettre en avant</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="detail-card">
              <div className="detail-card-header">
                <h2>💾 Actions</h2>
              </div>
              <div className="detail-card-content">
                <div className="action-buttons-vertical">
                  <FormButton
                    type="submit"
                    isLoading={isCreating || isUpdating}
                    className="btn-save"
                  >
                    {isEditMode ? "💾 Enregistrer" : "➕ Créer le produit"}
                  </FormButton>
                  {isEditMode && (
                    <FormButton
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: prev.status === "active" ? "draft" : "active",
                        }))
                      }
                    >
                      {formData.status === "active"
                        ? "📝 Passer en brouillon"
                        : "✅ Publier"}
                    </FormButton>
                  )}
                </div>
              </div>
            </div>

            {/* Infos techniques (mode édition) */}
            {isEditMode && product && (
              <div className="detail-card">
                <div className="detail-card-header">
                  <h2>ℹ️ Informations</h2>
                </div>
                <div className="detail-card-content">
                  <div className="info-list">
                    <div className="info-row">
                      <span className="info-label">ID</span>
                      <span className="info-value">{product._id}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Slug</span>
                      <span className="info-value">{product.slug}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Univers</span>
                      <span className="info-value">
                        {product.universe?.name || "Aucun"}
                      </span>
                    </div>
                    {/* NOUVEAU: Afficher le sous-univers */}
                    <div className="info-row">
                      <span className="info-label">Sous-univers</span>
                      <span className="info-value">
                        {product.subUniverse?.name || "Aucun"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Créé le</span>
                      <span className="info-value">
                        {new Date(product.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Modifié le</span>
                      <span className="info-value">
                        {new Date(product.updatedAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Note</span>
                      <span className="info-value">
                        ⭐ {product.rating}/5 ({product.numReviews} avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductDetailsScreen;
