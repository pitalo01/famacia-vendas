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

/**
 * Componente da página de registro
 *
 * Fornece um formulário para que o usuário possa criar uma nova conta.
 * Após o registro bem-sucedido, redireciona para a página inicial.
 */
const Register = () => {
  // Estado para armazenar os dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Contexto de autenticação e navegação
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redireciona para a página inicial se já estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Manipula a submissão do formulário de registro
   *
   * @param {React.FormEvent} e - Evento de submissão do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação dos campos
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      // Tenta registrar o usuário usando o contexto de autenticação
      const success = await register(name, email, password);

      if (success) {
        // Se o registro for bem-sucedido, redireciona para a página inicial
        navigate("/");
      }
    } catch (err) {
      setError("Ocorreu um erro durante o registro. Tente novamente.");
      console.error("Erro de registro:", err);
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
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Crie sua conta para começar a comprar
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Exibe mensagem de erro se houver */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Campo de nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

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
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo de 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Campo de confirmação de senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite novamente sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Botão de registro */}
              <Button
                type="submit"
                className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>

              {/* Link para fazer login */}
              <div className="text-center text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Rodapé */}
      <footer className="py-4 md:py-6 bg-muted">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Register;
