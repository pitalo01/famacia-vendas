
import React from "react";
import RegisterForm from "@/components/RegisterForm";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
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

export default Register;
