// import { useState, useEffect } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   FiPlus,
//   FiSearch,
//   FiEdit2,
//   FiTrash2,
//   FiEye,
//   FiCopy,
//   FiPackage,
//   FiAlertCircle,
//   FiCheckCircle,
//   FiArchive,
//   FiChevronLeft,
//   FiChevronRight,
//   FiRefreshCw,
// } from "react-icons/fi";
// import {
//   useGetProductsQuery,
//   useGetProductStatsQuery,
//   useDeleteProductMutation,
//   useDuplicateProductMutation,
//   useToggleProductFeaturedMutation,
// } from "../../../slices/productApiSlice";
// import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
// import { useGetActiveSubUniversesQuery } from "../../../slices/subuniverseApiSlice";
// import { toast } from "react-toastify";
// import "./ProductListScreen.css";

// const ProductListScreen = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   // États des filtres
//   const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
//   const [status, setStatus] = useState(searchParams.get("status") || "");
//   const [universe, setUniverse] = useState(searchParams.get("universe") || "");
//   const [subUniverse, setSubUniverse] = useState(
//     searchParams.get("subUniverse") || "",
//   );
//   const [stockFilter, setStockFilter] = useState(
//     searchParams.get("stock") || "",
//   );
//   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
//   const pageSize = 10;

//   // État pour la modal de suppression
//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     product: null,
//   });

//   // Queries - Utilise pageNumber et pageSize (comme attendu par le backend)
//   const {
//     data: productsData,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetProductsQuery({
//     keyword: keyword || undefined,
//     status: status || undefined,
//     universe: universe || undefined,
//     subUniverse: subUniverse || undefined,
//     stock: stockFilter || undefined,
//     pageNumber: page,
//     pageSize: pageSize,
//   });

//   const { data: productStats } = useGetProductStatsQuery();
//   const { data: universesData } = useGetActiveUniversesQuery();
//   const { data: subUniversesData } = useGetActiveSubUniversesQuery({
//     universeId: universe,
//   });

//   // Mutations
//   const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
//   const [duplicateProduct, { isLoading: isDuplicating }] =
//     useDuplicateProductMutation();
//   const [toggleFeatured] = useToggleProductFeaturedMutation();

//   // Mettre à jour l'URL quand les filtres changent
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (keyword) params.set("keyword", keyword);
//     if (status) params.set("status", status);
//     if (universe) params.set("universe", universe);
//     if (subUniverse) params.set("subUniverse", subUniverse);
//     if (stockFilter) params.set("stock", stockFilter);
//     if (page > 1) params.set("page", page);
//     setSearchParams(params);
//   }, [
//     keyword,
//     status,
//     universe,
//     subUniverse,
//     stockFilter,
//     page,
//     setSearchParams,
//   ]);

//   // Reset page quand les filtres changent
//   useEffect(() => {
//     setPage(1);
//   }, [keyword, status, universe, subUniverse, stockFilter]);

//   // Handlers
//   const handleSearch = (e) => {
//     setKeyword(e.target.value);
//   };

//   const handleResetFilters = () => {
//     setKeyword("");
//     setStatus("");
//     setUniverse("");
//     setSubUniverse("");
//     setStockFilter("");
//     setPage(1);
//   };

//   const handleDelete = async () => {
//     if (!deleteModal.product) return;
//     try {
//       await deleteProduct(deleteModal.product._id).unwrap();
//       toast.success("Produit supprimé avec succès");
//       setDeleteModal({ open: false, product: null });
//     } catch (err) {
//       toast.error(err?.data?.message || "Erreur lors de la suppression");
//     }
//   };

//   const handleDuplicate = async (productId) => {
//     try {
//       await duplicateProduct(productId).unwrap();
//       toast.success("Produit dupliqué avec succès");
//     } catch (err) {
//       toast.error(err?.data?.message || "Erreur lors de la duplication");
//     }
//   };

//   // Formatage du prix
//   const formatPrice = (price) => {
//     if (!price) return "0 XPF";
//     return `${price.toLocaleString("fr-FR")} XPF`;
//   };

