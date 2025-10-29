// import { useState } from 'react'
import "./App.css";
import NavbarNakshi from "./Components/NavbarNakshi.jsx";
import HeroSection from "./Components/Home/HeroSection.jsx";
import ExploreSection from "./Components/Home/ExploreSection.jsx";
import CategoryGrid from "./Components/Home/CategoryGrid.jsx";
import PromoSection from "./Components/Home/PromoSection.jsx";
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

function Layout({ children }) {
  return (
    <>
      <NavbarNakshi />
      {children}
      <FooterNakshi />
    </>
  );
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
          {/* <PromoSection /> */}
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
        <Layout>
          <Cart />
          <DeliveryDetails />
        </Layout>
      ),
    },
    {
      path: "/admin",
      element: <AdminPanel />,
      children: [
        { index: true, element: <Navigate to="members" /> }, // default redirect
        { path: "members", element: <MembersTable /> },
        { path: "users", element: <UsersPage /> },
        { path: "products", element: <ProductsTable /> },
      ],
    },
    {
      path: "/account",
      element: (
        <Layout>
          <AccountPage />
        </Layout>
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
  ]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
