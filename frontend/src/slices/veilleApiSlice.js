import { apiSlice } from "./apiSlice";

export const veilleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // CRUD PRINCIPAL
    // ==========================================

    // Créer une veille
    createVeille: builder.mutation({
      query: (data) => ({
        url: "/api/veilles",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Veille", "VeilleCategory"],
    }),

    // Récupérer toutes les veilles avec filtres et pagination
    getVeilles: builder.query({
      query: ({
        page = 1,
        limit = 20,
        category,
        contentType,
        status,
        priority,
        isFavorite,
        isArchived,
        search,
        tags,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = {}) => ({
        url: "/api/veilles",
        params: {
          page,
          limit,
          category,
          contentType,
          status,
          priority,
          isFavorite,
          isArchived,
          search,
          tags,
          sortBy,
          sortOrder,
        },
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 30,
    }),

    // Récupérer une veille par ID
    getVeilleById: builder.query({
      query: (id) => ({
        url: `/api/veilles/${id}`,
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 60,
    }),

    // Mettre à jour une veille
    updateVeille: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/veilles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Veille", "VeilleCategory"],
    }),

    // Supprimer une veille
    deleteVeille: builder.mutation({
      query: (id) => ({
        url: `/api/veilles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Veille", "VeilleCategory"],
    }),

    // Supprimer plusieurs veilles
    deleteMultipleVeilles: builder.mutation({
      query: (ids) => ({
        url: "/api/veilles/bulk",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Veille", "VeilleCategory"],
    }),

    // ==========================================
    // ACTIONS RAPIDES
    // ==========================================

    // Marquer comme lu
    markVeilleAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/veilles/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Veille"],
    }),

    // Basculer favori
    toggleVeilleFavorite: builder.mutation({
      query: (id) => ({
        url: `/api/veilles/${id}/favorite`,
        method: "PUT",
      }),
      invalidatesTags: ["Veille"],
    }),

    // Archiver
    archiveVeille: builder.mutation({
      query: (id) => ({
        url: `/api/veilles/${id}/archive`,
        method: "PUT",
      }),
      invalidatesTags: ["Veille"],
    }),

    // Désarchiver
    unarchiveVeille: builder.mutation({
      query: (id) => ({
        url: `/api/veilles/${id}/unarchive`,
        method: "PUT",
      }),
      invalidatesTags: ["Veille"],
    }),

    // Déplacer vers une catégorie
    moveVeillesToCategory: builder.mutation({
      query: ({ veilleIds, categoryId }) => ({
        url: "/api/veilles/move-category",
        method: "PUT",
        body: { veilleIds, categoryId },
      }),
      invalidatesTags: ["Veille", "VeilleCategory"],
    }),

    // Mise à jour des tags en masse
    bulkUpdateVeilleTags: builder.mutation({
      query: ({ veilleIds, tags, action }) => ({
        url: "/api/veilles/bulk-tags",
        method: "PUT",
        body: { veilleIds, tags, action },
      }),
      invalidatesTags: ["Veille"],
    }),

    // ==========================================
    // STATISTIQUES ET REQUÊTES SPÉCIALES
    // ==========================================

    // Statistiques
    getVeilleStats: builder.query({
      query: () => ({
        url: "/api/veilles/stats",
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 30,
    }),

    // Tous les tags
    getAllVeilleTags: builder.query({
      query: () => ({
        url: "/api/veilles/tags",
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 60,
    }),

    // Veilles récentes
    getRecentVeilles: builder.query({
      query: (limit = 10) => ({
        url: "/api/veilles/recent",
        params: { limit },
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 30,
    }),

    // Veilles favorites
    getFavoriteVeilles: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/api/veilles/favorites",
        params: { page, limit },
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 30,
    }),

    // Veilles par catégorie
    getVeillesByCategory: builder.query({
      query: ({ categoryId, page = 1, limit = 20, status, contentType } = {}) => ({
        url: `/api/veilles/category/${categoryId}`,
        params: { page, limit, status, contentType },
      }),
      providesTags: ["Veille"],
      keepUnusedDataFor: 30,
    }),
  }),
});

export const {
  // CRUD
  useCreateVeilleMutation,
  useGetVeillesQuery,
  useGetVeilleByIdQuery,
  useUpdateVeilleMutation,
  useDeleteVeilleMutation,
  useDeleteMultipleVeillesMutation,
  
  // Actions rapides
  useMarkVeilleAsReadMutation,
  useToggleVeilleFavoriteMutation,
  useArchiveVeilleMutation,
  useUnarchiveVeilleMutation,
  useMoveVeillesToCategoryMutation,
  useBulkUpdateVeilleTagsMutation,
  
  // Statistiques et requêtes spéciales
  useGetVeilleStatsQuery,
  useGetAllVeilleTagsQuery,
  useGetRecentVeillesQuery,
  useGetFavoriteVeillesQuery,
  useGetVeillesByCategoryQuery,
} = veilleApiSlice;