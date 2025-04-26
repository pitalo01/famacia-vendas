import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import SubCategoryProducts from "./pages/SubCategoryProducts";
import NotFound from "./pages/NotFound";
import ProductOffers from "./pages/ProductOffers";
import BestSellers from "./pages/BestSellers";
import ProductDetail from "./pages/ProductDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categoryId" element={<CategoryProducts />} />
          <Route path="/categories/:categoryId/:subcategoryId" element={<SubCategoryProducts />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/offers" element={<ProductOffers />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
