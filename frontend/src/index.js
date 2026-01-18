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

import ProductsScreen from "./screens/ProductsScreen/Products.jsx";
import ProductScreen from "./screens/ProductSreen/ProductScreen";
import CartScreen from "./screens/CartScreen/CartScreen";
import NotFoundScreen from "./screens/NotFoundScrenn/NotFoundScreen";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import ShippingScreen from "./screens/Private/ShippingScreen/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import PaymentScreen from "./screens/Private/PaymentScreen/PaymentScreen";
import PlaceOrderScreen from "./screens/Private/PlaceOrderScreen/PlaceOrderScreen";
import PartnersScreen from "./screens/PartnersScreen/PartnersScreen";
import ContactScreen from "./screens/ContactScreen/ContactScreen";
import AdminRoute from "./components/AdminRoute";

import AdminDashboardScreen from "./screens/admin/AdminDashboardScreen";
import AdminContactsScreen from "./screens/admin/AdminContactScreen";
import AdminContactDetailScreen from "./screens/admin/AdminContactDetailsSreen";
import AdminLayout from "./screens/admin/AdminSidebar/AdminLayout";
import AdminUsersScreen from "./screens/admin/AdminUsersScreen";
import AdminOrdersScreen from "./screens/admin/AdminOrdersScreen";
import AdminOrderDetailScreen from "./screens/admin/AdminOrderDetailsScreen";
import AdminProductScreen from "./screens/admin/AdminProductsScreen";
import AdminProductDetailsScreen from "./screens/admin/AdminProductDetailsScreen";
import MentionsLegalesScreen from "./screens/legal/MentionsLegalesScreen";
import PolitiqueConfidentialiteScreen from "./screens/legal/PolitiqueConfidentialiteScreen";
import PolitiqueCookiesScreen from "./screens/legal/PolitiqueCookiesScreen";
import CGVScreen from "./screens/legal/CGVScreen";
import CGUScreen from "./screens/legal/CGUScreen";
import LandingPage from "./screens/LandingPage/LandingPage.jsx";
import AboutScreen from "./screens/AboutScreen/AboutScreen.jsx";
import AdminUniversesScreen from "./screens/admin/AdminUniversesScreen.jsx";
import UniversesScreen from "./screens/UniversesScreen/UniversesScreen.jsx";
import UniverseProductsScreen from "./screens/UniverseProductsScreen/UniverseProdutsScreen.jsx";
import AdminSubUniversesScreen from "./screens/admin/AdminSubUniversesScreen.jsx";
import SubUniversesProductsScreen from "./screens/SubUniversesScreen/SubUniversesProductsScreen.jsx";
import AdminProspectsScreen from "./screens/admin/AdminProspectsScreen.jsx";
import AdminMailingScreen from './screens/admin/AdminMailingScreen';
import AdminCampaignEditScreen from './screens/admin/AdminCampaignEditScreen';
import AdminCampaignPreviewScreen from './screens/admin/AdminCampaignPreviewScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<LandingPage />} />

      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/universes" element={<UniversesScreen />} />
  
      <Route path="/universe/:slug" element={<UniverseProductsScreen />} />
     <Route path="/universes" element={<UniversesScreen />} />
<Route path="/universes/:slug/:subSlug" element={<SubUniversesProductsScreen />} />
<Route path="/universes/:slug" element={<UniverseProductsScreen />} />
      <Route path="/products" element={<ProductsScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/partners" element={<PartnersScreen />} />
      <Route path="/contact" element={<ContactScreen />} />

      <Route path="/about" element={<AboutScreen />} />

      <Route path="/mentions-legales" element={<MentionsLegalesScreen />} />
      <Route
        path="/politique-confidentialite"
        element={<PolitiqueConfidentialiteScreen />}
      />
      <Route path="/politique-cookies" element={<PolitiqueCookiesScreen />} />
      <Route path="/cgv" element={<CGVScreen />} />
      <Route path="/cgu" element={<CGUScreen />} />

      {/* Route privée */}
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
      </Route>

      {/* Routes Admin avec Layout */}
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardScreen />} />
          <Route path="contacts" element={<AdminContactsScreen />} />
          <Route path="universes" element={<AdminUniversesScreen />} />
          <Route path="subuniverses" element={<AdminSubUniversesScreen />} />
          <Route path="contacts/:id" element={<AdminContactDetailScreen />} />
          <Route path="users" element={<AdminUsersScreen />} />
         

          <Route path="orders" element={<AdminOrdersScreen />} />
          <Route path="/admin/products" element={<AdminProductScreen />} />
          <Route
            path="/admin/products/create"
            element={<AdminProductDetailsScreen />}
          />
              <Route path="/admin/prospects" element={<AdminProspectsScreen />} />
          <Route
            path="/admin/products/:id"
            element={<AdminProductDetailsScreen />}
          />
          <Route path="orders/:id" element={<AdminOrderDetailScreen />} />
        </Route>

        <Route path="/admin/mailing" element={<AdminMailingScreen />} />
<Route path="/admin/mailing/new" element={<AdminCampaignEditScreen />} />
<Route path="/admin/mailing/:id/edit" element={<AdminCampaignEditScreen />} />
<Route path="/admin/mailing/:id/preview" element={<AdminCampaignPreviewScreen />} />
      </Route>

      <Route path="*" element={<NotFoundScreen />} />
    </Route>,
  ),
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
