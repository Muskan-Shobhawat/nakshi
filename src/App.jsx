// import { useState } from 'react'
import "./App.css";
import NavbarNakshi from "./Components/NavbarNakshi.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import CategoryGrid from "./Components/CategoryGrid.jsx";
import PromoSection from "./Components/PromoSection.jsx";
import StorySection from "./Components/StorySection.jsx";
import FooterNakshi from "./Components/FooterNakshi.jsx";
import Shop from "./Components/Shop.jsx";
import Cart from "./Components/Cart.jsx";
import ProductDetails from "./Components/ProductDetails.jsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminPanel from "./Components/AdminPanel.jsx";
import MembersTable from "./Components/MembersTable.jsx";
import UsersPage from "./Components/UsersTable.jsx";
import ProductsTable from "./Components/ProductsTable.jsx";

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
          <CategoryGrid />
          <PromoSection />
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
        </Layout>
      ),
    },
    {
      path: "/admin",
      element: (
         <AdminPanel />
      ),
      children: [
        { index: true, element: <Navigate to="members" /> }, // default redirect
        { path: "members", element: <MembersTable /> },
        { path: "users", element: <UsersPage /> },
        { path: "products", element: <ProductsTable /> },
      ],
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
