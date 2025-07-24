// main.jsx
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
import AdminLayout from "./routes/AdminLayout.jsx"; // Import the new AdminLayout

import ManageCollection from "./Components/Admin/ManageCollection.jsx";
import ManageBlog from "./Components/Admin/ManageBlog.jsx";

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
        path: "collection/:collectionType",
        element: <CardDetails />,
      },
      {
        path: "collection/:collectionType/:id",
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
    path: "/admin", // Parent path for all admin routes
    element: <AdminLayout />, // Use the AdminLayout for these routes
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />, // Redirect /admin to /admin/dashboard
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "collection", // Example admin route for managing users
        element: <ManageCollection />,
      },
      {
        path: "Blog", // Example admin route for managing products
        element: <ManageBlog />,
      },
      // ... more admin-specific routes
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <UserProfileProvider>
        {" "}
        {/* This is crucial: UserProfileProvider wraps RouterProvider */}
        <RouterProvider router={router} />
      </UserProfileProvider>
    </Provider>
  </StrictMode>
);
