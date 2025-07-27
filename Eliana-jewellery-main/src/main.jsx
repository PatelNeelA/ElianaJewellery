// main.jsx (UPDATED)
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./index.css";
import Home from "./Components/Home/Home.jsx";
import CardDetails from "./Components/carddetails/CardDetails.jsx";
import ProductDescription from "./ProductDescription/ProductDescription.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import FavoritesList from "./Components/FavoritesList/FavoritesList.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import store from "./store/Store.js";
import { Provider } from "react-redux";
import { UserProfileProvider } from "./contexts/userContext.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import AdminLayout from "./routes/AdminLayout.jsx";

import ManageCollection from "./Components/Admin/ManageCollection.jsx";
import ManageBlog from "./Components/Admin/ManageBlog.jsx";
import ManageProduct from "./Components/Admin/ManageProduct.jsx"; // Import the new component
import ManageOrder from "./Components/Admin/ManageOrder.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="home" />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "collection/:collectionType", // This route will now display products belonging to a collection
        element: <CardDetails />,
      },
      {
        path: "product/:id", // Changed from collection/:collectionType/:id to a more direct product route
        element: <ProductDescription />,
      },
      {
        path: "favorites",
        element: <FavoritesList />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "admin-login",
        element: <AdminLogin />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "collection", // Changed to plural for consistency
        element: <ManageCollection />,
      },
      {
        path: "products", // New route for managing products
        element: <ManageProduct />,
      },
      {
        path: "blog", // Changed to plural for consistency
        element: <ManageBlog />,
      },
      {
        path: "Orders", // Changed to plural for consistency
        element: <ManageOrder />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <UserProfileProvider>
        <RouterProvider router={router} />
      </UserProfileProvider>
    </Provider>
  </StrictMode>
);
