import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: "include", // Important pour les cookies d'authentification
  }),
  tagTypes: [
    "Product",
    "User",
    "Order",
    "Universe",
    "SubUniverse",
    "Prospect",
    "Contact",
    "Mailing",
    "NewsletterCampaign",
    "ProRequest",
    "ProOrder",
    "ReapproRequest",
    "MailingTemplate"
  ],
  endpoints: (builder) => ({}),
});