import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  requiresPrescription: boolean;
  inStock?: boolean;
}

const sampleSubcategoryProducts: Record<string, Product[]> = {
  // Medicamentos subcategories
  "dor-febre": [
    {
      id: "dor1",
      name: "Paracetamol 750mg",
      image: "https://via.placeholder.com/200x200?text=Paracetamol",
      price: 8.99,
      oldPrice: 12.99,
      requiresPrescription: false,
    },
    {
      id: "dor2",
      name: "Ibuprofeno 400mg",
      image: "https://via.placeholder.com/200x200?text=Ibuprofeno",
      price: 15.49,
      requiresPrescription: false,
    },
    {
      id: "dor3",
      name: "Dipirona 500mg",
      image: "https://via.placeholder.com/200x200?text=Dipirona",
      price: 6.99,
      oldPrice: 9.99,
      requiresPrescription: false,
    },
  ],
  "gripe-resfriado": [
    {
      id: "gripe1",
      name: "Resfenol",
      image: "https://via.placeholder.com/200x200?text=Resfenol",
      price: 12.90,
      requiresPrescription: false,
    },
    {
      id: "gripe2",
      name: "Fluviral",
      image: "https://via.placeholder.com/200x200?text=Fluviral",
      price: 18.50,
      oldPrice: 22.90,
      requiresPrescription: false,
    },
    {
      id: "gripe3",
      name: "Descongestionante Nasal",
      image: "https://via.placeholder.com/200x200?text=Descongestionante",
      price: 15.75,
      requiresPrescription: false,
    },
  ],
  "antibioticos": [
    {
      id: "anti1",
      name: "Amoxicilina 500mg",
      image: "https://via.placeholder.com/200x200?text=Amoxicilina",
      price: 29.90,
      requiresPrescription: true,
    },
    {
      id: "anti2",
      name: "Azitromicina 500mg",
      image: "https://via.placeholder.com/200x200?text=Azitromicina",
      price: 35.90,
      requiresPrescription: true,
    },
  ],
  
  // Saúde subcategories
  "vitaminas": [
    {
      id: "vit1",
      name: "Vitamina C 1000mg",
      image: "https://via.placeholder.com/200x200?text=Vitamina+C",
      price: 22.50,
      oldPrice: 26.90,
      requiresPrescription: false,
    },
    {
      id: "vit2",
      name: "Vitamina D3 2000UI",
      image: "https://via.placeholder.com/200x200?text=Vitamina+D",
      price: 39.90,
      requiresPrescription: false,
    },
    {
      id: "vit3",
      name: "Vitamina B12",
      image: "https://via.placeholder.com/200x200?text=Vitamina+B12",
      price: 45.50,
      requiresPrescription: false,
    },
  ],
  "suplementos": [
    {
      id: "sup1",
      name: "Ômega 3 1000mg",
      image: "https://via.placeholder.com/200x200?text=Omega+3",
      price: 45.99,
      requiresPrescription: false,
    },
    {
      id: "sup2",
      name: "Colágeno Hidrolisado",
      image: "https://via.placeholder.com/200x200?text=Colageno",
      price: 65.90,
      oldPrice: 79.90,
      requiresPrescription: false,
    },
  ],
  "primeiros-socorros": [
    {
      id: "ps1",
      name: "Termômetro Digital",
      image: "https://via.placeholder.com/200x200?text=Termometro",
      price: 19.90,
      requiresPrescription: false,
    },
    {
      id: "ps2",
      name: "Bandagem Elástica",
      image: "https://via.placeholder.com/200x200?text=Bandagem",
      price: 12.50,
      requiresPrescription: false,
    },
  ],
  
  // Higiene subcategories
  "bucal": [
    {
      id: "buc1",
      name: "Creme Dental",
      image: "https://via.placeholder.com/200x200?text=Creme+Dental",
      price: 8.50,
      requiresPrescription: false,
    },
    {
      id: "buc2",
      name: "Fio Dental",
      image: "https://via.placeholder.com/200x200?text=Fio+Dental",
      price: 6.99,
      requiresPrescription: false,
    },
    {
      id: "buc3",
      name: "Enxaguante Bucal",
      image: "https://via.placeholder.com/200x200?text=Enxaguante",
      price: 12.90,
      oldPrice: 15.90,
      requiresPrescription: false,
    },
  ],
  "corporal": [
    {
      id: "corp1",
      name: "Sabonete Líquido",
      image: "https://via.placeholder.com/200x200?text=Sabonete",
      price: 12.99,
      oldPrice: 15.99,
      requiresPrescription: false,
    },
    {
      id: "corp2",
      name: "Desodorante Aerosol",
      image: "https://via.placeholder.com/200x200?text=Desodorante",
      price: 16.50,
      requiresPrescription: false,
    },
  ],
  "intima": [
    {
      id: "int1",
      name: "Sabonete Íntimo",
      image: "https://via.placeholder.com/200x200?text=Sabonete+Intimo",
      price: 18.90,
      requiresPrescription: false,
    },
    {
      id: "int2",
      name: "Absorvente",
      image: "https://via.placeholder.com/200x200?text=Absorvente",
      price: 9.99,
      oldPrice: 12.99,
      requiresPrescription: false,
    },
  ],
  
  // Additional subcategories would follow the same pattern...
  "fraldas": [
    {
      id: "fral1",
      name: "Fralda Premium P",
      image: "https://via.placeholder.com/200x200?text=Fralda+P",
      price: 59.90,
      oldPrice: 69.99,
      requiresPrescription: false,
    },
    {
      id: "fral2",
      name: "Fralda Premium M",
      image: "https://via.placeholder.com/200x200?text=Fralda+M",
      price: 62.90,
      requiresPrescription: false,
    },
  ],
  "higiene-bebe": [
    {
      id: "higbebe1",
      name: "Shampoo Infantil",
      image: "https://via.placeholder.com/200x200?text=Shampoo+Infantil",
      price: 18.99,
      requiresPrescription: false,
    },
    {
      id: "higbebe2",
      name: "Sabonete Infantil",
      image: "https://via.placeholder.com/200x200?text=Sabonete+Infantil",
      price: 8.99,
      requiresPrescription: false,
    },
  ],
  "alimentacao": [
    {
      id: "alim1",
      name: "Leite em Pó Infantil",
      image: "https://via.placeholder.com/200x200?text=Leite+Infantil",
      price: 45.90,
      requiresPrescription: false,
    },
    {
      id: "alim2",
      name: "Papinha Pronta",
      image: "https://via.placeholder.com/200x200?text=Papinha",
      price: 6.50,
      requiresPrescription: false,
    },
  ],
};

