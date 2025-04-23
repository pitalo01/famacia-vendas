
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu, X, Home, Tag, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-2 md:px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl md:text-2xl font-bold text-pharmacy-purple truncate max-w-[140px] md:max-w-full">
            FarmaciaVirtual
          </span>
        </Link>

        {/* Search (visible on md and larger) */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <Input 
            type="text" 
            placeholder="Buscar medicamentos, produtos..." 
            className="w-full pl-8" 
          />
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
            Categorias
          </Link>
          <Link to="/offers" className="text-sm font-medium hover:text-primary transition-colors">
            Ofertas
          </Link>
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/account">
                <User className="h-4 w-4 mr-2" />
                <span>Minha Conta</span>
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                <span>Entrar</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-pharmacy-purple text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-pharmacy-purple text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in py-4 px-4 bg-background border-t">
          <div className="flex items-center relative mb-4">
            <Input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full pl-8" 
            />
            <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          </div>
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
            {isLoggedIn ? (
              <Link
                to="/account"
                className="text-sm font-medium p-2 hover:bg-muted rounded-md flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Minha Conta</span>
              </Link>
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