//   // Indicateur de stock
//   const getStockIndicator = (stock) => {
//     if (stock === 0) return { class: "out", label: "Rupture" };
//     if (stock <= 5) return { class: "low", label: "Faible" };
//     if (stock <= 20) return { class: "medium", label: "Moyen" };
//     return { class: "high", label: "OK" };
//   };

//   // Obtenir le label du statut
//   const getStatusLabel = (statusValue) => {
//     const labels = {
//       active: "Actif",
//       draft: "Brouillon",
//       archived: "Archivé",
//     };
//     return labels[statusValue] || statusValue;
//   };

//   // Calcul de la pagination
//   const totalPages = productsData?.pages || 1;
//   const totalProducts = productsData?.total || 0;
//   const startIndex = totalProducts > 0 ? (page - 1) * pageSize + 1 : 0;
//   const endIndex = Math.min(page * pageSize, totalProducts);

//   return (
//     <div className="product-list">
//       {/* Header */}
//       <div className="product-list__header">
//         <div className="product-list__header-top">
//           <div>
//             <h1>Produits</h1>
//             <p>Gérez votre catalogue de produits</p>
//           </div>
//           <div className="product-list__header-actions">
//             <button
//               className="btn btn--secondary btn--icon"
//               onClick={refetch}
//               title="Rafraîchir"
//             >
//               <FiRefreshCw />
//             </button>
//             <Link to="/admin/products/create" className="btn btn--primary">
//               <FiPlus />
//               <span>Nouveau produit</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Stats rapides */}
//       <div className="product-list__quick-stats">
//         <div className="quick-stat">
//           <div className="quick-stat__icon quick-stat__icon--primary">
//             <FiPackage />
//           </div>
//           <div className="quick-stat__content">
//             <span className="quick-stat__value">
//               {productStats?.total || 0}
//             </span>
//             <span className="quick-stat__label">Total</span>
//           </div>
//         </div>
//         <div className="quick-stat">
//           <div className="quick-stat__icon quick-stat__icon--success">
//             <FiCheckCircle />
//           </div>
//           <div className="quick-stat__content">
//             <span className="quick-stat__value">
//               {productStats?.active || 0}
//             </span>
//             <span className="quick-stat__label">Actifs</span>
//           </div>
//         </div>
//         <div className="quick-stat">
//           <div className="quick-stat__icon quick-stat__icon--warning">
//             <FiAlertCircle />
//           </div>
//           <div className="quick-stat__content">
//             <span className="quick-stat__value">
//               {productStats?.draft || 0}
//             </span>
//             <span className="quick-stat__label">Brouillons</span>
//           </div>
//         </div>
//         <div className="quick-stat">
//           <div className="quick-stat__icon quick-stat__icon--error">
//             <FiArchive />
//           </div>
//           <div className="quick-stat__content">
//             <span className="quick-stat__value">
//               {productStats?.outOfStock || 0}
//             </span>
//             <span className="quick-stat__label">Rupture</span>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="product-list__filters">
//         <div className="product-list__search">
//           <FiSearch className="product-list__search-icon" />
//           <input
//             type="text"
//             placeholder="Rechercher un produit..."
//             value={keyword}
//             onChange={handleSearch}
//           />
//         </div>

//         <div className="product-list__filter-row">
//           <div className="product-list__filter-group">
//             <label>Statut</label>
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="">Tous les statuts</option>
//               <option value="active">Actif</option>
//               <option value="draft">Brouillon</option>
//               <option value="archived">Archivé</option>
//             </select>
//           </div>

//           <div className="product-list__filter-group">
//             <label>Univers</label>
//             <select
//               value={universe}
//               onChange={(e) => {
//                 setUniverse(e.target.value);
//                 setSubUniverse("");
//               }}
//             >
//               <option value="">Tous les univers</option>
//               {universesData?.map((u) => (
//                 <option key={u._id} value={u._id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="product-list__filter-group">
//             <label>Sous-univers</label>
//             <select
//               value={subUniverse}
//               onChange={(e) => setSubUniverse(e.target.value)}
//               disabled={!universe}
//             >
//               <option value="">Tous les sous-univers</option>
//               {subUniversesData?.map((su) => (
//                 <option key={su._id} value={su._id}>
//                   {su.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="product-list__filter-group">
//             <label>Stock</label>
//             <select
//               value={stockFilter}
//               onChange={(e) => setStockFilter(e.target.value)}
//             >
//               <option value="">Tous</option>
//               <option value="low">Stock faible</option>
//               <option value="out">Rupture</option>
//               <option value="available">Disponible</option>
//             </select>
//           </div>
//         </div>

