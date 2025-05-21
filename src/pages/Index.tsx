/**
 * Index.tsx
 *
 * Página inicial da aplicação que exibe:
 * - Hero banner principal
 * - Categorias de produtos
 * - Seções de produtos em destaque
 * - Rodapé com informações legais
 */

import React from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { healthProductsData, hygieneProductsData } from "@/lib/products";
import { sampleProducts } from "./CategoryProducts";
import { offeredProducts } from "./ProductOffers";

/**
 * Componente Index
 *
 * Renderiza a página inicial da aplicação com múltiplas seções:
 * - Barra de navegação superior
 * - Banner hero promocional
 * - Categorias de produtos
 * - Múltiplas seções de produtos em destaque
 * - Rodapé com informações legais e links
 *
 * Utiliza o hook useIsMobile para adaptar o layout em dispositivos móveis
 */
const Index = () => {
  // Verifica se o dispositivo é móvel para adaptar a interface
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra de navegação principal */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="flex-1">
        {/* Banner principal (hero) */}
        <Hero />

        {/* Seções de produtos com espaçamento responsivo */}
        <div className="space-y-4 md:space-y-8">
          {/* Exibição das categorias de produtos */}
          <ProductCategories />

          {/* Seção de ofertas em destaque */}
          <FeaturedProducts
            title="Ofertas em Destaque"
            seeAllLink="/offers"
            productList={offeredProducts}
            showCarousel={true}
          />

          {/* Seção de produtos mais vendidos */}
          <FeaturedProducts
            title="Mais Vendidos"
            seeAllLink="/best-sellers"
            showCarousel={true}
          />

          {/* Seção de produtos de saúde essenciais */}
          <FeaturedProducts
            title="Produtos de Saúde Essenciais"
            seeAllLink="/categories/saude"
            productList={sampleProducts.saude}
            showCarousel={isMobile}
          />

          {/* Seção de produtos de higiene */}
          <FeaturedProducts
            title="Produtos de Higiene"
            seeAllLink="/categories/higiene"
            productList={sampleProducts.higiene}
            showCarousel={isMobile}
          />
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Index;
