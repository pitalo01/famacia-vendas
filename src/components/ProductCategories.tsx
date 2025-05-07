import React from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  Thermometer,
  Baby,
  Heart,
  ShowerHead,
  Sun,
  Bed,
} from "lucide-react";

// Sample category data with subcategories
const categories = [
  {
    id: "medicamentos",
    name: "Medicamentos",
    icon: <Pill className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/medicamentos",
    subcategories: [
      {
        id: "dor-febre",
        name: "Dor e Febre",
        link: "/categories/medicamentos/dor-febre",
      },
      {
        id: "gripe-resfriado",
        name: "Gripe e Resfriado",
        link: "/categories/medicamentos/gripe-resfriado",
      },
      {
        id: "antibioticos",
        name: "Antibióticos",
        link: "/categories/medicamentos/antibioticos",
      },
    ],
  },
  {
    id: "saude",
    name: "Saúde",
    icon: <Heart className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/saude",
    subcategories: [
      {
        id: "vitaminas",
        name: "Vitaminas",
        link: "/categories/saude/vitaminas",
      },
      {
        id: "suplementos",
        name: "Suplementos",
        link: "/categories/saude/suplementos",
      },
      {
        id: "primeiros-socorros",
        name: "Primeiros Socorros",
        link: "/categories/saude/primeiros-socorros",
      },
    ],
  },
  {
    id: "higiene",
    name: "Higiene",
    icon: <ShowerHead className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/higiene",
    subcategories: [
      { id: "bucal", name: "Higiene Bucal", link: "/categories/higiene/bucal" },
      {
        id: "corporal",
        name: "Higiene Corporal",
        link: "/categories/higiene/corporal",
      },
      {
        id: "intima",
        name: "Higiene Íntima",
        link: "/categories/higiene/intima",
      },
    ],
  },
  {
    id: "bebe",
    name: "Bebê",
    icon: <Baby className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/bebe",
    subcategories: [
      { id: "fraldas", name: "Fraldas", link: "/categories/bebe/fraldas" },
      {
        id: "higiene-bebe",
        name: "Higiene do Bebê",
        link: "/categories/bebe/higiene-bebe",
      },
      {
        id: "alimentacao",
        name: "Alimentação",
        link: "/categories/bebe/alimentacao",
      },
    ],
  },
  {
    id: "beleza",
    name: "Beleza",
    icon: <Sun className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/beleza",
    subcategories: [
      { id: "cabelo", name: "Cabelo", link: "/categories/beleza/cabelo" },
      { id: "pele", name: "Pele", link: "/categories/beleza/pele" },
      {
        id: "maquiagem",
        name: "Maquiagem",
        link: "/categories/beleza/maquiagem",
      },
    ],
  },
  {
    id: "bem-estar",
    name: "Bem-estar",
    icon: <Bed className="h-8 w-8 text-pharmacy-primary" />,
    link: "/categories/bem-estar",
    subcategories: [
      {
        id: "relaxantes",
        name: "Relaxantes",
        link: "/categories/bem-estar/relaxantes",
      },
      {
        id: "aromaterapia",
        name: "Aromaterapia",
        link: "/categories/bem-estar/aromaterapia",
      },
      {
        id: "acessorios",
        name: "Acessórios",
        link: "/categories/bem-estar/acessorios",
      },
    ],
  },
];

const ProductCategories: React.FC = () => {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container px-4">
        <h2 className="text-2xl font-bold text-pharmacy-primary mb-6">
          Categorias
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="animate-fade-in"
            >
              <div className="category-card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center py-4 space-y-2">
                {category.icon}
                <h3 className="font-medium text-sm text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
