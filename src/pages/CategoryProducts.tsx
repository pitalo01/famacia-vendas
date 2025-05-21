import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// This is sample product data that would normally come from an API
export const sampleProducts = {
  medicamentos: [
    {
      id: "med1",
      name: "Paracetamol 750mg",
      image: "https://via.placeholder.com/200x200?text=Paracetamol",
      price: 8.99,
      oldPrice: 12.99,
      requiresPrescription: false,
    },
    {
      id: "med2",
      name: "Ibuprofeno 400mg",
      image: "https://via.placeholder.com/200x200?text=Ibuprofeno",
      price: 15.49,
      requiresPrescription: false,
    },
    {
      id: "med3",
      name: "Dipirona 500mg",
      image: "https://via.placeholder.com/200x200?text=Dipirona",
      price: 6.99,
      oldPrice: 9.99,
      requiresPrescription: false,
    },
    {
      id: "med4",
      name: "Amoxicilina 500mg",
      image: "https://via.placeholder.com/200x200?text=Amoxicilina",
      price: 29.9,
      requiresPrescription: true,
    },
  ],
  saude: [
    {
      id: "sau1",
      name: "Vitamina C 1000mg",
      image: "https://via.placeholder.com/200x200?text=Vitamina+C",
      price: 22.5,
      oldPrice: 26.9,
      requiresPrescription: false,
    },
    {
      id: "sau2",
      name: "Ômega 3 1000mg",
      image: "https://via.placeholder.com/200x200?text=Omega+3",
      price: 45.99,
      requiresPrescription: false,
    },
    {
      id: "sau3",
      name: "Termômetro Digital",
      image: "https://via.placeholder.com/200x200?text=Termometro",
      price: 19.9,
      requiresPrescription: false,
    },
  ],
  higiene: [
    {
      id: "hig1",
      name: "Creme Dental",
      image: "https://via.placeholder.com/200x200?text=Creme+Dental",
      price: 8.5,
      requiresPrescription: false,
    },
    {
      id: "hig2",
      name: "Sabonete Líquido",
      image: "https://via.placeholder.com/200x200?text=Sabonete",
      price: 12.99,
      oldPrice: 15.99,
      requiresPrescription: false,
    },
    {
      id: "hig3",
      name: "Fio Dental",
      image: "https://via.placeholder.com/200x200?text=Fio+Dental",
      price: 6.99,
      requiresPrescription: false,
    },
  ],
  bebe: [
    {
      id: "bab1",
      name: "Fralda Premium P",
      image: "https://via.placeholder.com/200x200?text=Fralda",
      price: 59.9,
      oldPrice: 69.99,
      requiresPrescription: false,
    },
    {
      id: "bab2",
      name: "Shampoo Infantil",
      image: "https://via.placeholder.com/200x200?text=Shampoo+Infantil",
      price: 18.99,
      requiresPrescription: false,
    },
    {
      id: "bab3",
      name: "Pomada para Assaduras",
      image: "https://via.placeholder.com/200x200?text=Pomada+Assaduras",
      price: 24.5,
      requiresPrescription: false,
    },
  ],
  beleza: [
    {
      id: "bel1",
      name: "Protetor Solar FPS 60",
      image: "https://via.placeholder.com/200x200?text=Protetor+Solar",
      price: 42.9,
      oldPrice: 55.9,
      requiresPrescription: false,
    },
    {
      id: "bel2",
      name: "Shampoo Anti-queda",
      image: "https://via.placeholder.com/200x200?text=Shampoo+Antiqueda",
      price: 29.99,
      requiresPrescription: false,
    },
    {
      id: "bel3",
      name: "Hidratante Facial",
      image: "https://via.placeholder.com/200x200?text=Hidratante",
      price: 34.5,
      requiresPrescription: false,
    },
  ],
  "bem-estar": [
    {
      id: "bem1",
      name: "Óleo Essencial Lavanda",
      image: "https://via.placeholder.com/200x200?text=Oleo+Lavanda",
      price: 35.9,
      requiresPrescription: false,
    },
    {
      id: "bem2",
      name: "Chá Relaxante",
      image: "https://via.placeholder.com/200x200?text=Cha",
      price: 12.5,
      oldPrice: 15.9,
      requiresPrescription: false,
    },
    {
      id: "bem3",
      name: "Máscara de Dormir",
      image: "https://via.placeholder.com/200x200?text=Mascara+Dormir",
      price: 22.99,
      requiresPrescription: false,
    },
  ],
};

// Category name translation mapping
const categoryNameMap: Record<string, string> = {
  medicamentos: "Medicamentos",
  saude: "Saúde",
  higiene: "Higiene",
  bebe: "Bebê",
  beleza: "Beleza",
  "bem-estar": "Bem-estar",
};

const CategoryProducts: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  // Default to 'medicamentos' if category doesn't exist
  const products =
    categoryId && sampleProducts[categoryId as keyof typeof sampleProducts]
      ? sampleProducts[categoryId as keyof typeof sampleProducts]
      : [];

  const categoryName = categoryId
    ? categoryNameMap[categoryId] || categoryId
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="flex items-center mb-6 space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-pharmacy-primary">
              {categoryName}
            </h1>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  requiresPrescription={product.requiresPrescription}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>Nenhum produto encontrado nesta categoria.</p>
              <Link
                to="/"
                className="text-pharmacy-primary hover:underline mt-4 block"
              >
                Voltar para a página inicial
              </Link>
            </div>
          )}
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

export default CategoryProducts;
