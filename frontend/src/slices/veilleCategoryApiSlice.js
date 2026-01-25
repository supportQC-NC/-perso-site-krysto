import { apiSlice } from "./apiSlice";

export const veilleCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // CATÉGORIES DE VEILLE
    // ==========================================

    // Créer une catégorie
    createVeilleCategory: builder.mutation({
      query: (data) => ({
        url: "/api/veille-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["VeilleCategory", "Veille"],
    }),

    // Récupérer toutes les catégories
    getVeilleCategories: builder.query({
      query: ({ includeCount = true, activeOnly = false } = {}) => ({
        url: "/api/veille-categories",
        params: { includeCount, activeOnly },
      }),
      providesTags: ["VeilleCategory"],
      keepUnusedDataFor: 60,
    }),

    // Récupérer une catégorie par ID
    getVeilleCategoryById: builder.query({
      query: (id) => ({
        url: `/api/veille-categories/${id}`,
      }),
      providesTags: ["VeilleCategory"],
      keepUnusedDataFor: 60,
    }),

    // Mettre à jour une catégorie
    updateVeilleCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/veille-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VeilleCategory", "Veille"],
    }),

    // Supprimer une catégorie
    deleteVeilleCategory: builder.mutation({
      query: (id) => ({
        url: `/api/veille-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VeilleCategory"],
    }),

    // Réorganiser les catégories
    reorderVeilleCategories: builder.mutation({
      query: (categoryOrders) => ({
        url: "/api/veille-categories/reorder",
        method: "PUT",
        body: { categoryOrders },
      }),
      invalidatesTags: ["VeilleCategory"],
    }),
  }),
});

export const {
  useCreateVeilleCategoryMutation,
  useGetVeilleCategoriesQuery,
  useGetVeilleCategoryByIdQuery,
  useUpdateVeilleCategoryMutation,
  useDeleteVeilleCategoryMutation,
  useReorderVeilleCategoriesMutation,
} = veilleCategoryApiSlice;