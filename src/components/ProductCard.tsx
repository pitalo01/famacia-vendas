/**
 * ProductCard.tsx
 *
 * Componente que renderiza um card de produto com:
 * - Imagem do produto
 * - Nome do produto
 * - Preço atual e preço antigo (se houver desconto)
 * - Indicador de desconto
 * - Indicador de necessidade de receita médica
 * - Botão para adicionar ao carrinho
 * - Link para a página detalhada do produto
 */
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart, CartItem } from "@/lib/cart-context";

/**
 * Interface que define as propriedades do componente ProductCard
 *
 * @property {string} id - Identificador único do produto
 * @property {string} name - Nome do produto
 * @property {string} image - URL da imagem do produto
 * @property {number} price - Preço atual do produto
 * @property {number} oldPrice - Preço antigo do produto (opcional, para mostrar desconto)
 * @property {boolean} requiresPrescription - Indica se o produto requer receita médica
 * @property {boolean} inStock - Indica se o produto está disponível em estoque
 */
interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  requiresPrescription?: boolean;
  inStock?: boolean;
}

/**
 * Componente ProductCard
 *
 * Renderiza um card de produto interativo que:
 * - Mostra informações principais do produto
 * - Exibe badges de desconto e necessidade de receita quando aplicáveis
 * - Permite adicionar o produto ao carrinho
 * - Adapta seu layout para dispositivos móveis
 * - Fornece feedback visual e notificações ao usuário
 */
const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  requiresPrescription = false,
  inStock = true,
}) => {
  // Verifica se o dispositivo é móvel para adaptar a interface
  const isMobile = useIsMobile();

  // Acessa o contexto do carrinho para adicionar produtos
  const { addItem } = useCart();

  /**
   * Manipula o evento de adicionar produto ao carrinho
   *
   * @param {React.MouseEvent} e - Evento do clique no botão
   *
   * Exibe notificação informativa quando o produto requer receita médica
   * Adiciona o produto ao carrinho usando o contexto
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (requiresPrescription) {
      toast.info("Este produto requer receita médica.", {
        description:
          "Você precisará apresentar a receita na finalização da compra.",
      });
    }

    // Cria um objeto CartItem com os dados do produto
    const cartItem: CartItem = {
      id,
      name,
      image,
      price,
      quantity: 1,
      requiresPrescription,
    };

    // Adiciona o item ao carrinho através do contexto
    addItem(cartItem);
  };

  // Calcula a porcentagem de desconto com base no preço antigo e atual
  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  /**
   * Verifica se a URL da imagem é válida e substitui por uma imagem padrão se necessário
   *
   * @param {string} url - URL da imagem do produto
   * @returns {string} - URL válida da imagem ou URL da imagem padrão
   */
  const getValidImageUrl = (url: string) => {
    // Verifica se a URL contém caracteres inválidos ou não corresponde a um formato de imagem válido
    if (
      url.includes("ספ") ||
      !url.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)
    ) {
      return "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    }
    return url;
  };

  return (
    <Card className="product-card relative flex flex-col w-full">
      {/* Link para a página de detalhes do produto */}
      <Link to={`/product/${id}`} className="flex flex-col h-full">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Badge de desconto (exibido apenas quando há preço antigo) */}
          {oldPrice && (
            <div className="absolute top-2 left-2 z-10">
              <span className="discount-badge animate-pulse-light">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Badge de receita médica (exibido apenas quando o produto requer receita) */}
          {requiresPrescription && (
            <div className="absolute top-2 right-2 z-10">
              <span className="prescription-badge flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Receita
              </span>
            </div>
          )}

          {/* Container da imagem do produto */}
          <div className="relative w-full overflow-hidden bg-muted product-image-container">
            <img
              src={getValidImageUrl(image)}
              alt={name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Informações do produto: título e preço */}
          <div className="p-3 md:p-4 flex flex-col flex-1">
            {/* Título do produto com limitação de linhas */}
            <h3 className="font-medium text-xs md:text-sm line-clamp-2 product-title">
              {name}
            </h3>
            <div className="flex flex-col mt-auto product-price">
              {/* Preço antigo riscado (se houver) */}
              {oldPrice && (
                <span className="text-muted-foreground text-xs line-through">
                  R$ {oldPrice.toFixed(2)}
                </span>
              )}
              {/* Preço atual em destaque */}
              <span className="text-base md:text-lg font-bold text-pharmacy-primary">
                R$ {price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>

        {/* Rodapé do card com botão de ação */}
        <CardFooter className="p-3 md:p-4 pt-0 mt-auto card-footer-spacing">
          <Button
            variant="default"
            size={isMobile ? "sm" : "sm"}
            className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark-primary text-xs md:text-sm"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {/* Exibe texto adaptado ao estado do produto */}
            {inStock ? (
              <>
                <ShoppingCart className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                {isMobile ? "Adicionar" : "Adicionar ao carrinho"}
              </>
            ) : (
              "Indisponível"
            )}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
