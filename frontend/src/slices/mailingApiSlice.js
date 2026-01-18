import { apiSlice } from "./apiSlice";

export const mailingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================
    getCampaigns: builder.query({
      query: (params) => ({
        url: "/api/mailing",
        params,
      }),
      providesTags: ["Mailing"],
      keepUnusedDataFor: 5,
    }),

    getCampaignById: builder.query({
      query: (id) => ({
        url: `/api/mailing/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Mailing", id }],
      keepUnusedDataFor: 5,
    }),

    getMailingStats: builder.query({
      query: () => ({
        url: "/api/mailing/stats",
      }),
      providesTags: ["Mailing"],
      keepUnusedDataFor: 5,
    }),

    getTemplateTypes: builder.query({
      query: () => ({
        url: "/api/mailing/templates",
      }),
      keepUnusedDataFor: 300, // 5 minutes - données statiques
    }),

    getRecipientTypes: builder.query({
      query: () => ({
        url: "/api/mailing/recipient-types",
      }),
      keepUnusedDataFor: 300,
    }),

    previewCampaign: builder.query({
      query: (id) => ({
        url: `/api/mailing/${id}/preview`,
      }),
      keepUnusedDataFor: 0, // Toujours rafraîchir
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================
    createCampaign: builder.mutation({
      query: (data) => ({
        url: "/api/mailing",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Mailing"],
    }),

    updateCampaign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/mailing/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Mailing", id },
        "Mailing",
      ],
    }),

    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/mailing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mailing"],
    }),

    duplicateCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/mailing/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: ["Mailing"],
    }),

    sendCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/mailing/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Mailing", id },
        "Mailing",
      ],
    }),

    sendTestEmail: builder.mutation({
      query: ({ id, email }) => ({
        url: `/api/mailing/${id}/test`,
        method: "POST",
        body: { email },
      }),
    }),

    cancelCampaign: builder.mutation({
      query: (id) => ({
        url: `/api/mailing/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Mailing", id },
        "Mailing",
      ],
    }),

    countRecipients: builder.mutation({
      query: (data) => ({
        url: "/api/mailing/count-recipients",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  // Queries
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetMailingStatsQuery,
  useGetTemplateTypesQuery,
  useGetRecipientTypesQuery,
  usePreviewCampaignQuery,
  useLazyPreviewCampaignQuery,
  // Mutations
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useDuplicateCampaignMutation,
  useSendCampaignMutation,
  useSendTestEmailMutation,
  useCancelCampaignMutation,
  useCountRecipientsMutation,
} = mailingApiSlice;
