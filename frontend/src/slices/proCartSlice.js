import { createSlice } from "@reduxjs/toolkit";

// Récupérer le panier Pro depuis le localStorage
const initialState = {
  items: localStorage.getItem("proCartItems")
    ? JSON.parse(localStorage.getItem("proCartItems"))
    : [],
  shippingAddress: localStorage.getItem("proShippingAddress")
    ? JSON.parse(localStorage.getItem("proShippingAddress"))
    : null,
  shippingMethod: localStorage.getItem("proShippingMethod") || "pickup",
  paymentMethod: localStorage.getItem("proPaymentMethod") || "invoice",
  customerNotes: "",
};

// Helper pour calculer les prix
const calculatePrices = (items, discountRate = 0) => {
  // Sous-total (prix catalogue)
  const catalogTotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  // Sous-total avec remise Pro
  const subtotal = items.reduce(
    (acc, item) => acc + item.proPrice * item.quantity,
    0
  );

  // Remise totale
  const discountAmount = catalogTotal - subtotal;

  return {
    catalogTotal,
    subtotal,
    discountAmount,
    discountRate,
  };
};

const proCartSlice = createSlice({
  name: "proCart",
  initialState,
  reducers: {
    // Ajouter un article au panier Pro
    addToProCart: (state, action) => {
      const { product, quantity, discountRate } = action.payload;

      // Calculer le prix Pro
      const proPrice = Math.round(product.price * (1 - discountRate / 100));

      const existingItem = state.items.find(
        (item) => item.product === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.lineTotal = existingItem.proPrice * existingItem.quantity;
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          image: product.image,
          unitPrice: product.price,
          proPrice,
          quantity,
          lineTotal: proPrice * quantity,
          countInStock: product.countInStock,
        });
      }

      // Sauvegarder dans localStorage
      localStorage.setItem("proCartItems", JSON.stringify(state.items));
    },

    // Mettre à jour la quantité d'un article
    updateProCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      const item = state.items.find((item) => item.product === productId);
      if (item) {
        item.quantity = quantity;
        item.lineTotal = item.proPrice * quantity;
      }

      localStorage.setItem("proCartItems", JSON.stringify(state.items));
    },

    // Supprimer un article du panier
    removeFromProCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product !== productId);
      localStorage.setItem("proCartItems", JSON.stringify(state.items));
    },

    // Vider le panier
    clearProCart: (state) => {
      state.items = [];
      state.customerNotes = "";
      localStorage.removeItem("proCartItems");
    },

    // Mettre à jour l'adresse de livraison
    setProShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("proShippingAddress", JSON.stringify(action.payload));
    },

    // Mettre à jour le mode de livraison
    setProShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
      localStorage.setItem("proShippingMethod", action.payload);
    },

    // Mettre à jour le mode de paiement
    setProPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("proPaymentMethod", action.payload);
    },

    // Mettre à jour les notes client
    setProCustomerNotes: (state, action) => {
      state.customerNotes = action.payload;
    },

    // Réinitialiser tout après une commande
    resetProCart: (state) => {
      state.items = [];
      state.customerNotes = "";
      localStorage.removeItem("proCartItems");
    },
  },
});

export const {
  addToProCart,
  updateProCartItemQuantity,
  removeFromProCart,
  clearProCart,
  setProShippingAddress,
  setProShippingMethod,
  setProPaymentMethod,
  setProCustomerNotes,
  resetProCart,
} = proCartSlice.actions;

// Selectors
export const selectProCartItems = (state) => state.proCart.items;
export const selectProCartItemsCount = (state) =>
  state.proCart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectProCartSubtotal = (state) =>
  state.proCart.items.reduce((acc, item) => acc + item.lineTotal, 0);
export const selectProCartCatalogTotal = (state) =>
  state.proCart.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
export const selectProShippingAddress = (state) => state.proCart.shippingAddress;
export const selectProShippingMethod = (state) => state.proCart.shippingMethod;
export const selectProPaymentMethod = (state) => state.proCart.paymentMethod;
export const selectProCustomerNotes = (state) => state.proCart.customerNotes;

export default proCartSlice.reducer;