import { apiSlice } from "./apiSlice";

export const prospectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES (Public)
    // ==========================================
    checkSubscriptionStatus: builder.query({
      query: (email) => ({
        url: `/api/prospects/check/${encodeURIComponent(email)}`,
      }),
      providesTags: ["Prospect"],
      keepUnusedDataFor: 5,
    }),

    // ==========================================
    // QUERIES (Admin)
    // ==========================================
    getProspects: builder.query({
      query: (params) => ({
        url: "/api/prospects",
        params,
      }),
      providesTags: ["Prospect"],
      keepUnusedDataFor: 5,
    }),

    getProspectById: builder.query({
      query: (id) => ({
        url: `/api/prospects/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Prospect", id }],
      keepUnusedDataFor: 5,
    }),

    getProspectStats: builder.query({
      query: () => ({
        url: "/api/prospects/stats",
      }),
      providesTags: ["Prospect"],
      keepUnusedDataFor: 5,
    }),

    exportProspects: builder.query({
      query: (params) => ({
        url: "/api/prospects/export",
        params,
      }),
      providesTags: ["Prospect"],
      keepUnusedDataFor: 5,
    }),

    // ==========================================
    // MUTATIONS (Public)
    // ==========================================
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/api/prospects",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Prospect"],
    }),

    unsubscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/api/prospects/unsubscribe",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Prospect"],
    }),

    // ==========================================
    // MUTATIONS (Admin)
    // ==========================================
    updateProspect: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/prospects/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Prospect", id },
        "Prospect",
      ],
    }),

    deleteProspect: builder.mutation({
      query: (id) => ({
        url: `/api/prospects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prospect"],
    }),

    bulkDeleteProspects: builder.mutation({
      query: (ids) => ({
        url: "/api/prospects/bulk",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Prospect"],
    }),

    markProspectAsConverted: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/api/prospects/${id}/convert`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Prospect", id },
        "Prospect",
      ],
    }),

    bulkAddTagsToProspects: builder.mutation({
      query: ({ ids, tags }) => ({
        url: "/api/prospects/bulk/tags",
        method: "PUT",
        body: { ids, tags },
      }),
      invalidatesTags: ["Prospect"],
    }),
  }),
});

export const {
  // Queries (Public)
  useCheckSubscriptionStatusQuery,
  useLazyCheckSubscriptionStatusQuery,
  // Queries (Admin)
  useGetProspectsQuery,
  useGetProspectByIdQuery,
  useGetProspectStatsQuery,
  useExportProspectsQuery,
  useLazyExportProspectsQuery,
  // Mutations (Public)
  useSubscribeNewsletterMutation,
  useUnsubscribeNewsletterMutation,
  // Mutations (Admin)
  useUpdateProspectMutation,
  useDeleteProspectMutation,
  useBulkDeleteProspectsMutation,
  useMarkProspectAsConvertedMutation,
  useBulkAddTagsToProspectsMutation,
} = prospectApiSlice;