//         <div className="product-list__filter-actions">
//           <button
//             className="btn btn--outline btn--sm"
//             onClick={handleResetFilters}
//           >
//             Réinitialiser
//           </button>
//         </div>
//       </div>

//       {/* Contenu principal */}
//       {isLoading ? (
//         <div className="product-list__loader">
//           <FiRefreshCw className="spin" />
//           <span>Chargement des produits...</span>
//         </div>
//       ) : isError ? (
//         <div className="product-list__empty">
//           <FiAlertCircle className="product-list__empty-icon" />
//           <h3>Erreur de chargement</h3>
//           <p>Impossible de charger les produits. Veuillez réessayer.</p>
//           <button className="btn btn--primary" onClick={refetch}>
//             Réessayer
//           </button>
//         </div>
//       ) : productsData?.products?.length === 0 ? (
//         <div className="product-list__table-container">
//           <div className="product-list__empty">
//             <FiPackage className="product-list__empty-icon" />
//             <h3>Aucun produit trouvé</h3>
//             <p>
//               {keyword || status || universe || stockFilter
//                 ? "Aucun produit ne correspond à vos critères de recherche."
//                 : "Commencez par créer votre premier produit."}
//             </p>
//             {keyword || status || universe || stockFilter ? (
//               <button
//                 className="btn btn--secondary"
//                 onClick={handleResetFilters}
//               >
//                 Réinitialiser les filtres
//               </button>
//             ) : (
//               <Link to="/admin/products/create" className="btn btn--primary">
//                 <FiPlus /> Créer un produit
//               </Link>
//             )}
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Tableau desktop */}
//           <div className="product-list__table-container">
//             <table className="product-list__table">
//               <thead>
//                 <tr>
//                   <th>Produit</th>
//                   <th>Prix</th>
//                   <th>Stock</th>
//                   <th>Catégorie</th>
//                   <th>Badges</th>
//                   <th>Statut</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productsData?.products?.map((product) => {
//                   const stockInfo = getStockIndicator(product.countInStock);
//                   return (
//                     <tr key={product._id}>
//                       {/* Produit */}
//                       <td>
//                         <div className="product-cell">
//                           <img
//                             src={product.image || "/images/placeholder.png"}
//                             alt={product.name}
//                             className="product-cell__image"
//                           />
//                           <div className="product-cell__info">
//                             <div
//                               className="product-cell__name"
//                               title={product.name}
//                             >
//                               {product.name}
//                             </div>
//                             <div className="product-cell__sku">
//                               {product.brand}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Prix */}
//                       <td>
//                         <div className="price-cell">
//                           {product.isOnSale && product.salePrice ? (
//                             <>
//                               <span className="price-cell__current price-cell__promo">
//                                 {formatPrice(product.salePrice)}
//                               </span>
//                               <span className="price-cell__original">
//                                 {formatPrice(product.price)}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="price-cell__current">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Stock */}
//                       <td>
//                         <div className="stock-cell">
//                           <span
//                             className={`stock-cell__indicator stock-cell__indicator--${stockInfo.class}`}
//                           ></span>
//                           <span>{product.countInStock}</span>
//                         </div>
//                       </td>

//                       {/* Catégorie */}
//                       <td>{product.category || "-"}</td>

