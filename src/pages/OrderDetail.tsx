/**
 * OrderDetail.tsx
 *
 * Página de detalhes do pedido que exibe todas as informações
 * relacionadas a um pedido específico, incluindo itens, status,
 * endereço de entrega e informações de pagamento.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import {
  useOrders,
  Order,
  OrderStatusText,
  PaymentMethodText,
} from "@/lib/order-context";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Calendar,
  ArrowLeft,
  Clock,
  TruckIcon,
  MapPin,
  CreditCard,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Componente da página de detalhes do pedido
 */
const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { isAuthenticated } = useAuth();
  const { getOrderById, cancelOrder } = useOrders();

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Verifica autenticação e carrega os dados do pedido
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirect: `/orders/${orderId}` } });
      return;
    }

    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
      }
    }

    setIsLoading(false);
  }, [orderId, isAuthenticated, navigate, getOrderById]);

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Função para obter classe de cor baseada no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para cancelar o pedido
  const handleCancelOrder = async () => {
    if (!order) return;

    if (
      window.confirm(
        "Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita."
      )
    ) {
      setIsCancelling(true);

      try {
        const success = await cancelOrder(order.id);

        if (success) {
          // Atualiza a ordem localmente
          setOrder(getOrderById(order.id));
          toast.success("Pedido cancelado com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao cancelar pedido:", error);
        toast.error("Não foi possível cancelar o pedido");
      } finally {
        setIsCancelling(false);
      }
    }
  };

  // Se estiver carregando, exibe um indicador
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se o pedido não foi encontrado
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 container py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Meus Pedidos
          </Button>

          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">
                Pedido não encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                O pedido que você está procurando não existe ou você não tem
                acesso a ele.
              </p>
              <Button className="mt-6" onClick={() => navigate("/orders")}>
                Ver Meus Pedidos
              </Button>
            </CardContent>
          </Card>
        </main>

        <footer className="py-4 bg-muted mt-auto">
          <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
            <p>
              © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <Button
              variant="ghost"
              className="mb-2 px-0"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Meus Pedidos
            </Button>
            <h1 className="text-2xl font-bold">Pedido #{order.id.slice(-8)}</h1>
            <p className="text-sm text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              Realizado em {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`px-3 py-1 ${getStatusColor(order.status)}`}>
              {OrderStatusText[order.status]}
            </Badge>

            {["pending", "confirmed", "processing"].includes(order.status) && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                disabled={isCancelling}
                onClick={handleCancelOrder}
              >
                Cancelar Pedido
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Detalhes do pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de status do pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Pedido</CardTitle>
                <CardDescription>
                  Acompanhe o progresso do seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.statusHistory.map((status, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`rounded-full w-10 h-10 flex items-center justify-center ${getStatusColor(
                            status.status
                          )}`}
                        >
                          <Clock className="h-5 w-5" />
                        </div>
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-px h-full bg-muted-foreground/30 my-1"></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="font-medium">
                          {OrderStatusText[status.status]}
                        </p>
                        <time className="text-sm text-muted-foreground">
                          {formatDate(status.date)}
                        </time>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card de itens do pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-2">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          Qtd: {item.quantity}{" "}
                          {item.quantity > 1 ? "unidades" : "unidade"}
                        </div>
                        <div className="text-sm">
                          {formatCurrency(item.price)} cada
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card de entrega */}
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="mr-2 p-1 rounded-full bg-primary/10">
                  <TruckIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Informações de Entrega</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {order.deliveryAddress.street},{" "}
                      {order.deliveryAddress.number}
                      {order.deliveryAddress.complement
                        ? ` - ${order.deliveryAddress.complement}`
                        : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress.neighborhood} -{" "}
                      {order.deliveryAddress.city}/{order.deliveryAddress.state}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CEP: {order.deliveryAddress.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de pagamento */}
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="mr-2 p-1 rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Informações de Pagamento</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p>Método de pagamento</p>
                    <p className="font-medium">
                      {PaymentMethodText[order.payment.method]}
                    </p>
                  </div>

                  {order.payment.method === "credit_card" && (
                    <>
                      <div className="flex justify-between">
                        <p>Cartão</p>
                        <p className="font-medium">
                          Terminado em {order.payment.cardLastDigits}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p>Parcelas</p>
                        <p className="font-medium">
                          {order.payment.installments}x de{" "}
                          {formatCurrency(
                            order.total / (order.payment.installments || 1)
                          )}
                        </p>
                      </div>
                    </>
                  )}

                  {order.payment.method === "pix" && order.payment.pixCode && (
                    <div className="flex justify-between">
                      <p>Código PIX</p>
                      <p className="font-medium">{order.payment.pixCode}</p>
                    </div>
                  )}

                  {order.payment.method === "boleto" &&
                    order.payment.boletoCode && (
                      <div className="flex justify-between">
                        <p>Código do boleto</p>
                        <p className="font-mono text-xs break-all bg-muted p-2 rounded mt-1">
                          {order.payment.boletoCode}
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de resumo */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>{formatCurrency(order.subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Frete</p>
                    <p>{formatCurrency(order.shipping)}</p>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Desconto</p>
                      <p>-{formatCurrency(order.discount)}</p>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Imprimir Pedido
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="py-4 bg-muted mt-auto">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OrderDetail;
