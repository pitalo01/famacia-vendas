import React from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { healthProductsData, hygieneProductsData } from "@/lib/products";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <div className="space-y-4 md:space-y-8">
          <ProductCategories />
          <FeaturedProducts 
            title="Ofertas em Destaque" 
            seeAllLink="/offers" 
            showCarousel={true} 
          />
          <FeaturedProducts 
            title="Mais Vendidos" 
            seeAllLink="/best-sellers" 
            showCarousel={true} 
          />
          <FeaturedProducts 
            title="Produtos de Saúde Essenciais" 
            seeAllLink="/categories/saude" 
            productList={healthProductsData} 
            showCarousel={isMobile}
          />
          <FeaturedProducts 
            title="Produtos de Higiene" 
            seeAllLink="/categories/higiene" 
            productList={hygieneProductsData} 
            showCarousel={isMobile}
          />
        </div>
      </main>
      <footer className="py-4 md:py-6 bg-muted mt-8">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2025 Farmácia Virtual Encantada. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-2 md:space-x-4 text-xs">
            <Link to="/terms" className="hover:underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:underline">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
