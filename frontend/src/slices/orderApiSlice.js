import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Créer une commande
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    // Obtenir les détails d'une commande
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Payer une commande
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    // Obtenir mes commandes
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Obtenir toutes les commandes (Admin)
    getOrders: builder.query({
      query: ({ status, isPaid, isDelivered } = {}) => {
        let url = ORDERS_URL;
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (isPaid !== undefined) params.append("isPaid", isPaid);
        if (isDelivered !== undefined) params.append("isDelivered", isDelivered);

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;

        return { url };
      },
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),

    // Obtenir les statistiques des commandes (Admin)
    getOrderStats: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/stats`,
      }),
      keepUnusedDataFor: 5,
    }),

    // Marquer une commande comme livrée (Admin)
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
      invalidatesTags: ["Order"],
    }),

    // Mettre à jour le statut d'une commande (Admin)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),

    // Supprimer une commande (Admin)
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useGetOrderStatsQuery,
  useDeliverOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = ordersApiSlice;