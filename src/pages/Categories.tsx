
import React from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Pill, Heart, ShowerHead, Baby, Sun, Bed } from "lucide-react";

// Sample categories - expanded from the component with subcategories
const categories = [
  {
    id: "1",
    name: "Medicamentos",
    icon: <Pill className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Dor e Febre", link: "/categories/medicamentos/dor-febre" },
      { name: "Gripe e Resfriado", link: "/categories/medicamentos/gripe-resfriado" },
      { name: "Pressão Alta", link: "/categories/medicamentos/pressao-alta" },
      { name: "Antiinflamatórios", link: "/categories/medicamentos/anti-inflamatorios" },
      { name: "Antibióticos", link: "/categories/medicamentos/antibioticos" },
    ],
  },
  {
    id: "2",
    name: "Saúde",
    icon: <Heart className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Vitaminas", link: "/categories/saude/vitaminas" },
      { name: "Suplementos", link: "/categories/saude/suplementos" },
      { name: "Primeiros Socorros", link: "/categories/saude/primeiros-socorros" },
      { name: "Ortopedia", link: "/categories/saude/ortopedia" },
    ],
  },
  {
    id: "3",
    name: "Higiene",
    icon: <ShowerHead className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Higiene Bucal", link: "/categories/higiene/bucal" },
      { name: "Higiene Corporal", link: "/categories/higiene/corporal" },
      { name: "Higiene Íntima", link: "/categories/higiene/intima" },
    ],
  },
  {
    id: "4",
    name: "Bebê",
    icon: <Baby className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Fraldas", link: "/categories/bebe/fraldas" },
      { name: "Mamadeiras", link: "/categories/bebe/mamadeiras" },
      { name: "Higiene do Bebê", link: "/categories/bebe/higiene" },
      { name: "Alimentação", link: "/categories/bebe/alimentacao" },
    ],
  },
  {
    id: "5",
    name: "Beleza",
    icon: <Sun className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Cabelo", link: "/categories/beleza/cabelo" },
      { name: "Pele", link: "/categories/beleza/pele" },
      { name: "Maquiagem", link: "/categories/beleza/maquiagem" },
      { name: "Perfumes", link: "/categories/beleza/perfumes" },
    ],
  },
  {
    id: "6",
    name: "Bem-estar",
    icon: <Bed className="h-12 w-12 text-pharmacy-purple mb-2" />,
    subcategories: [
      { name: "Relaxantes", link: "/categories/bem-estar/relaxantes" },
      { name: "Fisioterapia", link: "/categories/bem-estar/fisioterapia" },
      { name: "Acessórios", link: "/categories/bem-estar/acessorios" },
      { name: "Aromaterapia", link: "/categories/bem-estar/aromaterapia" },
    ],
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
              <Card key={category.id} className="animate-fade-in overflow-hidden">
                <CardHeader className="pb-3 flex flex-col items-center bg-muted/30">
                  {category.icon}
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {category.subcategories.map((subcat, idx) => (
                      <li key={idx}>
                        <Link 
                          to={subcat.link}
                          className="block p-2 rounded-md hover:bg-muted transition-colors text-sm"
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={`/categories/${category.name.toLowerCase()}`} 
                    className="block mt-4 text-center text-sm text-pharmacy-purple hover:underline"
                  >
                    Ver todos os produtos
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="py-6 bg-muted">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Farmácia Virtual Encantada. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="text-xs hover:underline">Termos de Uso</Link>
            <Link to="/privacy" className="text-xs hover:underline">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Categories;
