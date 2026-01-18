import { apiSlice } from "./apiSlice";

export const subUniverseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================
    getSubUniverses: builder.query({
      query: (params) => ({
        url: "/api/subuniverses",
        params,
      }),
      providesTags: ["SubUniverse"],
      keepUnusedDataFor: 5,
    }),

    getActiveSubUniverses: builder.query({
      query: (params) => ({
        url: "/api/subuniverses/active",
        params,
      }),
      providesTags: ["SubUniverse"],
      keepUnusedDataFor: 5,
    }),

    getSubUniversesByUniverse: builder.query({
      query: ({ universeId, ...params }) => ({
        url: `/api/subuniverses/by-universe/${universeId}`,
        params,
      }),
      providesTags: (result, error, { universeId }) => [
        { type: "SubUniverse", id: `universe-${universeId}` },
        "SubUniverse",
      ],
      keepUnusedDataFor: 5,
    }),

    getSubUniverseById: builder.query({
      query: (id) => ({
        url: `/api/subuniverses/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "SubUniverse", id }],
      keepUnusedDataFor: 5,
    }),

    getSubUniverseBySlug: builder.query({
      query: (slug) => ({
        url: `/api/subuniverses/slug/${slug}`,
      }),
      providesTags: ["SubUniverse"],
      keepUnusedDataFor: 5,
    }),

    getSubUniverseProducts: builder.query({
      query: ({ id, ...params }) => ({
        url: `/api/subuniverses/${id}/products`,
        params,
      }),
      providesTags: ["SubUniverse", "Product"],
      keepUnusedDataFor: 5,
    }),

    getSubUniverseStats: builder.query({
      query: () => ({
        url: "/api/subuniverses/stats",
      }),
      providesTags: ["SubUniverse"],
      keepUnusedDataFor: 5,
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================
    createSubUniverse: builder.mutation({
      query: (data) => ({
        url: "/api/subuniverses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubUniverse", "Universe"],
    }),

    updateSubUniverse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/subuniverses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SubUniverse", id },
        "SubUniverse",
        "Universe",
      ],
    }),

    deleteSubUniverse: builder.mutation({
      query: (id) => ({
        url: `/api/subuniverses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubUniverse", "Universe"],
    }),

    reorderSubUniverses: builder.mutation({
      query: (orders) => ({
        url: "/api/subuniverses/reorder",
        method: "PUT",
        body: { orders },
      }),
      invalidatesTags: ["SubUniverse"],
    }),
  }),
});

export const {
  // Queries
  useGetSubUniversesQuery,
  useGetActiveSubUniversesQuery,
  useGetSubUniversesByUniverseQuery,
  useGetSubUniverseByIdQuery,
  useGetSubUniverseBySlugQuery,
  useGetSubUniverseProductsQuery,
  useGetSubUniverseStatsQuery,
  // Mutations
  useCreateSubUniverseMutation,
  useUpdateSubUniverseMutation,
  useDeleteSubUniverseMutation,
  useReorderSubUniversesMutation,
} = subUniverseApiSlice;