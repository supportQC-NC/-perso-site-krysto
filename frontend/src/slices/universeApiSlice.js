import { apiSlice } from "./apiSlice";

export const universeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================
    getUniverses: builder.query({
      query: (params) => ({
        url: "/api/universes",
        params,
      }),
      providesTags: ["Universe"],
      keepUnusedDataFor: 5,
    }),

    getActiveUniverses: builder.query({
      query: () => ({
        url: "/api/universes/active",
      }),
      providesTags: ["Universe"],
      keepUnusedDataFor: 5,
    }),

    getUniverseById: builder.query({
      query: (id) => ({
        url: `/api/universes/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Universe", id }],
      keepUnusedDataFor: 5,
    }),

    getUniverseBySlug: builder.query({
      query: (slug) => ({
        url: `/api/universes/slug/${slug}`,
      }),
      providesTags: ["Universe"],
      keepUnusedDataFor: 5,
    }),

    getUniverseProducts: builder.query({
      query: ({ id, ...params }) => ({
        url: `/api/universes/${id}/products`,
        params,
      }),
      providesTags: ["Universe", "Product"],
      keepUnusedDataFor: 5,
    }),

    getUniverseStats: builder.query({
      query: () => ({
        url: "/api/universes/stats",
      }),
      providesTags: ["Universe"],
      keepUnusedDataFor: 5,
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================
    createUniverse: builder.mutation({
      query: (data) => ({
        url: "/api/universes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Universe"],
    }),

    updateUniverse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/universes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Universe", id },
        "Universe",
      ],
    }),

    deleteUniverse: builder.mutation({
      query: (id) => ({
        url: `/api/universes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Universe"],
    }),

    reorderUniverses: builder.mutation({
      query: (orders) => ({
        url: "/api/universes/reorder",
        method: "PUT",
        body: { orders },
      }),
      invalidatesTags: ["Universe"],
    }),
  }),
});

export const {
  // Queries
  useGetUniversesQuery,
  useGetActiveUniversesQuery,
  useGetUniverseByIdQuery,
  useGetUniverseBySlugQuery,
  useGetUniverseProductsQuery,
  useGetUniverseStatsQuery,
  // Mutations
  useCreateUniverseMutation,
  useUpdateUniverseMutation,
  useDeleteUniverseMutation,
  useReorderUniversesMutation,
} = universeApiSlice;