import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// Sample data for best selling products
const bestSellingProducts = [
  {
    id: "best1",
    name: "Paracetamol 750mg",
    image: "/placeholder.svg",
    price: 8.99,
    oldPrice: 12.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best2",
    name: "Dipirona 500mg",
    image: "/placeholder.svg",
    price: 6.99,
    oldPrice: 9.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best3",
    name: "Vitamina C 1000mg",
    image: "/placeholder.svg",
    price: 22.5,
    oldPrice: 26.9,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best4",
    name: "Creme Dental",
    image: "/placeholder.svg",
    price: 8.5,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best5",
    name: "Sabonete Líquido",
    image: "/placeholder.svg",
    price: 12.99,
    oldPrice: 15.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best6",
    name: "Protetor Solar FPS 30",
    image: "/placeholder.svg",
    price: 39.9,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best7",
    name: "Álcool em Gel 70%",
    image: "/placeholder.svg",
    price: 15.9,
    oldPrice: 19.9,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best8",
    name: "Enxaguante Bucal",
    image: "/placeholder.svg",
    price: 12.9,
    oldPrice: 15.9,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best9",
    name: "Fralda Premium P",
    image: "/placeholder.svg",
    price: 59.9,
    oldPrice: 69.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best10",
    name: "Hidratante Facial",
    image: "/placeholder.svg",
    price: 34.5,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best11",
    name: "Ibuprofeno 400mg",
    image: "/placeholder.svg",
    price: 15.49,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "best12",
    name: "Lubrificante Ocular",
    image: "/placeholder.svg",
    price: 22.9,
    requiresPrescription: false,
    inStock: true,
  },
];

const BestSellers: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="flex items-center mb-6">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-pharmacy-primary ml-4">
              Produtos Mais Vendidos
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellingProducts.map((product) => (
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
      <footer className="py-6 bg-muted">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
          <div className="mt-2 space-x-4">
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

export default BestSellers;
