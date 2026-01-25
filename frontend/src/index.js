import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";

import PrivateRoute from "./components/utils/PrivateRoute";
import AdminRoute from "./components/utils/AdminRoute";
import ProRoute from "./components/utils/ProRoute";

// Pages publiques
import HomeScreen from "./screens/public/HomeScreen/HomeScreen";
import ProductsScreen from "./screens/public/ProductScreen/ProductScreen";
import ProductDetailScreen from "./screens/public/ProductDetailScreen/ProductDetailScreen";
import UniverseScreen from "./screens/public/UniverseScreen/UniverseScreen";
import LoginScreen from "./screens/auth/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen/RegisterScreen";
import AboutScreen from "./screens/public/AboutScreen";
import ContactScreen from "./screens/public/ContactScreen/ContactScreen";
import CartScreen from "./screens/public/CartScreen/CartScreen";
import ConditionsScreen from "./screens/public/ConditionsScreen/ConditionsScreen";
import CheckoutScreen from "./screens/public/CheckoutScreen/CheckoutScreen";

// Pages privées (utilisateur connecté)
import ProfileScreen from "./screens/Private/ProfilScreen/ProfilScreen";

// Admin
import AdminLayout from "./components/Layout/AdminLayout/AdminLayout";
import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen/AdminDashboardScreen";
import ProductListScreen from "./screens/admin/AdminProductListScreen/ProductListScreen";
import ProductEditScreen from "./screens/admin/AdminProductEditScreen/AdminEditProductScreen";
import UniverseListScreen from "./screens/admin/AdminUniverListScreen/AdminUniverseListScreen";
import SubUniverseListScreen from "./screens/admin/AdminSubUniverseListScreen/AdminListUniverseScreen";
import AdminUserListScreen from "./screens/admin/AdminUserListScreen/AdminUserListScreen";
import AdminProRequestListScreen from "./screens/admin/AdminProRequestScreen/AdminProRequestListScreen";
import AdminProOrderListScreen from "./screens/admin/AdminProOrderListScreen/AdminProOrderListScreen";
import AdminReapproRequestListScreen from "./screens/admin/AdminReapproRequestListScreen/AdminReapproRequestListScreen";
import AdminProspectListScreen from "./screens/admin/AdminProspectListScreen/AdminProspectListScreen";
import AdminContactListScreen from "./screens/admin/AdminContactListScreen/AdminContactListScreen";
import AdminOrderListScreen from "./screens/admin/AdminOrderListScreen/AdminOrderListScreen";
import AdminMailingScreen from "./screens/admin/AdminMaillingScreen/AdminMaillingScreen";
import AdminMailingEditorScreen from "./screens/admin/AdminMailingEditorScreen/AdminMailingEditorScreen";

// Admin - Veilles
import AdminVeilleListScreen from "./screens/admin/AdminVeilleListScreen/AdminVeilleListScreen";
import AdminVeilleEditScreen from "./screens/admin/AdminVeilleEditScreen/AdminVeilleEditScreen";

// Pro
import ProLayout from "./components/Layout/ProLayout/ProLayout";
import ProDashboardScreen from "./screens/pro/ProDashboardScreen/ProDashboardScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      
      {/* Routes publiques */}
      <Route index element={<HomeScreen />} />
      <Route path="products" element={<ProductsScreen />} />
      <Route path="product/:id" element={<ProductDetailScreen />} />
      <Route path="about" element={<AboutScreen />} />
      <Route path="contact" element={<ContactScreen />} />
      <Route path="collection/:slug" element={<UniverseScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />
      <Route path="cart" element={<CartScreen />} />
      <Route path="conditions-generales" element={<ConditionsScreen />} />
      <Route path="checkout" element={<CheckoutScreen />} />

      {/* Routes privées (tous les users connectés) */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="profile" element={<ProfileScreen />} />
      </Route>

      {/* Routes Pro */}
      <Route path="pro" element={<ProRoute />}>
        <Route element={<ProLayout />}>
          <Route path="dashboard" element={<ProDashboardScreen />} />
        </Route>
      </Route>

      {/* Routes Admin */}
      <Route path="admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardScreen />} />
          
          {/* Catalogue */}
          <Route path="products" element={<ProductListScreen />} />
          <Route path="products/create" element={<ProductEditScreen />} />
          <Route path="products/:id/edit" element={<ProductEditScreen />} />
          <Route path="universes" element={<UniverseListScreen />} />
          <Route path="subuniverses" element={<SubUniverseListScreen />} />
          
          {/* Utilisateurs */}
          <Route path="users" element={<AdminUserListScreen />} />
          
          {/* Espace Pro */}
          <Route path="pro-requests" element={<AdminProRequestListScreen />} />
          <Route path="pro-orders" element={<AdminProOrderListScreen />} />
          <Route path="reappro-requests" element={<AdminReapproRequestListScreen />} />
          
          {/* Marketing */}
          <Route path="prospects" element={<AdminProspectListScreen />} />
          <Route path="mailing" element={<AdminMailingScreen />} />
          <Route path="contacts" element={<AdminContactListScreen />} />

          {/* Commandes */}
          <Route path="orders" element={<AdminOrderListScreen />} />

          {/* Veilles */}
          <Route path="veilles" element={<AdminVeilleListScreen />} />
          <Route path="veilles/create" element={<AdminVeilleEditScreen />} />
          <Route path="veilles/:id/edit" element={<AdminVeilleEditScreen />} />
        </Route>

        {/* Éditeur Mailing - SANS AdminLayout pour avoir tout l'écran */}
        <Route path="mailing/editor" element={<AdminMailingEditorScreen />} />
        <Route path="mailing/editor/:id" element={<AdminMailingEditorScreen />} />
      </Route>

    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);