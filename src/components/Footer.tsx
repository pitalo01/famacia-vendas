/**
 * Footer.tsx
 *
 * Componente de rodapé para ser reutilizado em todas as páginas do site
 */

import React from "react";

/**
 * Componente Footer
 *
 * Exibe o rodapé padrão com informações de copyright e outros links úteis
 */
const Footer: React.FC = () => {
  return (
    <footer className="py-4 bg-muted mt-auto">
      <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
        <p>© 2025 Drogaria São Rafael. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
