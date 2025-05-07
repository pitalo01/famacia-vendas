/**
 * Login.tsx
 *
 * Página de login que permite ao usuário se autenticar na aplicação.
 * Utiliza o contexto de autenticação para gerenciar o processo de login.
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

/**
 * Componente da página de login
 *
 * Fornece um formulário para que o usuário possa se autenticar.
 * Após o login bem-sucedido, redireciona para a página inicial.
 */
const Login = () => {
  // Estado para armazenar os dados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contexto de autenticação e navegação
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona para a página inicial se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Manipula a submissão do formulário de login
   *
   * @param {React.FormEvent} e - Evento de submissão do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setIsLoading(true);
      // Tenta fazer login usando o contexto de autenticação
      const success = await login(email, password);

      if (success) {
        // Se o login for bem-sucedido, redireciona para a página inicial
        navigate("/");
      }
    } catch (err) {
      setError("Ocorreu um erro durante o login. Tente novamente.");
      console.error("Erro de login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Entre na sua conta para continuar</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Exibe mensagem de erro se houver */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Campo de email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/recover-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Botão de login */}
              <Button
                type="submit"
                className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              {/* Link para criar conta */}
              <div className="text-center text-sm">
                Não tem uma conta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Cadastrar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Login;
