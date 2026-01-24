import { apiSlice } from "./apiSlice";

export const newsletterCampaignApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================

    // Récupérer toutes les campagnes newsletter
    getNewsletterCampaigns: builder.query({
      query: (params) => ({
        url: "/api/newsletters",
        params,
      }),
      providesTags: ["NewsletterCampaign"],
      keepUnusedDataFor: 5,
    }),

    // Récupérer une campagne par ID
    getNewsletterCampaignById: builder.query({
      query: (id) => ({
        url: `/api/newsletters/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "NewsletterCampaign", id }],
      keepUnusedDataFor: 5,
    }),

    // Obtenir les statistiques des campagnes
    getNewsletterCampaignStats: builder.query({
      query: () => ({
        url: "/api/newsletters/stats",
      }),
      providesTags: ["NewsletterCampaign"],
      keepUnusedDataFor: 5,
    }),

    // Obtenir les types de campagnes disponibles
    getNewsletterCampaignTypes: builder.query({
      query: () => ({
        url: "/api/newsletters/types",
      }),
      keepUnusedDataFor: 300, // 5 minutes - données statiques
    }),

    // Compter les destinataires selon le filtre
    countNewsletterRecipients: builder.query({
      query: (filter) => ({
        url: "/api/newsletters/recipients/count",
        params: { filter },
      }),
      keepUnusedDataFor: 60, // 1 minute
    }),

    // Prévisualiser une campagne (HTML)
    previewNewsletterCampaign: builder.query({
      query: (id) => ({
        url: `/api/newsletters/${id}/preview`,
      }),
      keepUnusedDataFor: 0, // Toujours rafraîchir
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================

    // Créer une nouvelle campagne
    createNewsletterCampaign: builder.mutation({
      query: (data) => ({
        url: "/api/newsletters",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NewsletterCampaign"],
    }),

    // Mettre à jour une campagne
    updateNewsletterCampaign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/newsletters/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "NewsletterCampaign", id },
        "NewsletterCampaign",
      ],
    }),

    // Supprimer une campagne
    deleteNewsletterCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/newsletters/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NewsletterCampaign"],
    }),

    // Dupliquer une campagne
    duplicateNewsletterCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/newsletters/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["NewsletterCampaign"],
    }),

    // Envoyer une campagne
    sendNewsletterCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/newsletters/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "NewsletterCampaign", id },
        "NewsletterCampaign",
      ],
    }),

    // Envoyer un email de test
    sendNewsletterTestEmail: builder.mutation({
      query: ({ id, email }) => ({
        url: `/api/newsletters/${id}/test`,
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  // Queries
  useGetNewsletterCampaignsQuery,
  useGetNewsletterCampaignByIdQuery,
  useGetNewsletterCampaignStatsQuery,
  useGetNewsletterCampaignTypesQuery,
  useCountNewsletterRecipientsQuery,
  useLazyCountNewsletterRecipientsQuery,
  usePreviewNewsletterCampaignQuery,
  useLazyPreviewNewsletterCampaignQuery,
  // Mutations
  useCreateNewsletterCampaignMutation,
  useUpdateNewsletterCampaignMutation,
  useDeleteNewsletterCampaignMutation,
  useDuplicateNewsletterCampaignMutation,
  useSendNewsletterCampaignMutation,
  useSendNewsletterTestEmailMutation,
} = newsletterCampaignApiSlice;