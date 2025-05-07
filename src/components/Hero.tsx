import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pharmacy-primary/10 to-white pt-6 pb-8 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-3 md:space-y-4 animate-fade-in order-2 lg:order-1">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-pharmacy-dark-primary">
                Sua saúde em primeiro lugar
              </h1>
              <p className="text-sm md:text-base text-muted-foreground md:text-xl">
                Medicamentos e produtos de saúde com a qualidade que você
                merece.
                {!isMobile && " Entrega rápida e segura na sua casa."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size={isMobile ? "sm" : "lg"}
                className="bg-pharmacy-primary hover:bg-pharmacy-dark-primary"
                asChild
              >
                <Link to="/categories">
                  Ver produtos <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {!isMobile && (
                <Button variant="outline" size="lg" asChild>
                  <Link to="/offers">Ver ofertas</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative block order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-tr from-pharmacy-primary/20 to-pharmacy-green/20 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Farmácia Virtual"
                className="object-cover w-4/5 h-4/5 animate-fade-in rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
