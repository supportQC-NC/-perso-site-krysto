import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================
    getProducts: builder.query({
      query: (params) => ({
        url: "/api/products",
        params,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getProductById: builder.query({
      query: (id) => ({
        url: `/api/products/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
      keepUnusedDataFor: 5,
    }),

    getProductStats: builder.query({
      query: () => ({
        url: "/api/products/stats",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getTopProducts: builder.query({
      query: () => ({
        url: "/api/products/top",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getFeaturedProducts: builder.query({
      query: () => ({
        url: "/api/products/featured",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // NOUVEAU: Produits en déstockage
    getDestockageProducts: builder.query({
      query: () => ({
        url: "/api/products/destockage",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // NOUVEAU: Produits bientôt disponibles
    getComingSoonProducts: builder.query({
      query: () => ({
        url: "/api/products/coming-soon",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // NOUVEAU: Nouveaux produits
    getNewProducts: builder.query({
      query: () => ({
        url: "/api/products/new",
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/api/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product", "SubUniverse", "Universe"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Product",
        "SubUniverse",
        "Universe",
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "SubUniverse", "Universe"],
    }),

    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
      }),
    }),

    uploadProductImages: builder.mutation({
      query: (formData) => ({
        url: "/api/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),

    createProductReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/api/products/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    toggleProductFeatured: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/featured`,
        method: "PUT",
      }),
      invalidatesTags: ["Product"],
    }),

    // NOUVEAU: Toggle déstockage
    toggleProductDestockage: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/destockage`,
        method: "PUT",
      }),
      invalidatesTags: ["Product"],
    }),

    // NOUVEAU: Toggle coming soon (avec date optionnelle)
    toggleProductComingSoon: builder.mutation({
      query: ({ id, availableDate }) => ({
        url: `/api/products/${id}/coming-soon`,
        method: "PUT",
        body: { availableDate },
      }),
      invalidatesTags: ["Product"],
    }),

    updateProductStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/products/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Product"],
    }),

    updateProductUniverse: builder.mutation({
      query: ({ id, universe }) => ({
        url: `/api/products/${id}/universe`,
        method: "PUT",
        body: { universe },
      }),
      invalidatesTags: ["Product", "Universe", "SubUniverse"],
    }),

    updateProductSubUniverse: builder.mutation({
      query: ({ id, subUniverse }) => ({
        url: `/api/products/${id}/subuniverse`,
        method: "PUT",
        body: { subUniverse },
      }),
      invalidatesTags: ["Product", "SubUniverse"],
    }),

    duplicateProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Product", "SubUniverse", "Universe"],
    }),
  }),
});

export const {
  // Queries
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductStatsQuery,
  useGetTopProductsQuery,
  useGetFeaturedProductsQuery,
  useGetDestockageProductsQuery,    // NOUVEAU
  useGetComingSoonProductsQuery,    // NOUVEAU
  useGetNewProductsQuery,           // NOUVEAU
  // Mutations
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useUploadProductImagesMutation,
  useCreateProductReviewMutation,
  useToggleProductFeaturedMutation,
  useToggleProductDestockageMutation,   // NOUVEAU
  useToggleProductComingSoonMutation,   // NOUVEAU
  useUpdateProductStatusMutation,
  useUpdateProductUniverseMutation,
  useUpdateProductSubUniverseMutation,
  useDuplicateProductMutation,
} = productApiSlice;