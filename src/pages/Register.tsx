/**
 * Register.tsx
 *
 * Página de registro que permite ao usuário criar uma nova conta.
 * Utiliza o contexto de autenticação para gerenciar o processo de registro.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

/**
 * Componente da página de registro
 *
 * Fornece um formulário para que o usuário possa criar uma nova conta.
 * Após o registro bem-sucedido, redireciona para a página inicial.
 */
const Register = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;
