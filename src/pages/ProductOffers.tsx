
import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data for offered products
const offeredProducts = [
  {
    id: "1",
    name: "Dipirona Sódica 1g com 10 comprimidos",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 12.99,
    oldPrice: 19.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Vitamina C 1g com 30 comprimidos efervescentes",
    image: "https://images.unsplash.com/photo-1585435557885-28ebd3b15de4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 25.90,
    oldPrice: 35.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "5",
    name: "Protetor Solar FPS 60",
    image: "https://images.unsplash.com/photo-1556227702-a1d34a6eba25?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 42.90,
    oldPrice: 55.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "7",
    name: "Xarope para Tosse",
    image: "https://images.unsplash.com/photo-1550572017-42915b4f8d74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 24.99,
    oldPrice: 29.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "9",
    name: "Suplemento Whey Protein",
    image: "https://images.unsplash.com/photo-1579722582772-71f66d01e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 89.90,
    oldPrice: 109.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "12",
    name: "Vitamina D3 2000UI",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 39.90,
    oldPrice: 49.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off7",
    name: "Hidratante Corporal 400ml",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    oldPrice: 24.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off8",
    name: "Água Micelar 200ml",
    image: "https://images.unsplash.com/photo-1629198735660-e39ea93f5c18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 29.90,
    oldPrice: 39.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off9",
    name: "Repelente Infantil",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 18.50,
    oldPrice: 22.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off10",
    name: "Sabonete Líquido Antibacteriano",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 14.90,
    oldPrice: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off11",
    name: "Aspirina 500mg 20 comprimidos",
    image: "https://images.unsplash.com/photo-1584308666984-91a927ee8269?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 10.90,
    oldPrice: 15.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "off12",
    name: "Pomada para Assaduras",
    image: "https://images.unsplash.com/photo-1628615530920-865e29eabd47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 22.90,
    oldPrice: 29.90,
    requiresPrescription: false,
    inStock: true,
  },
];

const ProductOffers: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-4 md:py-8">
        <div className="container px-3 md:px-4">
          <div className="flex items-center mb-4 md:mb-6">
            <Link to="/">
              <Button variant="ghost" size={isMobile ? "sm" : "default"}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-pharmacy-dark-purple ml-2 md:ml-4">
              Ofertas em Destaque
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {offeredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                oldPrice={product.oldPrice}
                requiresPrescription={product.requiresPrescription}
                inStock={product.inStock}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="py-4 md:py-6 bg-muted mt-6">
        <div className="container text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2025 Farmácia Virtual Encantada. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-2 md:space-x-4">
            <Link to="/terms" className="text-xs hover:underline">Termos de Uso</Link>
            <Link to="/privacy" className="text-xs hover:underline">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductOffers;
