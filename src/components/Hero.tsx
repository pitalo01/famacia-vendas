import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center min-h-[520px] md:min-h-[700px] pt-10 pb-16 md:py-28 animate-fade-in"
      style={{
        background: `url('/images/hero-pharmacy-moto.png') center center/cover no-repeat`,
      }}
    >
      {/* Overlay escuro para contraste */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1.5px] z-0 animate-fade-in"></div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 md:px-6 animate-fade-in-up">
        {/* Card translúcido para contraste do texto */}
        <div className="w-full max-w-2xl mx-auto px-6 py-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 flex flex-col items-center animate-fade-in-up delay-200">
          {/* Badge de destaque */}
          <span className="mb-4 inline-block bg-pharmacy-primary/90 text-white text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full shadow-md tracking-wide animate-fade-in-up delay-300">
            Entrega rápida e segura
          </span>
          <div className="flex flex-col justify-center items-center space-y-3 md:space-y-4 w-full max-w-2xl">
            <div className="space-y-2 text-center animate-fade-in-up delay-400">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-pharmacy-dark-primary drop-shadow-lg">
                Sua saúde em primeiro lugar
              </h1>
              <p className="text-sm md:text-base text-muted-foreground md:text-xl">
                Medicamentos e produtos de saúde com a qualidade que você
                merece.
                {!isMobile && " Entrega rápida e segura na sua casa."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2 animate-fade-in-up delay-500">
              <Button
                size={isMobile ? "sm" : "lg"}
                className="bg-pharmacy-primary hover:bg-pharmacy-dark-primary shadow-lg"
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
        </div>
      </div>
      {/* Gradiente inferior para transição suave */}
      <div className="absolute inset-x-0 -bottom-12 h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default Hero;
