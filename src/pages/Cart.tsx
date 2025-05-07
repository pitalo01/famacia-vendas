/**
 * Cart.tsx
 *
 * Página do carrinho de compras que exibe todos os itens adicionados,
 * permite ajustar quantidades, remover produtos e finalizar a compra.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

/**
 * Componente da página de carrinho
 */
const Cart = () => {
  const {
    items,
    updateItemQuantity,
    removeItem,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Calcular valor do frete
  const shipping = items.length > 0 ? 12.9 : 0;

  // Calcular valor total
  const total = subtotal + shipping;

  // Função para incrementar a quantidade de um item
  const incrementQuantity = (id: string, currentQuantity: number) => {
    updateItemQuantity(id, currentQuantity + 1);
  };

  // Função para decrementar a quantidade de um item
  const decrementQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateItemQuantity(id, currentQuantity - 1);
    } else {
      // Se a quantidade for 1, perguntar ao usuário se deseja remover o item
      if (window.confirm("Deseja remover este item do carrinho?")) {
        removeItem(id);
      }
    }
  };

  // Função para lidar com o checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info("Você precisa estar logado para finalizar a compra", {
        description: "Redirecionando para a página de login...",
      });
      // Redirecionar para login com retorno para o checkout
      navigate("/login", { state: { redirect: "/checkout" } });
      return;
    }

    // Navegar para a página de checkout
    navigate("/checkout");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de produtos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatCurrency(item.price)}
                        </p>

                        {item.requiresPrescription && (
                          <div className="inline-flex items-center text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded w-fit">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Requer receita médica
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                decrementQuantity(item.id, item.quantity)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() =>
                                incrementQuantity(item.id, item.quantity)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Continuar Comprando
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Tem certeza que deseja esvaziar o carrinho?"
                      )
                    ) {
                      clearCart();
                    }
                  }}
                >
                  Esvaziar Carrinho
                </Button>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                  <CardDescription>
                    {totalItems} {totalItems === 1 ? "item" : "itens"} no
                    carrinho
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>{formatCurrency(subtotal)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Frete</p>
                      <p>{formatCurrency(shipping)}</p>
                    </div>

                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium text-lg">
                      <p>Total</p>
                      <p>{formatCurrency(total)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Finalizar Compra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore nossa loja e adicione produtos ao seu carrinho.
              </p>
              <Button className="mt-6" onClick={() => navigate("/")}>
                Explorar Produtos
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Cart;
