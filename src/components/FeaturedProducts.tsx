import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { featuredProductsData, healthProductsData, hygieneProductsData, Product } from "@/lib/products";

interface FeaturedProductsProps {
  title: string;
  seeAllLink: string;
  productList?: Product[];
  showCarousel?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  seeAllLink, 
  productList = featuredProductsData,
  showCarousel = true 
}) => {

  // Set how many products to show at once based on screen size
  const settings = {
    opts: {
      loop: true,
      align: "start" as const,
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-pharmacy-dark-purple">{title}</h2>
          <Link
            to={seeAllLink}
            className="text-sm font-medium text-pharmacy-purple hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {showCarousel ? (
          <div className="relative">
            <Carousel {...settings} className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {productList.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        price={product.price}
                        oldPrice={product.oldPrice}
                        requiresPrescription={product.requiresPrescription}
                        inStock={product.inStock}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 lg:-left-12 bg-white/80 hover:bg-white border-pharmacy-purple text-pharmacy-dark-purple shadow-md" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 lg:-right-12 bg-white/80 hover:bg-white border-pharmacy-purple text-pharmacy-dark-purple shadow-md" />
            </Carousel>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
            {productList.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                oldPrice={product.oldPrice}
                requiresPrescription={product.requiresPrescription}
                inStock={product.inStock}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
