/**
 * Navbar.tsx
 *
 * Componente de barra de navegação principal que:
 * - Exibe logo, barra de pesquisa e links de navegação
 * - Adapta-se para layouts desktop e mobile
 * - Gerencia menu de navegação móvel
 * - Mostra contador de itens no carrinho
 * - Controla estado de autenticação do usuário
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  Tag,
  Heart,
  LogOut,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

/**
 * Componente Navbar
 *
 * Barra de navegação responsiva que se adapta entre layouts desktop e mobile.
 * Fornece acesso às principais funcionalidades e seções do aplicativo.
 */
const Navbar: React.FC = () => {
  // Estado para controlar a abertura/fechamento do menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook para detectar se o dispositivo é móvel
  const isMobile = useIsMobile();

  // Obtém o número total de itens no carrinho do contexto
  const { totalItems } = useCart();

  // Obtém informações de autenticação do contexto
  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-2 md:px-4">
        {/* Logo da farmácia com link para a página inicial */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Logo Drogaria São Rafael"
            className="h-26 md:h-28"
          />
        </Link>

        {/* Barra de pesquisa (visível apenas em telas médias e maiores) */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <Input
            type="text"
            placeholder="Buscar medicamentos, produtos..."
            className="w-full pl-8"
          />
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Navegação para desktop (visível apenas em telas médias e maiores) */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/categories"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Categorias
          </Link>
          <Link
            to="/offers"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Ofertas
          </Link>

          {/* Exibe botão de conta ou login dependendo do estado de autenticação */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[80px]">{user?.name}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                <span>Entrar</span>
              </Link>
            </Button>
          )}

          {/* Botão do carrinho com contador de itens */}
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-4 w-4" />
              {/* Badge de contagem de itens (visível apenas quando há itens) */}
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-pharmacy-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </nav>

        {/* Botões de navegação para dispositivos móveis */}
        <div className="md:hidden flex items-center gap-2">
          {/* Botão do carrinho em versão mobile */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {/* Badge de contagem de itens (visível apenas quando há itens) */}
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-pharmacy-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Botão para abrir/fechar o menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Menu de navegação para dispositivos móveis (visível apenas quando ativado) */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in py-4 px-4 bg-background border-t">
          {/* Barra de pesquisa para dispositivos móveis */}
          <div className="flex items-center relative mb-4">
            <Input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-8"
            />
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Links de navegação para dispositivos móveis */}
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link
              to="/categories"
              className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Tag className="h-4 w-4" />
              Categorias
            </Link>
            <Link
              to="/offers"
              className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className="h-4 w-4" />
              Ofertas
            </Link>

            {/* Exibe link de conta ou login dependendo do estado de autenticação */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Minha Conta</span>
                </Link>
                <button
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2 w-full text-left"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Entrar / Cadastrar</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
