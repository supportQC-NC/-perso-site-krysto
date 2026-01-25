import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // AUTH ENDPOINTS
    // ==========================================

    login: builder.mutation({
      query: (data) => ({
        url: "/api/users/login",
        method: "POST",
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "/api/users",
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),
    }),

    // ==========================================
    // PASSWORD RESET ENDPOINTS (NOUVEAU)
    // ==========================================

    // Demander un email de réinitialisation
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/api/users/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Réinitialiser le mot de passe avec le token
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/api/users/reset-password/${token}`,
        method: "PUT",
        body: { password },
      }),
    }),

    // ==========================================
    // USER PROFILE ENDPOINTS
    // ==========================================

    getProfile: builder.query({
      query: () => ({
        url: "/api/users/profile",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/api/users/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ==========================================
    // ADMIN - BASIC USER MANAGEMENT
    // ==========================================

    getUsers: builder.query({
      query: (params) => ({
        url: "/api/users",
        params,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/api/users/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Stats générales
    getUserStats: builder.query({
      query: () => ({
        url: "/api/users/stats",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ==========================================
    // ADMIN - PRO MANAGEMENT
    // ==========================================

    // Obtenir les stats Pro
    getUserProStats: builder.query({
      query: () => ({
        url: "/api/users/pro-stats",
      }),
      providesTags: ["User"],
    }),

    // Obtenir tous les utilisateurs Pro
    getProUsers: builder.query({
      query: (params) => ({
        url: "/api/users/pro",
        params,
      }),
      providesTags: ["User"],
    }),

    // Passer un utilisateur en Pro
    setUserAsPro: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/users/${id}/set-pro`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Mettre à jour les infos Pro
    updateUserProInfo: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/users/${id}/pro-info`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Retirer le statut Pro
    removeUserPro: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}/remove-pro`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Suspendre un compte Pro
    suspendUserPro: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}/suspend-pro`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Réactiver un compte Pro
    reactivateUserPro: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}/reactivate-pro`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  // Password Reset (NOUVEAU)
  useForgotPasswordMutation,
  useResetPasswordMutation,
  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  // Admin - Basic
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Admin - Pro Management
  useGetUserProStatsQuery,
  useGetProUsersQuery,
  useSetUserAsProMutation,
  useUpdateUserProInfoMutation,
  useRemoveUserProMutation,
  useSuspendUserProMutation,
  useReactivateUserProMutation,
} = userApiSlice;