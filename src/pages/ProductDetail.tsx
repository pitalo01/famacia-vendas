import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  ChevronRight,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { getProductById, ProductDetails } from "@/lib/products";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Buscar dados do produto com base no ID usando nosso serviço
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Pequeno atraso para simular uma chamada de API
        setTimeout(() => {
          if (!id) {
            setProduct(null);
            setLoading(false);
            return;
          }

          const productData = getProductById(id);
          setProduct(productData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error);
        setLoading(false);
        toast.error("Erro ao carregar detalhes do produto");
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      toast.success(
        `${quantity} ${quantity > 1 ? "unidades" : "unidade"} de ${
          product.name
        } adicionadas ao carrinho`
      );
    }
  };

  const handleAddToFavorites = () => {
    if (product) {
      toast.success(`${product.name} adicionado aos favoritos`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded"></div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-24 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        ) : !product ? (
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-pharmacy-dark-primary mb-4">
              Produto não encontrado
            </h2>
            <p className="mb-6">
              O produto que você está procurando não está disponível.
            </p>
            <Link to="/" className="text-pharmacy-primary hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm mb-6 overflow-x-auto">
              <Link to="/" className="text-pharmacy-primary hover:underline">
                Início
              </Link>
              <span className="mx-2">/</span>
              <Link
                to="/categories"
                className="hover:text-pharmacy-primary truncate"
              >
                Categorias
              </Link>
              <span className="mx-2">/</span>
              <span className="text-pharmacy-primary truncate">
                {product.name}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Imagem do produto */}
              <div className="w-full md:w-1/2">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="aspect-square relative overflow-hidden rounded-md">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-contain w-full h-full"
                    />
                    {product.oldPrice && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="discount-badge animate-pulse-light">
                          {Math.round(
                            ((product.oldPrice - product.price) /
                              product.oldPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </div>
                    )}

                    {product.requiresPrescription && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="prescription-badge flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Receita
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detalhes do produto */}
              <div className="w-full md:w-1/2 space-y-4">
                <h1 className="text-2xl font-bold text-gray-700">
                  {product.name}
                </h1>

                {product.brand && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}

                {product.rating && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      ({product.ratingCount})
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {product.requiresPrescription
                        ? "Necessita de prescrição médica"
                        : "Adequado para diversos usos"}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  {product.seller && (
                    <p className="text-sm text-gray-500">
                      Vendido e entregue por {product.seller}
                    </p>
                  )}
                </div>

                {/* Preço */}
                <div className="mt-4">
                  {product.oldPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      R$ {product.oldPrice.toFixed(2).replace(".", ",")}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-pharmacy-dark-primary">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </div>
                </div>

                {/* Quantidade */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantidade:
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-none"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 h-9 flex items-center justify-center border-y border-gray-300">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-l-none"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="pt-4 grid grid-cols-1 gap-4">
                  <Button
                    className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark-primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inStock ? "Comprar" : "Produto Indisponível"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-pharmacy-primary text-pharmacy-primary hover:bg-pharmacy-primary/10"
                    onClick={handleAddToFavorites}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Adicionar aos favoritos
                  </Button>
                </div>
              </div>
            </div>

            {/* Descrição e características */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.description && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-pharmacy-dark-primary mb-4">
                    Descrição
                  </h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-pharmacy-dark-primary mb-4">
                    Características
                  </h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-pharmacy-primary mr-2">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="py-4 md:py-6 bg-muted mt-8">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
          <div className="mt-2 space-x-2 md:space-x-4 text-xs">
            <Link to="/terms" className="hover:underline">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:underline">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
