import { apiSlice } from "./apiSlice";

export const mailingTemplateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // QUERIES
    // ==========================================

    // Récupérer tous les templates avec filtres
    getMailingTemplates: builder.query({
      query: (params) => ({
        url: "/api/mailing-templates",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.templates.map(({ _id }) => ({ type: "MailingTemplate", id: _id })),
              { type: "MailingTemplate", id: "LIST" },
            ]
          : [{ type: "MailingTemplate", id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    // Récupérer les templates par défaut
    getDefaultMailingTemplates: builder.query({
      query: () => ({
        url: "/api/mailing-templates/defaults",
      }),
      providesTags: [{ type: "MailingTemplate", id: "DEFAULTS" }],
      keepUnusedDataFor: 300, // 5 minutes - données stables
    }),

    // Récupérer un template par ID
    getMailingTemplateById: builder.query({
      query: (id) => ({
        url: `/api/mailing-templates/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "MailingTemplate", id }],
      keepUnusedDataFor: 60,
    }),

    // Récupérer les types de blocs
    getBlockTypes: builder.query({
      query: () => ({
        url: "/api/mailing-templates/block-types",
      }),
      keepUnusedDataFor: 3600, // 1 heure - données statiques
    }),

    // Récupérer les catégories de templates
    getTemplateCategories: builder.query({
      query: () => ({
        url: "/api/mailing-templates/categories",
      }),
      keepUnusedDataFor: 3600, // 1 heure - données statiques
    }),

    // Récupérer les statistiques
    getMailingTemplateStats: builder.query({
      query: () => ({
        url: "/api/mailing-templates/stats",
      }),
      providesTags: [{ type: "MailingTemplate", id: "STATS" }],
      keepUnusedDataFor: 30,
    }),

    // ==========================================
    // MUTATIONS
    // ==========================================

    // Créer un template
    createMailingTemplate: builder.mutation({
      query: (data) => ({
        url: "/api/mailing-templates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "MailingTemplate", id: "LIST" },
        { type: "MailingTemplate", id: "STATS" },
      ],
    }),

    // Mettre à jour un template
    updateMailingTemplate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/mailing-templates/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MailingTemplate", id },
        { type: "MailingTemplate", id: "LIST" },
      ],
    }),

    // Supprimer un template
    deleteMailingTemplate: builder.mutation({
      query: (id) => ({
        url: `/api/mailing-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MailingTemplate", id: "LIST" },
        { type: "MailingTemplate", id: "STATS" },
      ],
    }),

    // Dupliquer un template
    duplicateMailingTemplate: builder.mutation({
      query: ({ id, name }) => ({
        url: `/api/mailing-templates/${id}/duplicate`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: [
        { type: "MailingTemplate", id: "LIST" },
        { type: "MailingTemplate", id: "STATS" },
      ],
    }),

    // Créer un bloc vide
    createBlock: builder.mutation({
      query: (data) => ({
        url: "/api/mailing-templates/create-block",
        method: "POST",
        body: data,
      }),
    }),

    // Prévisualiser un template
    previewMailingTemplate: builder.mutation({
      query: (id) => ({
        url: `/api/mailing-templates/${id}/preview`,
        method: "POST",
      }),
    }),

    // Prévisualiser des blocs (sans sauvegarder)
    previewBlocks: builder.mutation({
      query: (data) => ({
        url: "/api/mailing-templates/preview-blocks",
        method: "POST",
        body: data,
      }),
    }),

    // Prévisualiser un seul bloc
    previewSingleBlock: builder.mutation({
      query: (data) => ({
        url: "/api/mailing-templates/preview-block",
        method: "POST",
        body: data,
      }),
    }),

    // Seed des templates par défaut
    seedDefaultTemplates: builder.mutation({
      query: () => ({
        url: "/api/mailing-templates/seed-defaults",
        method: "POST",
      }),
      invalidatesTags: [
        { type: "MailingTemplate", id: "LIST" },
        { type: "MailingTemplate", id: "DEFAULTS" },
        { type: "MailingTemplate", id: "STATS" },
      ],
    }),
  }),
});

export const {
  // Queries
  useGetMailingTemplatesQuery,
  useGetDefaultMailingTemplatesQuery,
  useGetMailingTemplateByIdQuery,
  useLazyGetMailingTemplateByIdQuery,
  useGetBlockTypesQuery,
  useGetTemplateCategoriesQuery,
  useGetMailingTemplateStatsQuery,
  // Mutations
  useCreateMailingTemplateMutation,
  useUpdateMailingTemplateMutation,
  useDeleteMailingTemplateMutation,
  useDuplicateMailingTemplateMutation,
  useCreateBlockMutation,
  usePreviewMailingTemplateMutation,
  usePreviewBlocksMutation,
  usePreviewSingleBlockMutation,
  useSeedDefaultTemplatesMutation,
} = mailingTemplateApiSlice;