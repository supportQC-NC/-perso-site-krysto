import { apiSlice } from "./apiSlice";

export const reapproRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // PRO USER ENDPOINTS
    // ==========================================

    // Créer une demande de réapprovisionnement
    createReapproRequest: builder.mutation({
      query: (data) => ({
        url: "/api/reappro-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ReapproRequest"],
    }),

    // Obtenir mes demandes
    getMyReapproRequests: builder.query({
      query: (params) => ({
        url: "/api/reappro-requests/my-requests",
        params,
      }),
      providesTags: ["ReapproRequest"],
    }),

    // Obtenir mes stats
    getMyReapproStats: builder.query({
      query: () => ({
        url: "/api/reappro-requests/my-stats",
      }),
      providesTags: ["ReapproRequest"],
    }),

    // Obtenir une demande par ID
    getReapproRequestById: builder.query({
      query: (id) => ({
        url: `/api/reappro-requests/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "ReapproRequest", id }],
    }),

    // Annuler ma demande
    cancelMyReapproRequest: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/reappro-requests/${id}/cancel`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["ReapproRequest"],
    }),

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    // Obtenir toutes les demandes
    getAllReapproRequests: builder.query({
      query: (params) => ({
        url: "/api/reappro-requests",
        params,
      }),
      providesTags: ["ReapproRequest"],
    }),

    // Statistiques globales
    getReapproStats: builder.query({
      query: () => ({
        url: "/api/reappro-requests/stats",
      }),
      providesTags: ["ReapproRequest"],
    }),

    // Approuver une demande
    approveReapproRequest: builder.mutation({
      query: ({ id, items, note, estimatedDeliveryDate }) => ({
        url: `/api/reappro-requests/${id}/approve`,
        method: "PUT",
        body: { items, note, estimatedDeliveryDate },
      }),
      invalidatesTags: ["ReapproRequest"],
    }),

    // Rejeter une demande
    rejectReapproRequest: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/reappro-requests/${id}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["ReapproRequest"],
    }),

    // Convertir en commande Pro
    convertReapproToOrder: builder.mutation({
      query: (id) => ({
        url: `/api/reappro-requests/${id}/convert-to-order`,
        method: "POST",
      }),
      invalidatesTags: ["ReapproRequest", "ProOrder"],
    }),

    // Mettre à jour le statut
    updateReapproStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/api/reappro-requests/${id}/status`,
        method: "PUT",
        body: { status, note },
      }),
      invalidatesTags: ["ReapproRequest"],
    }),

    // Ajouter des notes internes
    addReapproNotes: builder.mutation({
      query: ({ id, internalNotes }) => ({
        url: `/api/reappro-requests/${id}/notes`,
        method: "PUT",
        body: { internalNotes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ReapproRequest", id }],
    }),

    // Supprimer une demande
    deleteReapproRequest: builder.mutation({
      query: (id) => ({
        url: `/api/reappro-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReapproRequest"],
    }),
  }),
});

export const {
  // Pro user hooks
  useCreateReapproRequestMutation,
  useGetMyReapproRequestsQuery,
  useGetMyReapproStatsQuery,
  useGetReapproRequestByIdQuery,
  useCancelMyReapproRequestMutation,
  // Admin hooks
  useGetAllReapproRequestsQuery,
  useGetReapproStatsQuery,
  useApproveReapproRequestMutation,
  useRejectReapproRequestMutation,
  useConvertReapproToOrderMutation,
  useUpdateReapproStatusMutation,
  useAddReapproNotesMutation,
  useDeleteReapproRequestMutation,
} = reapproRequestApiSlice;