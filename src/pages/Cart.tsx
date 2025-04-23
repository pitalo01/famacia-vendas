
import React from "react";
import CartComponent from "@/components/Cart";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CartComponent />
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

export default Cart;
