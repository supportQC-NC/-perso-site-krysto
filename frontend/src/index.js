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
import HomeScreen from "./screens/HomeScreen/HomeScreen";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/partners" element={<PartnersScreen />} />
      <Route path="/contact" element={<ContactScreen />} />

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
          <Route path="contacts/:id" element={<AdminContactDetailScreen />} />
          <Route path="users" element={<AdminUsersScreen />} />

          <Route path="orders" element={<AdminOrdersScreen />} />
          <Route path="orders/:id" element={<AdminOrderDetailScreen />} />
        </Route>
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
