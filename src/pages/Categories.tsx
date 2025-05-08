import React from "react";
import Navbar from "@/components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pill, Heart, ShowerHead, Baby, Sun, Bed, ArrowLeft } from "lucide-react";

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
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="flex items-center mb-6 gap-2">
            {/* Seta para voltar */}
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full bg-muted hover:bg-pharmacy-primary/20 transition-colors"
              aria-label="Voltar para a página inicial"
            >
              <ArrowLeft className="h-5 w-5 text-pharmacy-primary" />
            </button>
            <h1 className="text-2xl font-bold">Categorias de Produtos</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="animate-fade-in"
              >
                <Card className="overflow-hidden h-64 md:h-72 cursor-pointer hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-3 flex flex-col items-center bg-muted/30">
                    <div className="rounded-full bg-pharmacy-primary/20 p-4 mb-2 shadow-md transition-all duration-300 group-hover:bg-pharmacy-primary/40 group-hover:scale-110 group-hover:shadow-lg flex items-center justify-center animate-fade-in-up">
                      {React.cloneElement(category.icon, {
                        className: "h-12 w-12 text-pharmacy-primary transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg",
                      })}
                    </div>
                    <h2 className="text-xl font-semibold">{category.title}</h2>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground text-center">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
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

export default Categories;
