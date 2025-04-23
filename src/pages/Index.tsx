
import React from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Navbar from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data for product categories to show on homepage
const healthProducts = [
  {
    id: "saude1",
    name: "Termômetro Digital",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude2",
    name: "Medidor de Pressão Arterial",
    image: "https://images.unsplash.com/photo-1563360668-3273bb865ad3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 129.90,
    oldPrice: 159.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude3",
    name: "Oxímetro de Pulso",
    image: "https://images.unsplash.com/photo-1631563019676-dba501a0ddf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 89.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude4",
    name: "Vitamina C 1000mg",
    image: "https://images.unsplash.com/photo-1577348628134-7be655111c11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 22.90,
    oldPrice: 27.90,
    requiresPrescription: false,
    inStock: true,
  },
];

const hygieneProducts = [
  {
    id: "hig1",
    name: "Sabonete Antibacteriano",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 7.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig2",
    name: "Álcool em Gel 70%",
    image: "https://images.unsplash.com/photo-1585717456878-10c8f2bb73f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 15.90,
    oldPrice: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig3",
    name: "Escova Dental",
    image: "https://images.unsplash.com/photo-1612837017391-4b6b7b0be2e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 9.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig4",
    name: "Kit Higiene Viagem",
    image: "https://images.unsplash.com/photo-1585741279714-7db01a860c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 29.90,
    oldPrice: 34.90,
    requiresPrescription: false,
    inStock: true,
  },
];

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
            productList={healthProducts} 
            showCarousel={isMobile}
          />
          <FeaturedProducts 
            title="Produtos de Higiene" 
            seeAllLink="/categories/higiene" 
            productList={hygieneProducts} 
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
