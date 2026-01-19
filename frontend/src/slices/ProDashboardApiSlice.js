import { apiSlice } from "./apiSlice";

export const proDashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==========================================
    // DASHBOARD PRO - Données combinées
    // ==========================================

    // Obtenir les données du dashboard Pro (stats combinées)
    getProDashboardData: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Récupérer les stats des commandes
          const ordersResult = await fetchWithBQ("/api/pro-orders/my-stats");
          if (ordersResult.error) throw ordersResult.error;

          // Récupérer les stats des demandes de réappro
          const reapproResult = await fetchWithBQ("/api/reappro-requests/my-stats");
          if (reapproResult.error) throw reapproResult.error;

          // Récupérer les dernières commandes
          const recentOrdersResult = await fetchWithBQ(
            "/api/pro-orders/my-orders?limit=5&sortBy=createdAt&sortOrder=desc"
          );
          if (recentOrdersResult.error) throw recentOrdersResult.error;

          // Récupérer les dernières demandes de réappro
          const recentReapproResult = await fetchWithBQ(
            "/api/reappro-requests/my-requests?limit=5&sortBy=createdAt&sortOrder=desc"
          );
          if (recentReapproResult.error) throw recentReapproResult.error;

          return {
            data: {
              orderStats: ordersResult.data,
              reapproStats: reapproResult.data,
              recentOrders: recentOrdersResult.data.orders,
              recentReapproRequests: recentReapproResult.data.requests,
            },
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["ProOrder", "ReapproRequest"],
    }),

    // ==========================================
    // CATALOGUE PRO - Produits avec prix Pro
    // ==========================================

    // Obtenir le catalogue avec les prix Pro
    getProCatalog: builder.query({
      query: (params) => ({
        url: "/api/products",
        params: {
          ...params,
          status: "active",
        },
      }),
      // Transformer la réponse pour ajouter les prix Pro
      transformResponse: (response, meta, arg) => {
        // Le discountRate sera appliqué côté frontend avec les infos user
        return response;
      },
      providesTags: ["Product"],
    }),

    // ==========================================
    // PANIER PRO (stocké localement, pas en BDD)
    // ==========================================

    // Note: Le panier Pro est géré via Redux Toolkit classique (slice local)
    // car il n'a pas besoin d'être persisté en BDD
  }),
});

export const {
  useGetProDashboardDataQuery,
  useGetProCatalogQuery,
} = proDashboardApiSlice;