const subcategoryNameMap: Record<string, string> = {
  // Medicamentos
  "dor-febre": "Dor e Febre",
  "gripe-resfriado": "Gripe e Resfriado",
  "antibioticos": "Antibióticos",
  
  // Saúde
  "vitaminas": "Vitaminas",
  "suplementos": "Suplementos",
  "primeiros-socorros": "Primeiros Socorros",
  
  // Higiene
  "bucal": "Higiene Bucal",
  "corporal": "Higiene Corporal",
  "intima": "Higiene Íntima",
  
  // Bebê
  "fraldas": "Fraldas",
  "higiene-bebe": "Higiene do Bebê",
  "alimentacao": "Alimentação",
  
  // Additional translations would be added for other subcategories
};

const categoryNameMap: Record<string, string> = {
  "medicamentos": "Medicamentos",
  "saude": "Saúde",
  "higiene": "Higiene",
  "bebe": "Bebê",
  "beleza": "Beleza",
  "bem-estar": "Bem-estar"
};

const SubCategoryProducts: React.FC = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string, subcategoryId: string }>();
  
  // Get products for this subcategory
  const products = subcategoryId && sampleSubcategoryProducts[subcategoryId] 
    ? sampleSubcategoryProducts[subcategoryId] 
    : [];
  
  const subcategoryName = subcategoryId ? (subcategoryNameMap[subcategoryId] || subcategoryId) : "";
  const categoryName = categoryId ? (categoryNameMap[categoryId as keyof typeof categoryNameMap] || categoryId) : "";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <div className="flex flex-wrap items-center mb-6 gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Início
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/categories/${categoryId}`}>
              <Button variant="ghost" size="sm">
                {categoryName}
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-2xl font-bold text-pharmacy-dark-purple">
              {subcategoryName}
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
                  inStock={product.inStock ?? true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>Nenhum produto encontrado nesta subcategoria.</p>
              <Link to="/" className="text-pharmacy-purple hover:underline mt-4 block">
                Voltar para a página inicial
              </Link>
            </div>
          )}
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

export default SubCategoryProducts;
