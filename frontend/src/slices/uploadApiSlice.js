import { apiSlice } from "./apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload d'une seule image
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
        // Ne pas définir Content-Type, laissez le navigateur le faire pour FormData
      }),
    }),

    // Upload de plusieurs images (max 5)
    uploadMultipleImages: builder.mutation({
      query: (formData) => ({
        url: "/api/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadMultipleImagesMutation,
} = uploadApiSlice;