import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample data for offered products
export const offeredProducts = [
  {
    id: "1",
    name: "Dipirona Sódica 1g com 10 comprimidos",
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 12.99,
    oldPrice: 19.99,
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
            <h1 className="text-xl md:text-2xl font-bold text-pharmacy-primary ml-2 md:ml-4">
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
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
          <div className="mt-2 space-x-2 md:space-x-4">
            <Link to="/terms" className="text-xs hover:underline">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-xs hover:underline">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductOffers;
