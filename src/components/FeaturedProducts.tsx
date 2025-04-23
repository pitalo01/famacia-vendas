
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

// Sample data for featured products - expanded for carousel demo with realistic images
const featuredProducts = [
  {
    id: "1",
    name: "Dipirona Sódica 1g com 10 comprimidos",
    image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 12.99,
    oldPrice: 19.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "2",
    name: "Amoxicilina 500mg com 20 cápsulas",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 45.50,
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "3",
    name: "Vitamina C 1g com 30 comprimidos efervescentes",
    image: "https://images.unsplash.com/photo-1585435557885-28ebd3b15de4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 25.90,
    oldPrice: 35.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "4",
    name: "Losartana 50mg com 30 comprimidos",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 18.75,
    requiresPrescription: true,
    inStock: true,
  },
  {
    id: "5",
    name: "Protetor Solar FPS 60",
    image: "https://images.unsplash.com/photo-1556227702-a1d34a6eba25?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 42.90,
    oldPrice: 55.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "6",
    name: "Sabonete Antiacne",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 15.50,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "7",
    name: "Xarope para Tosse",
    image: "https://images.unsplash.com/photo-1550572017-42915b4f8d74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 24.99,
    oldPrice: 29.99,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "8",
    name: "Colírio Lubrificante",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "9",
    name: "Suplemento Whey Protein",
    image: "https://images.unsplash.com/photo-1579722582772-71ספ66d01e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", 
    price: 89.90,
    oldPrice: 109.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "10",
    name: "Kit Primeiros Socorros",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 65.00,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "11",
    name: "Pomada Cicatrizante",
    image: "https://images.unsplash.com/photo-1584308666984-91a927ee8269?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 17.80,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "12",
    name: "Vitamina D3 2000UI",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 39.90,
    oldPrice: 49.90,
    requiresPrescription: false,
    inStock: true,
  },
];

// Product categories for the specialized rows
const healthProducts = [
  {
    id: "saude1",
    name: "Termômetro Digital",
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude2",
    name: "Medidor de Pressão Arterial",
    image: "https://images.unsplash.com/photo-1563360668-3273bb865ad3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 129.90,
    oldPrice: 159.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude3",
    name: "Oxímetro de Pulso",
    image: "https://images.unsplash.com/photo-1631563019676-dba501a0ddf9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 89.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "saude4",
    name: "Vitamina C 1000mg",
    image: "https://images.unsplash.com/photo-1577348628134-7be655111c11?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 22.90,
    oldPrice: 27.90,
    requiresPrescription: false,
    inStock: true,
  },
];

const hygieneProducts = [
  {
    id: "hig1",
    name: "Sabonete Antibacteriano",
    image: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 7.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig2",
    name: "Álcool em Gel 70%",
    image: "https://images.unsplash.com/photo-1585717456878-10c8f2bb73f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 15.90,
    oldPrice: 19.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig3",
    name: "Escova Dental",
    image: "https://images.unsplash.com/photo-1612837017391-4b6b7b0be2e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 9.90,
    requiresPrescription: false,
    inStock: true,
  },
  {
    id: "hig4",
    name: "Kit Higiene Viagem",
    image: "https://images.unsplash.com/photo-1585741279714-7db01a860c73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    price: 29.90,
    oldPrice: 34.90,
    requiresPrescription: false,
    inStock: true,
  },
];

interface FeaturedProductsProps {
  title: string;
  seeAllLink: string;
  productList?: Array<typeof featuredProducts[number]>;
  showCarousel?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  seeAllLink, 
  productList = featuredProducts,
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
