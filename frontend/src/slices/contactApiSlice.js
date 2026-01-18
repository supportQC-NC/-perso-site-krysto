import { apiSlice } from "./apiSlice";

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    createContact: builder.mutation({
      query: (data) => ({
        url: "/api/contacts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contact"],
    }),

    // Admin
    getContacts: builder.query({
      query: ({ page, limit, status, subject, isRead, sortBy, sortOrder } = {}) => ({
        url: "/api/contacts",
        params: { page, limit, status, subject, isRead, sortBy, sortOrder },
      }),
      providesTags: ["Contact"],
      keepUnusedDataFor: 5,
    }),
    getContactById: builder.query({
      query: (id) => ({
        url: `/api/contacts/${id}`,
      }),
      providesTags: ["Contact"],
      keepUnusedDataFor: 5,
    }),
    getContactStats: builder.query({
      query: () => ({
        url: "/api/contacts/stats",
      }),
      providesTags: ["Contact"],
      keepUnusedDataFor: 5,
    }),
    markContactAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/contacts/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Contact"],
    }),
    updateContactStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/api/contacts/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Contact"],
    }),
    respondToContact: builder.mutation({
      query: ({ id, content }) => ({
        url: `/api/contacts/${id}/respond`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["Contact"],
    }),
    addContactNotes: builder.mutation({
      query: ({ id, notes }) => ({
        url: `/api/contacts/${id}/notes`,
        method: "PUT",
        body: { notes },
      }),
      invalidatesTags: ["Contact"],
    }),
    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/api/contacts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const {
  useCreateContactMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useGetContactStatsQuery,
  useMarkContactAsReadMutation,
  useUpdateContactStatusMutation,
  useRespondToContactMutation,
  useAddContactNotesMutation,
  useDeleteContactMutation,
} = contactApiSlice;