//                       {/* Badges */}
//                       <td>
//                         <div className="product-badges">
//                           {product.isNewProduct && (
//                             <span className="product-badge product-badge--new">
//                               Nouveau
//                             </span>
//                           )}
//                           {product.isFeatured && (
//                             <span className="product-badge product-badge--featured">
//                               Vedette
//                             </span>
//                           )}
//                           {product.isDestockage && (
//                             <span className="product-badge product-badge--destockage">
//                               Destockage
//                             </span>
//                           )}
//                           {product.isComingSoon && (
//                             <span className="product-badge product-badge--coming">
//                               Bientôt
//                             </span>
//                           )}
//                           {product.isOnSale && (
//                             <span className="product-badge product-badge--promo">
//                               Promo
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       {/* Statut */}
//                       <td>
//                         <span
//                           className={`status-badge status-badge--${product.status}`}
//                         >
//                           {getStatusLabel(product.status)}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td>
//                         <div className="actions-cell">
//                           <button
//                             className="action-btn action-btn--view"
//                             onClick={() =>
//                               navigate(`/admin/products/${product._id}`)
//                             }
//                             title="Voir"
//                           >
//                             <FiEye />
//                           </button>
//                           <button
//                             className="action-btn action-btn--edit"
//                             onClick={() =>
//                               navigate(`/admin/products/${product._id}/edit`)
//                             }
//                             title="Modifier"
//                           >
//                             <FiEdit2 />
//                           </button>
//                           <button
//                             className="action-btn action-btn--duplicate"
//                             onClick={() => handleDuplicate(product._id)}
//                             disabled={isDuplicating}
//                             title="Dupliquer"
//                           >
//                             <FiCopy />
//                           </button>
//                           <button
//                             className="action-btn action-btn--delete"
//                             onClick={() =>
//                               setDeleteModal({ open: true, product })
//                             }
//                             title="Supprimer"
//                           >
//                             <FiTrash2 />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="product-list__pagination">
//                 <span className="pagination__info">
//                   Affichage {startIndex}-{endIndex} sur {totalProducts} produits
//                 </span>
//                 <div className="pagination__controls">
//                   <button
//                     className="pagination__btn"
//                     onClick={() => setPage(page - 1)}
//                     disabled={page === 1}
//                   >
//                     <FiChevronLeft />
//                   </button>

//                   {[...Array(totalPages)].map((_, index) => {
//                     const pageNum = index + 1;
//                     if (
//                       pageNum === 1 ||
//                       pageNum === totalPages ||
//                       (pageNum >= page - 1 && pageNum <= page + 1)
//                     ) {
//                       return (
//                         <button
//                           key={pageNum}
//                           className={`pagination__btn ${page === pageNum ? "pagination__btn--active" : ""}`}
//                           onClick={() => setPage(pageNum)}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     } else if (pageNum === page - 2 || pageNum === page + 2) {
//                       return <span key={pageNum}>...</span>;
//                     }
//                     return null;
//                   })}

