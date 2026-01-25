import { apiSlice } from "./apiSlice";

export const proOrderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // PRO USER ENDPOINTS
    // ==========================================

    // Créer une commande Pro
    createProOrder: builder.mutation({
      query: (data) => ({
        url: "/api/pro-orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProOrder"],
    }),

    // Obtenir mes commandes Pro
    getMyProOrders: builder.query({
      query: (params) => ({
        url: "/api/pro-orders/my-orders",
        params,
      }),
      providesTags: ["ProOrder"],
    }),

    // Obtenir mes stats Pro
    getMyProOrderStats: builder.query({
      query: () => ({
        url: "/api/pro-orders/my-stats",
      }),
      providesTags: ["ProOrder"],
    }),

    // Obtenir une commande Pro par ID
    getProOrderById: builder.query({
      query: (id) => ({
        url: `/api/pro-orders/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "ProOrder", id }],
    }),

    // Annuler ma commande Pro
    cancelMyProOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/api/pro-orders/${id}/cancel`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["ProOrder"],
    }),

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

    // Obtenir toutes les commandes Pro
    getAllProOrders: builder.query({
      query: (params) => ({
        url: "/api/pro-orders",
        params,
      }),
      providesTags: ["ProOrder"],
    }),

    // Statistiques globales
    getProOrderStats: builder.query({
      query: () => ({
        url: "/api/pro-orders/stats",
      }),
      providesTags: ["ProOrder"],
    }),

    // Mettre à jour le statut d'une commande
    updateProOrderStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/api/pro-orders/${id}/status`,
        method: "PUT",
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProOrder", id },
        "ProOrder",
      ],
    }),

    // Enregistrer un paiement
    recordProOrderPayment: builder.mutation({
      query: ({ id, amount, note }) => ({
        url: `/api/pro-orders/${id}/payment`,
        method: "PUT",
        body: { amount, note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ProOrder", id },
        "ProOrder",
      ],
    }),

    // Ajouter des notes internes
    addProOrderNotes: builder.mutation({
      query: ({ id, internalNotes }) => ({
        url: `/api/pro-orders/${id}/notes`,
        method: "PUT",
        body: { internalNotes },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ProOrder", id }],
    }),

    // Générer le numéro de facture
    generateProOrderInvoice: builder.mutation({
      query: (id) => ({
        url: `/api/pro-orders/${id}/invoice`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [{ type: "ProOrder", id }],
    }),

    // ==========================================
    // NOUVEAU: Envoyer un rappel de paiement
    // ==========================================
    sendPaymentReminder: builder.mutation({
      query: (id) => ({
        url: `/api/pro-orders/${id}/payment-reminder`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "ProOrder", id }],
    }),

    // Supprimer une commande Pro
    deleteProOrder: builder.mutation({
      query: (id) => ({
        url: `/api/pro-orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProOrder"],
    }),
  }),
});

export const {
  // Pro user hooks
  useCreateProOrderMutation,
  useGetMyProOrdersQuery,
  useGetMyProOrderStatsQuery,
  useGetProOrderByIdQuery,
  useCancelMyProOrderMutation,
  // Admin hooks
  useGetAllProOrdersQuery,
  useGetProOrderStatsQuery,
  useUpdateProOrderStatusMutation,
  useRecordProOrderPaymentMutation,
  useAddProOrderNotesMutation,
  useGenerateProOrderInvoiceMutation,
  useSendPaymentReminderMutation, // NOUVEAU
  useDeleteProOrderMutation,
} = proOrderApiSlice;