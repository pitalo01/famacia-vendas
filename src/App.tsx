/**
 * App.tsx
 *
 * Componente principal da aplicação que configura:
 * - Providers: QueryClient para gerenciamento de estado, TooltipProvider para tooltips
 * - Toasters: Componentes para exibição de notificações
 * - Roteamento: Configuração das rotas da aplicação
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { OrderProvider } from "@/lib/order-context";
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
import UserProfile from "./pages/UserProfile";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import Orders from "./pages/Orders";

// Criação da instância do QueryClient para gerenciamento de consultas e cache
const queryClient = new QueryClient();

/**
 * Componente App
 *
 * Estrutura principal da aplicação que define:
 * - Provider do React Query para gerenciamento de estado e cache
 * - Provider de autenticação para gerenciar usuários
 * - Provider de carrinho de compras para gerenciar estado e persistência
 * - Provider de pedidos para gerenciar histórico e status de pedidos
 * - Provider para tooltips da interface
 * - Componentes de notificação (Toaster e Sonner)
 * - Configuração de rotas usando React Router
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rota da página inicial */}
                <Route path="/" element={<Index />} />

                {/* Rotas de autenticação */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rota do perfil do usuário */}
                <Route path="/profile" element={<UserProfile />} />

                {/* Rotas de carrinho e checkout */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Rotas de pedidos */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<OrderDetail />} />

                {/* Rotas de categorias e produtos */}
                <Route path="/categories" element={<Categories />} />
                <Route
                  path="/categories/:categoryId"
                  element={<CategoryProducts />}
                />
                <Route
                  path="/categories/:categoryId/:subcategoryId"
                  element={<SubCategoryProducts />}
                />
                <Route path="/product/:id" element={<ProductDetail />} />

                {/* Rotas de produtos em destaque */}
                <Route path="/offers" element={<ProductOffers />} />
                <Route path="/best-sellers" element={<BestSellers />} />

                {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CURINGA "*" */}

                {/* Rota para página não encontrada (404) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
