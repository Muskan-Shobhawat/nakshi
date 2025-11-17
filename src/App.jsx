import "./App.css";
import NavbarNakshi from "./Components/NavbarNakshi.jsx";
import HeroSection from "./Components/Home/HeroSection.jsx";
import ExploreSection from "./Components/Home/ExploreSection.jsx";
import CategoryGrid from "./Components/Home/CategoryGrid.jsx";
import StorySection from "./Components/Home/StorySection.jsx";
import FooterNakshi from "./Components/FooterNakshi.jsx";
import Shop from "./Components/Shop/Shop.jsx";
import DeliveryDetails from "./Components/Orders/DeliveryDetails.jsx";
import Cart from "./Components/Orders/Cart.jsx";
import ProductDetails from "./Components/ProductDetail/ProductDetails.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminPanel from "./Components/Admin/AdminPanel.jsx";
import MembersTable from "./Components/Admin/Members/MembersTable.jsx";
import UsersPage from "./Components/Admin/Users/UsersTable.jsx";
import ProductsTable from "./Components/Admin/Products/ProductsTable.jsx";
import TrendingSection from "./Components/Home/TrendingSection.jsx";
import GenderShowcase from "./Components/Home/GenderShowcase.jsx";
import Highlight from "./Components/Home/Highlight.jsx";
import AccountPage from "./Components/UserBased/AccountPage.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import About from "./Components/About/About.jsx";
import Login from "./Components/OTP/Login.jsx";
import Register from "./Components/OTP/Register.jsx";
import React from "react";

// ✅ Layout Wrapper
function Layout({ children }) {
  return (
    <>
      <NavbarNakshi />
      {children}
      <FooterNakshi />
    </>
  );
}

// ProtectedRoute: checks token presence
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// AdminRoute: checks both token AND stored user role === "admin"
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userJSON = localStorage.getItem("user");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!userJSON) {
    // if token but no user stored, treat as not admin and redirect to home
    return <Navigate to="/" replace />;
  }
  try {
    const user = JSON.parse(userJSON);
    if (user?.role === "admin") {
      return children;
    }
    return <Navigate to="/" replace />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
}

// GuestOnly remains same (redirect if token exists)
function GuestOnly({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout>
          <HeroSection />
          <ExploreSection />
          <TrendingSection />
          <CategoryGrid />
          <GenderShowcase />
          <Highlight />
          <StorySection />
        </Layout>
      ),
    },
    {
      path: "/shop",
      element: (
        <Layout>
          <Shop />
        </Layout>
      ),
    },
    {
      path: "/shop/rings", // 🔥 REQUIRED for Rings tab
      element: (
        <Layout>
          <Shop />
        </Layout>
      ),
    },
    {
      path: "/shop/earrings", // 🔥 REQUIRED for Earrings tab
      element: (
        <Layout>
          <Shop />
        </Layout>
      ),
    },
    {
      path: "/shop/new",
      element: (
        <Layout>
          <Shop />
        </Layout>
      ),
    },
    {
      path: "/product/:id",
      element: (
        <Layout>
          <ProductDetails />
        </Layout>
      ),
    },
    {
      path: "/cart",
      element: (
        <ProtectedRoute>
          <Layout>
            <Cart />
            <DeliveryDetails />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      ),
      children: [
        { index: true, element: <Navigate to="members" /> },
        { path: "members", element: <MembersTable /> },
        { path: "users", element: <UsersPage /> },
        { path: "products", element: <ProductsTable /> },
      ],
    },
    {
      path: "/account",
      element: (
        <ProtectedRoute>
          <Layout>
            <AccountPage />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/contact",
      element: (
        <Layout>
          <Contact />
        </Layout>
      ),
    },
    {
      path: "/about",
      element: (
        <Layout>
          <About />
        </Layout>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestOnly>
          <Layout>
            <Login />
          </Layout>
        </GuestOnly>
      ),
    },
    {
      path: "/register",
      element: (
        <GuestOnly>
          <Layout>
            <Register />
          </Layout>
        </GuestOnly>
      ),
    },
    // Optional: 404 fallback
    {
      path: "*",
      element: (
        <Layout>
          <h2
            style={{
              textAlign: "center",
              padding: "10vh 0",
              color: "#a60019",
            }}
          >
            404 — Page Not Found
          </h2>
        </Layout>
      ),
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
