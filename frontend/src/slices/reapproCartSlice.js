import { createSlice } from "@reduxjs/toolkit";

// État initial
const initialState = {
  items: localStorage.getItem("reapproCartItems")
    ? JSON.parse(localStorage.getItem("reapproCartItems"))
    : [],
  priority: "normal",
  requestedDeliveryDate: null,
  deliveryMethod: "pickup",
  deliveryAddress: {
    useDefault: true,
    companyName: "",
    contactName: "",
    street: "",
    city: "",
    postalCode: "",
    country: "Nouvelle-Calédonie",
    phone: "",
  },
  customerNotes: "",
};

const reapproCartSlice = createSlice({
  name: "reapproCart",
  initialState,
  reducers: {
    // Ajouter un article à la demande de réappro
    addToReapproCart: (state, action) => {
      const { product, currentStock, requestedQuantity } = action.payload;

      const existingItem = state.items.find(
        (item) => item.product === product._id
      );

      if (existingItem) {
        existingItem.requestedQuantity += requestedQuantity;
        existingItem.currentStock = currentStock;
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          image: product.image,
          unitPrice: product.price,
          currentStock,
          requestedQuantity,
          notes: "",
        });
      }

      localStorage.setItem("reapproCartItems", JSON.stringify(state.items));
    },

    // Mettre à jour un article
    updateReapproCartItem: (state, action) => {
      const { productId, currentStock, requestedQuantity, notes } = action.payload;

      const item = state.items.find((item) => item.product === productId);
      if (item) {
        if (currentStock !== undefined) item.currentStock = currentStock;
        if (requestedQuantity !== undefined) item.requestedQuantity = requestedQuantity;
        if (notes !== undefined) item.notes = notes;
      }

      localStorage.setItem("reapproCartItems", JSON.stringify(state.items));
    },

    // Supprimer un article
    removeFromReapproCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product !== productId);
      localStorage.setItem("reapproCartItems", JSON.stringify(state.items));
    },

    // Vider le panier
    clearReapproCart: (state) => {
      state.items = [];
      state.customerNotes = "";
      state.priority = "normal";
      state.requestedDeliveryDate = null;
      localStorage.removeItem("reapproCartItems");
    },

    // Définir la priorité
    setReapproPriority: (state, action) => {
      state.priority = action.payload;
    },

    // Définir la date de livraison souhaitée
    setReapproRequestedDeliveryDate: (state, action) => {
      state.requestedDeliveryDate = action.payload;
    },

    // Définir le mode de livraison
    setReapproDeliveryMethod: (state, action) => {
      state.deliveryMethod = action.payload;
    },

    // Définir l'adresse de livraison
    setReapproDeliveryAddress: (state, action) => {
      state.deliveryAddress = {
        ...state.deliveryAddress,
        ...action.payload,
      };
    },

    // Utiliser l'adresse par défaut
    useDefaultReapproAddress: (state) => {
      state.deliveryAddress = {
        useDefault: true,
        companyName: "",
        contactName: "",
        street: "",
        city: "",
        postalCode: "",
        country: "Nouvelle-Calédonie",
        phone: "",
      };
    },

    // Définir les notes client
    setReapproCustomerNotes: (state, action) => {
      state.customerNotes = action.payload;
    },

    // Réinitialiser après envoi
    resetReapproCart: (state) => {
      state.items = [];
      state.priority = "normal";
      state.requestedDeliveryDate = null;
      state.deliveryMethod = "pickup";
      state.deliveryAddress = {
        useDefault: true,
        companyName: "",
        contactName: "",
        street: "",
        city: "",
        postalCode: "",
        country: "Nouvelle-Calédonie",
        phone: "",
      };
      state.customerNotes = "";
      localStorage.removeItem("reapproCartItems");
    },
  },
});

export const {
  addToReapproCart,
  updateReapproCartItem,
  removeFromReapproCart,
  clearReapproCart,
  setReapproPriority,
  setReapproRequestedDeliveryDate,
  setReapproDeliveryMethod,
  setReapproDeliveryAddress,
  useDefaultReapproAddress,
  setReapproCustomerNotes,
  resetReapproCart,
} = reapproCartSlice.actions;

// Selectors
export const selectReapproCartItems = (state) => state.reapproCart.items;
export const selectReapproCartItemsCount = (state) =>
  state.reapproCart.items.reduce((acc, item) => acc + item.requestedQuantity, 0);
export const selectReapproPriority = (state) => state.reapproCart.priority;
export const selectReapproRequestedDeliveryDate = (state) =>
  state.reapproCart.requestedDeliveryDate;
export const selectReapproDeliveryMethod = (state) =>
  state.reapproCart.deliveryMethod;
export const selectReapproDeliveryAddress = (state) =>
  state.reapproCart.deliveryAddress;
export const selectReapproCustomerNotes = (state) =>
  state.reapproCart.customerNotes;

export default reapproCartSlice.reducer;