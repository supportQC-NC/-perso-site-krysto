import { apiSlice } from "./apiSlice";

export const proRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // USER ENDPOINTS (Utilisateur authentifié)
    // ==========================================

    // Créer une demande de compte Pro
    createProRequest: builder.mutation({
      query: (data) => ({
        url: "/api/pro-requests",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProRequest", "User"],
    }),

    // Obtenir mes demandes Pro
    getMyProRequests: builder.query({
      query: () => ({
        url: "/api/pro-requests/my-requests",
      }),
      providesTags: ["ProRequest"],
      keepUnusedDataFor: 5,
    }),

    // Annuler ma demande Pro
    cancelMyProRequest: builder.mutation({
      query: (id) => ({
        url: `/api/pro-requests/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["ProRequest", "User"],
    }),

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    // Obtenir toutes les demandes Pro
    getProRequests: builder.query({
      query: (params) => ({
        url: "/api/pro-requests",
        params,
      }),
      providesTags: ["ProRequest"],
      keepUnusedDataFor: 5,
    }),

    // Obtenir une demande Pro par ID
    getProRequestById: builder.query({
      query: (id) => ({
        url: `/api/pro-requests/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "ProRequest", id }],
      keepUnusedDataFor: 5,
    }),

    // Obtenir les statistiques des demandes Pro
    getProRequestStats: builder.query({
      query: () => ({
        url: "/api/pro-requests/stats",
      }),
      providesTags: ["ProRequest"],
      keepUnusedDataFor: 5,
    }),

    // Approuver une demande Pro
    approveProRequest: builder.mutation({
      query: ({ id, discountRate, adminNotes }) => ({
        url: `/api/pro-requests/${id}/approve`,
        method: "PUT",
        body: { discountRate, adminNotes },
      }),
      invalidatesTags: ["ProRequest", "User"],
    }),

    // Rejeter une demande Pro
    rejectProRequest: builder.mutation({
      query: ({ id, rejectionReason }) => ({
        url: `/api/pro-requests/${id}/reject`,
        method: "PUT",
        body: { rejectionReason },
      }),
      invalidatesTags: ["ProRequest", "User"],
    }),

    // Ajouter des notes admin à une demande
    addProRequestAdminNotes: builder.mutation({
      query: ({ id, adminNotes }) => ({
        url: `/api/pro-requests/${id}/notes`,
        method: "PUT",
        body: { adminNotes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ProRequest", id }],
    }),

    // Supprimer une demande Pro
    deleteProRequest: builder.mutation({
      query: (id) => ({
        url: `/api/pro-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProRequest"],
    }),
  }),
});

export const {
  // User hooks
  useCreateProRequestMutation,
  useGetMyProRequestsQuery,
  useCancelMyProRequestMutation,
  // Admin hooks
  useGetProRequestsQuery,
  useGetProRequestByIdQuery,
  useGetProRequestStatsQuery,
  useApproveProRequestMutation,
  useRejectProRequestMutation,
  useAddProRequestAdminNotesMutation,
  useDeleteProRequestMutation,
} = proRequestApiSlice;