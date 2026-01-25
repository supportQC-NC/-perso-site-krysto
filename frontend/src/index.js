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
import LoginScreen from "./screens/auth/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/auth/RegisterScreen/RegisterScreen";

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
// Pro
import ProLayout from "./components/Layout/ProLayout/ProLayout";
import ProDashboardScreen from "./screens/pro/ProDashboardScreen/ProDashboardScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      
      {/* Routes publiques */}
      <Route index element={<HomeScreen />} />
      <Route path="login" element={<LoginScreen />} />
      <Route path="register" element={<RegisterScreen />} />

      {/* Routes privées (tous les users connectés) */}
      <Route path="" element={<PrivateRoute />}>
        {/* /profile, /my-orders à venir */}
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