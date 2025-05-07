import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pill, Heart, ShowerHead, Baby, Sun, Bed } from "lucide-react";

// Sample categories - expanded from the component with subcategories
const categories = [
  {
    id: "medicamentos",
    title: "Medicamentos",
    description: "Remédios, antibióticos, anti-inflamatórios e muito mais",
    icon: <Pill className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/medicamentos",
  },
  {
    id: "saude",
    title: "Saúde",
    description: "Vitaminas, suplementos, produtos ortopédicos",
    icon: <Heart className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/saude",
  },
  {
    id: "higiene",
    title: "Higiene",
    description: "Produtos para higiene pessoal e bem-estar",
    icon: <ShowerHead className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/higiene",
  },
  {
    id: "bebe",
    title: "Bebê",
    description: "Fraldas, mamadeiras, produtos para cuidados do bebê",
    icon: <Baby className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/bebe",
  },
  {
    id: "beleza",
    title: "Beleza",
    description: "Cosméticos, perfumes, maquiagens e cremes",
    icon: <Sun className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/beleza",
  },
  {
    id: "bem-estar",
    title: "Bem-estar",
    description: "Acessórios para relaxamento, produtos naturais",
    icon: <Bed className="h-12 w-12 text-pharmacy-primary mb-2" />,
    link: "/categories/bem-estar",
  },
];

const Categories = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <h1 className="text-2xl font-bold mb-6">Categorias de Produtos</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="animate-fade-in overflow-hidden"
              >
                <CardHeader className="pb-3 flex flex-col items-center bg-muted/30">
                  {category.icon}
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                  <Link
                    to={category.link}
                    className="block mt-4 text-center text-sm text-pharmacy-primary hover:underline"
                  >
                    Ver todos os produtos
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <Link
            to="/"
            className="block mt-4 text-center text-sm text-pharmacy-primary hover:underline"
          >
            Voltar para a página inicial
          </Link>
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

export default Categories;