//                   <button
//                     className="pagination__btn"
//                     onClick={() => setPage(page + 1)}
//                     disabled={page === totalPages}
//                   >
//                     <FiChevronRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Cartes mobile */}
//           <div className="product-list__mobile-cards">
//             {productsData?.products?.map((product) => {
//               const stockInfo = getStockIndicator(product.countInStock);
//               return (
//                 <div key={product._id} className="product-mobile-card">
//                   <div className="product-mobile-card__header">
//                     <img
//                       src={product.image || "/images/placeholder.png"}
//                       alt={product.name}
//                       className="product-mobile-card__image"
//                     />
//                     <div className="product-mobile-card__info">
//                       <div className="product-mobile-card__name">
//                         {product.name}
//                       </div>
//                       <div className="product-mobile-card__meta">
//                         <span>{product.brand}</span>
//                         <span
//                           className={`status-badge status-badge--${product.status}`}
//                         >
//                           {getStatusLabel(product.status)}
//                         </span>
//                       </div>
//                       <div className="product-mobile-card__badges product-badges">
//                         {product.isNewProduct && (
//                           <span className="product-badge product-badge--new">
//                             Nouveau
//                           </span>
//                         )}
//                         {product.isFeatured && (
//                           <span className="product-badge product-badge--featured">
//                             Vedette
//                           </span>
//                         )}
//                         {product.isDestockage && (
//                           <span className="product-badge product-badge--destockage">
//                             Destockage
//                           </span>
//                         )}
//                         {product.isComingSoon && (
//                           <span className="product-badge product-badge--coming">
//                             Bientôt
//                           </span>
//                         )}
//                         {product.isOnSale && (
//                           <span className="product-badge product-badge--promo">
//                             Promo
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="product-mobile-card__body">
//                     <div className="product-mobile-card__stat">
//                       <div className="product-mobile-card__stat-label">
//                         Prix
//                       </div>
//                       <div className="product-mobile-card__stat-value">
//                         {product.isOnSale && product.salePrice
//                           ? formatPrice(product.salePrice)
//                           : formatPrice(product.price)}
//                       </div>
//                     </div>
//                     <div className="product-mobile-card__stat">
//                       <div className="product-mobile-card__stat-label">
//                         Stock
//                       </div>
//                       <div className="product-mobile-card__stat-value">
//                         <div className="stock-cell">
//                           <span
//                             className={`stock-cell__indicator stock-cell__indicator--${stockInfo.class}`}
//                           ></span>
//                           {product.countInStock}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="product-mobile-card__stat">
//                       <div className="product-mobile-card__stat-label">
//                         Catégorie
//                       </div>
//                       <div className="product-mobile-card__stat-value">
//                         {product.category || "-"}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="product-mobile-card__actions">
//                     <button
//                       className="action-btn action-btn--view"
//                       onClick={() => navigate(`/admin/products/${product._id}`)}
//                     >
//                       <FiEye />
//                     </button>
//                     <button
//                       className="action-btn action-btn--edit"
//                       onClick={() =>
//                         navigate(`/admin/products/${product._id}/edit`)
//                       }
//                     >
//                       <FiEdit2 />
//                     </button>
//                     <button
//                       className="action-btn action-btn--duplicate"
//                       onClick={() => handleDuplicate(product._id)}
//                       disabled={isDuplicating}
//                     >
//                       <FiCopy />
//                     </button>
//                     <button
//                       className="action-btn action-btn--delete"
//                       onClick={() => setDeleteModal({ open: true, product })}
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Pagination mobile */}
//             {totalPages > 1 && (
//               <div className="product-list__pagination">
//                 <span className="pagination__info">
//                   Page {page} sur {totalPages}
//                 </span>
//                 <div className="pagination__controls">
//                   <button
//                     className="pagination__btn"
//                     onClick={() => setPage(page - 1)}
//                     disabled={page === 1}
//                   >
//                     <FiChevronLeft /> Précédent
//                   </button>
//                   <button
//                     className="pagination__btn"
//                     onClick={() => setPage(page + 1)}
//                     disabled={page === totalPages}
//                   >
//                     Suivant <FiChevronRight />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Modal de confirmation de suppression */}
//       {deleteModal.open && (
//         <div
//           className="modal-overlay"
//           onClick={() => setDeleteModal({ open: false, product: null })}
//         >
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <div className="modal__header">
//               <div className="modal__icon modal__icon--danger">
//                 <FiTrash2 />
//               </div>
//               <h3 className="modal__title">Supprimer le produit</h3>
//             </div>
//             <div className="modal__body">
//               <p>
//                 Êtes-vous sûr de vouloir supprimer le produit{" "}
//                 <strong>"{deleteModal.product?.name}"</strong> ?
//               </p>
//               <p>Cette action est irréversible.</p>
//             </div>
//             <div className="modal__actions">
//               <button
//                 className="btn btn--secondary"
//                 onClick={() => setDeleteModal({ open: false, product: null })}
//               >
//                 Annuler
//               </button>
//               <button
//                 className="btn btn--danger"
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? "Suppression..." : "Supprimer"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductListScreen;

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCopy,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiArchive,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import {
  useGetProductsQuery,
  useGetProductStatsQuery,
  useDeleteProductMutation,
  useDuplicateProductMutation,
} from "../../../slices/productApiSlice";
import { useGetActiveUniversesQuery } from "../../../slices/universeApiSlice";
import { useGetSubUniversesByUniverseQuery } from "../../../slices/subuniverseApiSlice";
import { toast } from "react-toastify";
import "./ProductListScreen.css";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // États des filtres
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [universe, setUniverse] = useState(searchParams.get("universe") || "");
  const [subUniverse, setSubUniverse] = useState(
    searchParams.get("subUniverse") || "",
  );
  const [stockFilter, setStockFilter] = useState(
    searchParams.get("stock") || "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const pageSize = 10;

  // État pour la modal de suppression
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    product: null,
  });

  // Queries
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({
    keyword: keyword || undefined,
    status: status || undefined,
    universe: universe || undefined,
    subUniverse: subUniverse || undefined,
    stock: stockFilter || undefined,
    pageNumber: page,
    pageSize: pageSize,
  });

  const { data: productStats } = useGetProductStatsQuery();
  const { data: universesData } = useGetActiveUniversesQuery();
  const { data: subUniversesData } = useGetSubUniversesByUniverseQuery(
    { universeId: universe },
    { skip: !universe },
  );

  // Mutations
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [duplicateProduct, { isLoading: isDuplicating }] =
    useDuplicateProductMutation();

  // Mettre à jour l'URL quand les filtres changent
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (status) params.set("status", status);
    if (universe) params.set("universe", universe);
    if (subUniverse) params.set("subUniverse", subUniverse);
    if (stockFilter) params.set("stock", stockFilter);
    if (page > 1) params.set("page", page);
    setSearchParams(params);
  }, [
    keyword,
    status,
    universe,
    subUniverse,
    stockFilter,
    page,
    setSearchParams,
  ]);

  // Reset page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [keyword, status, universe, subUniverse, stockFilter]);

  // Handlers
  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setStatus("");
    setUniverse("");
    setSubUniverse("");
    setStockFilter("");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    try {
      await deleteProduct(deleteModal.product._id).unwrap();
      toast.success("Produit supprimé avec succès");
      setDeleteModal({ open: false, product: null });
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (productId) => {
    try {
      await duplicateProduct(productId).unwrap();
      toast.success("Produit dupliqué avec succès");
    } catch (err) {
      toast.error(err?.data?.message || "Erreur lors de la duplication");
    }
  };

  // Formatage du prix
  const formatPrice = (price) => {
    if (!price) return "0 XPF";
    return `${price.toLocaleString("fr-FR")} XPF`;
  };

  // Indicateur de stock
  const getStockIndicator = (stock) => {
    if (stock === 0) return { class: "out", label: "Rupture" };
    if (stock <= 5) return { class: "low", label: "Faible" };
    if (stock <= 20) return { class: "medium", label: "Moyen" };
    return { class: "high", label: "OK" };
  };

  // Obtenir le label du statut
  const getStatusLabel = (statusValue) => {
    const labels = {
      active: "Actif",
      draft: "Brouillon",
      archived: "Archivé",
    };
    return labels[statusValue] || statusValue;
  };

  // Calcul de la pagination
  const totalPages = productsData?.pages || 1;
  const totalProducts = productsData?.total || 0;
  const startIndex = totalProducts > 0 ? (page - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(page * pageSize, totalProducts);

  return (
    <div className="product-list">
      {/* Header */}
      <div className="product-list__header">
        <div className="product-list__header-top">
          <div>
            <h1>Produits</h1>
            <p>Gérez votre catalogue de produits</p>
          </div>
          <div className="product-list__header-actions">
            <button
              className="btn btn--secondary btn--icon"
              onClick={refetch}
              title="Rafraîchir"
            >
              <FiRefreshCw />
            </button>
            <Link to="/admin/products/create" className="btn btn--primary">
              <FiPlus />
              <span>Nouveau produit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="product-list__quick-stats">
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--primary">
            <FiPackage />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {productStats?.total || 0}
            </span>
            <span className="quick-stat__label">Total</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--success">
            <FiCheckCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {productStats?.active || 0}
            </span>
            <span className="quick-stat__label">Actifs</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--warning">
            <FiAlertCircle />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {productStats?.draft || 0}
            </span>
            <span className="quick-stat__label">Brouillons</span>
          </div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat__icon quick-stat__icon--error">
            <FiArchive />
          </div>
          <div className="quick-stat__content">
            <span className="quick-stat__value">
              {productStats?.outOfStock || 0}
            </span>
            <span className="quick-stat__label">Rupture</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="product-list__filters">
        <div className="product-list__search">
          <FiSearch className="product-list__search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={keyword}
            onChange={handleSearch}
          />
        </div>

        <div className="product-list__filter-row">
          <div className="product-list__filter-group">
            <label>Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div className="product-list__filter-group">
            <label>Univers</label>
            <select
              value={universe}
              onChange={(e) => {
                setUniverse(e.target.value);
                setSubUniverse("");
              }}
            >
              <option value="">Tous les univers</option>
              {universesData?.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="product-list__filter-group">
            <label>Sous-univers</label>
            <select
              value={subUniverse}
              onChange={(e) => setSubUniverse(e.target.value)}
              disabled={!universe}
            >
              <option value="">Tous les sous-univers</option>
              {subUniversesData?.subUniverses?.map((su) => (
                <option key={su._id} value={su._id}>
                  {su.name}
                </option>
              ))}
            </select>
          </div>

          <div className="product-list__filter-group">
            <label>Stock</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">Tous</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
              <option value="available">Disponible</option>
            </select>
          </div>
        </div>

        <div className="product-list__filter-actions">
          <button
            className="btn btn--outline btn--sm"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      {isLoading ? (
        <div className="product-list__loader">
          <FiRefreshCw className="spin" />
          <span>Chargement des produits...</span>
        </div>
      ) : isError ? (
        <div className="product-list__empty">
          <FiAlertCircle className="product-list__empty-icon" />
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les produits. Veuillez réessayer.</p>
          <button className="btn btn--primary" onClick={refetch}>
            Réessayer
          </button>
        </div>
      ) : productsData?.products?.length === 0 ? (
        <div className="product-list__table-container">
          <div className="product-list__empty">
            <FiPackage className="product-list__empty-icon" />
            <h3>Aucun produit trouvé</h3>
            <p>
              {keyword || status || universe || stockFilter
                ? "Aucun produit ne correspond à vos critères de recherche."
                : "Commencez par créer votre premier produit."}
            </p>
            {keyword || status || universe || stockFilter ? (
              <button
                className="btn btn--secondary"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </button>
            ) : (
              <Link to="/admin/products/create" className="btn btn--primary">
                <FiPlus /> Créer un produit
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Tableau desktop */}
          <div className="product-list__table-container">
            <table className="product-list__table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Catégorie</th>
                  <th>Badges</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsData?.products?.map((product) => {
                  const stockInfo = getStockIndicator(product.countInStock);
                  return (
                    <tr key={product._id}>
                      {/* Produit */}
                      <td>
                        <div className="product-cell">
                          <img
                            src={product.image || "/images/placeholder.png"}
                            alt={product.name}
                            className="product-cell__image"
                          />
                          <div className="product-cell__info">
                            <div
                              className="product-cell__name"
                              title={product.name}
                            >
                              {product.name}
                            </div>
                            <div className="product-cell__sku">
                              {product.brand}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Prix */}
                      <td>
                        <div className="price-cell">
                          {product.isOnSale && product.salePrice ? (
                            <>
                              <span className="price-cell__current price-cell__promo">
                                {formatPrice(product.salePrice)}
                              </span>
                              <span className="price-cell__original">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="price-cell__current">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td>
                        <div className="stock-cell">
                          <span
                            className={`stock-cell__indicator stock-cell__indicator--${stockInfo.class}`}
                          ></span>
                          <span>{product.countInStock}</span>
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td>{product.category || "-"}</td>

                      {/* Badges */}
                      <td>
                        <div className="product-badges">
                          {product.isNewProduct && (
                            <span className="product-badge product-badge--new">
                              Nouveau
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="product-badge product-badge--featured">
                              Vedette
                            </span>
                          )}
                          {product.isDestockage && (
                            <span className="product-badge product-badge--destockage">
                              Destockage
                            </span>
                          )}
                          {product.isComingSoon && (
                            <span className="product-badge product-badge--coming">
                              Bientôt
                            </span>
                          )}
                          {product.isOnSale && (
                            <span className="product-badge product-badge--promo">
                              Promo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Statut */}
                      <td>
                        <span
                          className={`status-badge status-badge--${product.status}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn action-btn--view"
                            onClick={() =>
                              navigate(`/admin/products/${product._id}`)
                            }
                            title="Voir"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="action-btn action-btn--edit"
                            onClick={() =>
                              navigate(`/admin/products/${product._id}/edit`)
                            }
                            title="Modifier"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="action-btn action-btn--duplicate"
                            onClick={() => handleDuplicate(product._id)}
                            disabled={isDuplicating}
                            title="Dupliquer"
                          >
                            <FiCopy />
                          </button>
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() =>
                              setDeleteModal({ open: true, product })
                            }
                            title="Supprimer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="product-list__pagination">
                <span className="pagination__info">
                  Affichage {startIndex}-{endIndex} sur {totalProducts} produits
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`pagination__btn ${page === pageNum ? "pagination__btn--active" : ""}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum}>...</span>;
                    }
                    return null;
                  })}

                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cartes mobile */}
          <div className="product-list__mobile-cards">
            {productsData?.products?.map((product) => {
              const stockInfo = getStockIndicator(product.countInStock);
              return (
                <div key={product._id} className="product-mobile-card">
                  <div className="product-mobile-card__header">
                    <img
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      className="product-mobile-card__image"
                    />
                    <div className="product-mobile-card__info">
                      <div className="product-mobile-card__name">
                        {product.name}
                      </div>
                      <div className="product-mobile-card__meta">
                        <span>{product.brand}</span>
                        <span
                          className={`status-badge status-badge--${product.status}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </div>
                      <div className="product-mobile-card__badges product-badges">
                        {product.isNewProduct && (
                          <span className="product-badge product-badge--new">
                            Nouveau
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="product-badge product-badge--featured">
                            Vedette
                          </span>
                        )}
                        {product.isDestockage && (
                          <span className="product-badge product-badge--destockage">
                            Destockage
                          </span>
                        )}
                        {product.isComingSoon && (
                          <span className="product-badge product-badge--coming">
                            Bientôt
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="product-badge product-badge--promo">
                            Promo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="product-mobile-card__body">
                    <div className="product-mobile-card__stat">
                      <div className="product-mobile-card__stat-label">
                        Prix
                      </div>
                      <div className="product-mobile-card__stat-value">
                        {product.isOnSale && product.salePrice
                          ? formatPrice(product.salePrice)
                          : formatPrice(product.price)}
                      </div>
                    </div>
                    <div className="product-mobile-card__stat">
                      <div className="product-mobile-card__stat-label">
                        Stock
                      </div>
                      <div className="product-mobile-card__stat-value">
                        <div className="stock-cell">
                          <span
                            className={`stock-cell__indicator stock-cell__indicator--${stockInfo.class}`}
                          ></span>
                          {product.countInStock}
                        </div>
                      </div>
                    </div>
                    <div className="product-mobile-card__stat">
                      <div className="product-mobile-card__stat-label">
                        Catégorie
                      </div>
                      <div className="product-mobile-card__stat-value">
                        {product.category || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="product-mobile-card__actions">
                    <button
                      className="action-btn action-btn--view"
                      onClick={() => navigate(`/admin/products/${product._id}`)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="action-btn action-btn--edit"
                      onClick={() =>
                        navigate(`/admin/products/${product._id}/edit`)
                      }
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn action-btn--duplicate"
                      onClick={() => handleDuplicate(product._id)}
                      disabled={isDuplicating}
                    >
                      <FiCopy />
                    </button>
                    <button
                      className="action-btn action-btn--delete"
                      onClick={() => setDeleteModal({ open: true, product })}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="product-list__pagination">
                <span className="pagination__info">
                  Page {page} sur {totalPages}
                </span>
                <div className="pagination__controls">
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <FiChevronLeft /> Précédent
                  </button>
                  <button
                    className="pagination__btn"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Suivant <FiChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModal.open && (
        <div
          className="modal-overlay"
          onClick={() => setDeleteModal({ open: false, product: null })}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__icon modal__icon--danger">
                <FiTrash2 />
              </div>
              <h3 className="modal__title">Supprimer le produit</h3>
            </div>
            <div className="modal__body">
              <p>
                Êtes-vous sûr de vouloir supprimer le produit{" "}
                <strong>"{deleteModal.product?.name}"</strong> ?
              </p>
              <p>Cette action est irréversible.</p>
            </div>
            <div className="modal__actions">
              <button
                className="btn btn--secondary"
                onClick={() => setDeleteModal({ open: false, product: null })}
              >
                Annuler
              </button>
              <button
                className="btn btn--danger"
                onClick={handleDelete}
                disabled={isDeleting}
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

export default ProductListScreen;
