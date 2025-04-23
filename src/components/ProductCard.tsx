
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

  return (
    <Card className="product-card h-full relative">
      <Link to={`/product/${id}`}>
        <CardContent className="p-0">
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
          
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
          
          <div className="p-3 md:p-4 space-y-1 md:space-y-2">
            <h3 className="font-medium text-xs md:text-sm line-clamp-2 h-8 md:h-10">{name}</h3>
            <div className="flex flex-col">
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
        
        <CardFooter className="p-3 md:p-4 pt-0">
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
