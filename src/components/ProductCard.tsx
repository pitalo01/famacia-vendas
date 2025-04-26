import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  requiresPrescription?: boolean;
  inStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  requiresPrescription = false,
  inStock = true,
}) => {
  const isMobile = useIsMobile();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (requiresPrescription) {
      toast.info("Este produto requer receita médica.", {
        description: "Você precisará apresentar a receita na finalização da compra.",
      });
    }
    
    toast.success("Produto adicionado ao carrinho!", {
      description: name,
    });
  };

  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  // Função para verificar se o URL da imagem é válido e substituir por uma imagem padrão se necessário
  const getValidImageUrl = (url: string) => {
    // Verificar se a URL contém caracteres inválidos (como ספ no exemplo)
    if (url.includes('ספ') || !url.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i)) {
      return "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    }
    return url;
  };

  return (
    <Card className="product-card relative flex flex-col w-full">
      <Link to={`/product/${id}`} className="flex flex-col h-full">
        <CardContent className="p-0 flex-1 flex flex-col">
          {oldPrice && (
            <div className="absolute top-2 left-2 z-10">
              <span className="discount-badge animate-pulse-light">
                {discount}% OFF
              </span>
            </div>
          )}
          
          {requiresPrescription && (
            <div className="absolute top-2 right-2 z-10">
              <span className="prescription-badge flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Receita
              </span>
            </div>
          )}
          
          <div className="relative w-full overflow-hidden bg-muted product-image-container">
            <img
              src={getValidImageUrl(image)}
              alt={name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
          
          <div className="p-3 md:p-4 flex flex-col flex-1">
            <h3 className="font-medium text-xs md:text-sm line-clamp-2 product-title">{name}</h3>
            <div className="flex flex-col mt-auto product-price">
              {oldPrice && (
                <span className="text-muted-foreground text-xs line-through">
                  R$ {oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-base md:text-lg font-bold text-pharmacy-dark-purple">
                R$ {price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 md:p-4 pt-0 mt-auto card-footer-spacing">
          <Button 
            variant="default" 
            size={isMobile ? "sm" : "sm"}
            className="w-full bg-pharmacy-purple hover:bg-pharmacy-dark-purple text-xs md:text-sm"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
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
