
// import { apiSlice } from "./apiSlice";

// export const productApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getProducts: builder.query({
//       query: () => ({
//         url: "/api/products",
//       }),
//       providesTags: ["Product"],
//       keepUnusedDataFor: 5,
//     }),
//     getProductById: builder.query({
//       query: (id) => ({
//         url: `/api/products/${id}`,
//       }),
//       providesTags: ["Product"],
//       keepUnusedDataFor: 5,
//     }),
//   }),
// });

// export const { useGetProductsQuery, useGetProductByIdQuery } = productApiSlice;


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
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getProductStats: builder.query({
      query: () => ({
        url: "/api/products/stats",
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
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
      }),
    }),

    toggleProductFeatured: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/featured`,
        method: "PUT",
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

    duplicateProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductStatsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useToggleProductFeaturedMutation,
  useUpdateProductStatusMutation,
  useDuplicateProductMutation,
} = productApiSlice;