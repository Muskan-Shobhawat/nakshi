// import { useState } from 'react'
import "./App.css";
import NavbarNakshi from "./Components/NavbarNakshi.jsx";
import HeroSection from "./Components/HeroSection.jsx";
import CategoryGrid from "./Components/CategoryGrid.jsx";
import PromoSection from "./Components/PromoSection.jsx";
import StorySection from "./Components/StorySection.jsx";
import FooterNakshi from "./Components/FooterNakshi.jsx";
import Shop from "./Components/Shop.jsx";
import ProductDetails from "./Components/ProductDetails.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
