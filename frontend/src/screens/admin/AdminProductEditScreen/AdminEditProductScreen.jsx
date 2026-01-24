import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiImage,
  FiUpload,
  FiTrash2,
  FiPlus,
  FiPackage,
  FiInfo,
  FiDollarSign,
  FiLayers,
  FiTag,
  FiSettings,
  FiChevronRight,
  FiRefreshCw,
  FiEye,
  FiCheckCircle,
  FiEdit2,
  FiList,
} from "react-icons/fi";
import {
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useUploadProductImagesMutation,
} from "../../../slices/productApiSlice";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import { useGetSubUniversesByUniverseQuery } from "../../../slices/subuniverseApiSlice";
import { toast } from "react-toastify";
import "./AdminEditProductScreen.css";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Refs pour les inputs file
  const mainImageRef = useRef(null);
  const galleryImageRef = useRef(null);

  // State du formulaire
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
    category: "",
    price: "",
    salePrice: "",
    countInStock: 0,
    careInstructions: "",
    isNewProduct: false,
    isFeatured: false,
    isDestockage: false,
    isComingSoon: false,
    availableDate: "",
    status: "draft",
    tags: [],
    universe: "",
    subUniverse: "",
  });

  // State pour les tags
  const [tagInput, setTagInput] = useState("");

  // State pour la modal de succès
  const [successModal, setSuccessModal] = useState({
    open: false,
    isCreate: false,
    productId: null,
    productName: "",
  });

  // Queries
  const {
    data: product,
    isLoading: isLoadingProduct,
    isError,
    error,
    refetch,
  } = useGetProductByIdQuery(id, { skip: !isEditMode });

  const { data: universes } = useGetActiveUniversesQuery();
  const { data: subUniversesData } = useGetSubUniversesByUniverseQuery(
    { universeId: formData.universe },
    { skip: !formData.universe },
  );

  // Mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImage, { isLoading: isUploadingMain }] =
    useUploadProductImageMutation();
  const [uploadImages, { isLoading: isUploadingGallery }] =
    useUploadProductImagesMutation();

  const isSubmitting = isCreating || isUpdating;
  const isUploading = isUploadingMain || isUploadingGallery;

  // Charger les données du produit en mode édition
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
        category: product.category || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        countInStock: product.countInStock || 0,
        careInstructions: product.careInstructions || "",
        isNewProduct: product.isNewProduct || false,
        isFeatured: product.isFeatured || false,
        isDestockage: product.isDestockage || false,
        isComingSoon: product.isComingSoon || false,
        availableDate: product.availableDate
          ? new Date(product.availableDate).toISOString().split("T")[0]
          : "",
        status: product.status || "draft",
        tags: product.tags || [],
        universe: product.universe?._id || "",
        subUniverse: product.subUniverse?._id || "",
      });
    }
  }, [product, isEditMode]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUniverseChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      universe: e.target.value,
      subUniverse: "",
    }));
  };

  // Upload image principale
  const handleMainImageUpload = async (e) => {
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

  // Upload images galerie
  const handleGalleryImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append("images", files[i]);
    }

    try {
      const res = await uploadImages(formDataUpload).unwrap();
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...res.images],
      }));
      toast.success(`${res.images.length} image(s) uploadée(s)`);
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de l'upload");
    }
  };

  // Supprimer image de la galerie
  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Supprimer image principale
  const handleRemoveMainImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
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

  // Handlers pour la modal de succès
  const handleContinueEditing = () => {
    setSuccessModal({
      open: false,
      isCreate: false,
      productId: null,
      productName: "",
    });
    if (isEditMode) {
      refetch();
    }
  };

  const handleGoToList = () => {
    setSuccessModal({
      open: false,
      isCreate: false,
      productId: null,
      productName: "",
    });
    navigate("/admin/products");
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Le nom du produit est requis");
      return;
    }
    if (!formData.description_fr.trim()) {
      toast.error("La description est requise");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Le prix doit être supérieur à 0");
      return;
    }
    if (!formData.category) {
      toast.error("La catégorie est requise");
      return;
    }
    if (!formData.image) {
      toast.error("L'image principale est requise");
      return;
    }
    if (!formData.color.trim()) {
      toast.error("La couleur est requise");
      return;
    }
    if (!formData.weight.trim()) {
      toast.error("Le poids est requis");
      return;
    }
    if (!formData.dimensions.trim()) {
      toast.error("Les dimensions sont requises");
      return;
    }
    if (!formData.plasticOrigin.trim()) {
      toast.error("L'origine du plastique est requise");
      return;
    }

    const productData = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      countInStock: Number(formData.countInStock),
      universe: formData.universe || null,
      subUniverse: formData.subUniverse || null,
      availableDate: formData.availableDate || null,
    };

    try {
      if (isEditMode) {
        await updateProduct({ id, ...productData }).unwrap();
        setSuccessModal({
          open: true,
          isCreate: false,
          productId: id,
          productName: formData.name,
        });
      } else {
        const result = await createProduct(productData).unwrap();
        setSuccessModal({
          open: true,
          isCreate: true,
          productId: result._id,
          productName: formData.name,
        });
        navigate(`/admin/products/${result._id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Une erreur est survenue");
    }
  };

  // Loading state
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="product-edit">
        <div className="product-edit__loading">
          <FiRefreshCw className="spin" />
          <span>Chargement du produit...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (isEditMode && isError) {
    return (
      <div className="product-edit">
        <div className="product-edit__loading">
          <FiInfo />
          <span>Erreur : {error?.data?.message || "Produit non trouvé"}</span>
          <Link to="/admin/products" className="btn btn--primary">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-edit">
      {/* Breadcrumb */}
      <div className="product-edit__breadcrumb">
        <Link to="/admin/dashboard">Dashboard</Link>
        <FiChevronRight />
        <Link to="/admin/products">Produits</Link>
        <FiChevronRight />
        <span>{isEditMode ? "Modifier" : "Nouveau produit"}</span>
      </div>

      {/* Header */}
      <div className="product-edit__header">
        <div className="product-edit__header-top">
          <div>
            <h1>{isEditMode ? "Modifier le produit" : "Nouveau produit"}</h1>
            <p>
              {isEditMode
                ? `Modification de "${product?.name}"`
                : "Remplissez les informations du produit"}
            </p>
          </div>
          <div className="product-edit__header-actions">
            {isEditMode && (
              <Link
                to={`/product/${product?.slug || id}`}
                target="_blank"
                className="btn btn--outline"
              >
                <FiEye />
                <span>Voir</span>
              </Link>
            )}
            <Link to="/admin/products" className="btn btn--secondary">
              <FiX />
              <span>Annuler</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="product-edit__form">
          {/* Main Content */}
          <div className="product-edit__main">
            {/* Informations de base */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiPackage /> Informations générales
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="form-group">
                  <label>
                    Nom du produit <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Porte-savon Océan"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    name="description_fr"
                    value={formData.description_fr}
                    onChange={handleChange}
                    placeholder="Décrivez votre produit en détail..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Marque</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Krysto"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Catégorie <span className="required">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Maison & Déco">Maison & Déco</option>
                      <option value="Bazar">Bazar</option>
                      <option value="Jeux">Jeux</option>
                      <option value="Bureautique">Bureautique</option>
                      <option value="Bijoux">Bijoux</option>
                      <option value="Mode & beauté">Mode & beauté</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiImage /> Images
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="image-upload">
                  <label>
                    Image principale <span className="required">*</span>
                  </label>
                  <div className="image-upload__main">
                    <div
                      className={`image-upload__preview ${!formData.image ? "image-upload__preview--empty" : ""}`}
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
                    <div className="image-upload__actions">
                      <input
                        type="file"
                        ref={mainImageRef}
                        className="image-upload__input"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                      />
                      <button
                        type="button"
                        className="image-upload__btn image-upload__btn--primary"
                        onClick={() => mainImageRef.current?.click()}
                        disabled={isUploading}
                      >
                        <FiUpload />
                        {isUploadingMain ? "Upload..." : "Choisir une image"}
                      </button>
                      {formData.image && (
                        <button
                          type="button"
                          className="image-upload__btn image-upload__btn--danger"
                          onClick={handleRemoveMainImage}
                        >
                          <FiTrash2 />
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Galerie */}
                  <div style={{ marginTop: "var(--space-lg)" }}>
                    <label>Galerie d'images (optionnel)</label>
                    <div className="image-gallery">
                      {formData.images.map((img, index) => (
                        <div key={index} className="image-gallery__item">
                          <img src={img} alt={`Galerie ${index + 1}`} />
                          <button
                            type="button"
                            className="image-gallery__item-remove"
                            onClick={() => handleRemoveGalleryImage(index)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                      <input
                        type="file"
                        ref={galleryImageRef}
                        className="image-upload__input"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImageUpload}
                      />
                      <div
                        className="image-gallery__add"
                        onClick={() => galleryImageRef.current?.click()}
                      >
                        <FiPlus />
                        <span>
                          {isUploadingGallery ? "Upload..." : "Ajouter"}
                        </span>
                      </div>
                    </div>
                    <p className="form-group__hint">
                      Vous pouvez ajouter jusqu'à 5 images supplémentaires.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiInfo /> Caractéristiques
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="form-row form-row--3">
                  <div className="form-group">
                    <label>
                      Couleur <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ex: Bleu océan"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Poids <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Ex: 150g"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Dimensions <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="Ex: 10x5x2 cm"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Type de plastique <span className="required">*</span>
                    </label>
                    <select
                      name="plasticType"
                      value={formData.plasticType}
                      onChange={handleChange}
                    >
                      <option value="HDPE">HDPE</option>
                      <option value="PET">PET</option>
                      <option value="PP">PP</option>
                      <option value="LDPE">LDPE</option>
                      <option value="PVC">PVC</option>
                      <option value="PS">PS</option>
                      <option value="HDPE/PP">HDPE/PP</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      Origine du plastique <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="plasticOrigin"
                      value={formData.plasticOrigin}
                      onChange={handleChange}
                      placeholder="Ex: Bouteilles recyclées de Nouméa"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Instructions d'entretien</label>
                  <textarea
                    name="careInstructions"
                    value={formData.careInstructions}
                    onChange={handleChange}
                    placeholder="Conseils d'entretien pour le produit..."
                    style={{ minHeight: "80px" }}
                  />
                </div>
              </div>
            </div>

            {/* Prix & Stock */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiDollarSign /> Prix & Stock
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="form-row form-row--3">
                  <div className="form-group">
                    <label>
                      Prix <span className="required">*</span>
                    </label>
                    <div className="price-input">
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                      />
                      <span className="price-input__currency">XPF</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Prix promo</label>
                    <div className="price-input">
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                      />
                      <span className="price-input__currency">XPF</span>
                    </div>
                    <p className="form-group__hint">
                      Laissez vide si pas de promotion
                    </p>
                  </div>
                  <div className="form-group">
                    <label>
                      Stock <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      name="countInStock"
                      value={formData.countInStock}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="product-edit__sidebar">
            {/* Statut */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiSettings /> Statut
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="status-select">
                  <label
                    className={`status-select__option ${formData.status === "draft" ? "status-select__option--draft" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={handleChange}
                    />
                    Brouillon
                  </label>
                  <label
                    className={`status-select__option ${formData.status === "active" ? "status-select__option--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === "active"}
                      onChange={handleChange}
                    />
                    Actif
                  </label>
                  <label
                    className={`status-select__option ${formData.status === "archived" ? "status-select__option--archived" : ""}`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="archived"
                      checked={formData.status === "archived"}
                      onChange={handleChange}
                    />
                    Archivé
                  </label>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiLayers /> Classification
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="form-group">
                  <label>Univers</label>
                  <select
                    name="universe"
                    value={formData.universe}
                    onChange={handleUniverseChange}
                  >
                    <option value="">Aucun univers</option>
                    {universes?.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sous-univers</label>
                  <select
                    name="subUniverse"
                    value={formData.subUniverse}
                    onChange={handleChange}
                    disabled={!formData.universe}
                  >
                    <option value="">Aucun sous-univers</option>
                    {subUniversesData?.subUniverses?.map((su) => (
                      <option key={su._id} value={su._id}>
                        {su.name}
                      </option>
                    ))}
                  </select>
                  {!formData.universe && (
                    <p className="form-group__hint">
                      Sélectionnez d'abord un univers
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiTag /> Options
                </h2>
              </div>
              <div className="product-edit__card-body">
                <div className="toggle-group">
                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isNewProduct"
                        checked={formData.isNewProduct}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch__slider"></span>
                    </label>
                    <span className="toggle-item__label">Nouveau produit</span>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch__slider"></span>
                    </label>
                    <span className="toggle-item__label">Produit vedette</span>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isDestockage"
                        checked={formData.isDestockage}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch__slider"></span>
                    </label>
                    <span className="toggle-item__label">Destockage</span>
                  </div>

                  <div className="toggle-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="isComingSoon"
                        checked={formData.isComingSoon}
                        onChange={handleChange}
                      />
                      <span className="toggle-switch__slider"></span>
                    </label>
                    <span className="toggle-item__label">
                      Bientôt disponible
                    </span>
                  </div>
                </div>

                {formData.isComingSoon && (
                  <div
                    className="form-group"
                    style={{ marginTop: "var(--space-md)" }}
                  >
                    <label>Date de disponibilité</label>
                    <input
                      type="date"
                      name="availableDate"
                      value={formData.availableDate}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="product-edit__card">
              <div className="product-edit__card-header">
                <h2>
                  <FiTag /> Tags
                </h2>
              </div>
              <div className="product-edit__card-body">
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
                  Appuyez sur Entrée pour ajouter un tag
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="product-edit__actions">
          <div className="product-edit__actions-secondary">
            <Link to="/admin/products" className="btn btn--outline">
              Annuler
            </Link>
          </div>
          <div className="product-edit__actions-main">
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
                  : "Créer le produit"}
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
                  ? "Produit créé !"
                  : "Produit mis à jour !"}
              </h3>
            </div>
            <div className="modal__body">
              <p>
                Le produit <strong>"{successModal.productName}"</strong> a été{" "}
                {successModal.isCreate ? "créé" : "mis à jour"} avec succès.
              </p>
              <p className="modal__subtitle">Que souhaitez-vous faire ?</p>
            </div>
            <div className="modal__actions modal__actions--stacked">
              <button
                className="btn btn--primary btn--block"
                onClick={handleContinueEditing}
              >
                <FiEdit2 />
                Continuer à modifier
              </button>
              <button
                className="btn btn--secondary btn--block"
                onClick={handleGoToList}
              >
                <FiList />
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEditScreen;
