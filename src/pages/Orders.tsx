/**
 * Orders.tsx
 *
 * Página que exibe o histórico de pedidos do usuário,
 * permitindo visualizar todos os pedidos realizados e seus status.
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useOrders, OrderStatusText } from "@/lib/order-context";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  ChevronRight,
  Package,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Componente da página de histórico de pedidos
 */
const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { userOrders } = useOrders();

  // Redireciona para página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirect: "/orders" } });
    }
  }, [isAuthenticated, navigate]);

  // Se não houver usuário autenticado, exibe um estado de carregamento
  if (!user) {
    return <div>Carregando...</div>;
  }

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  // Ordenar pedidos por data (mais recentes primeiro)
  const sortedOrders = [...userOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filtrar pedidos por status
  const activeOrders = sortedOrders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status)
  );
  const completedOrders = sortedOrders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="mb-2 px-0"
              onClick={() => navigate("/profile")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Meu Perfil
            </Button>
            <h1 className="text-2xl font-bold">Meus Pedidos</h1>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídos</TabsTrigger>
          </TabsList>

          {/* Todos os pedidos */}
          <TabsContent value="all" className="space-y-6">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="mb-1">
                          Pedido #{order.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${getStatusColor(order.status)}`}
                      >
                        {OrderStatusText[order.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}{" "}
                              {item.quantity > 1 ? "unidades" : "unidade"}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Mostrar quantos itens adicionais existem */}
                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          + {order.items.length - 3}{" "}
                          {order.items.length - 3 > 1
                            ? "outros itens"
                            : "outro item"}
                        </p>
                      )}
                    </div>

                    {/* Total e botão de detalhes */}
                    <div className="flex justify-between items-center border-t mt-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center"
                      >
                        Ver Detalhes
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    Sem pedidos ainda
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Você ainda não realizou nenhum pedido.
                  </p>
                  <Button className="mt-6" onClick={() => navigate("/")}>
                    Explorar Produtos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pedidos em andamento */}
          <TabsContent value="active" className="space-y-6">
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="mb-1">
                          Pedido #{order.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${getStatusColor(order.status)}`}
                      >
                        {OrderStatusText[order.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}{" "}
                              {item.quantity > 1 ? "unidades" : "unidade"}
                            </p>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          + {order.items.length - 3}{" "}
                          {order.items.length - 3 > 1
                            ? "outros itens"
                            : "outro item"}
                        </p>
                      )}
                    </div>

                    {/* Total e botão de detalhes */}
                    <div className="flex justify-between items-center border-t mt-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center"
                      >
                        Ver Detalhes
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    Sem pedidos em andamento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Você não possui pedidos em andamento no momento.
                  </p>
                  <Button className="mt-6" onClick={() => navigate("/")}>
                    Explorar Produtos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pedidos concluídos */}
          <TabsContent value="completed" className="space-y-6">
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <CardTitle className="mb-1">
                          Pedido #{order.id.slice(-8)}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`px-3 py-1 ${getStatusColor(order.status)}`}
                      >
                        {OrderStatusText[order.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-muted flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}{" "}
                              {item.quantity > 1 ? "unidades" : "unidade"}
                            </p>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          + {order.items.length - 3}{" "}
                          {order.items.length - 3 > 1
                            ? "outros itens"
                            : "outro item"}
                        </p>
                      )}
                    </div>

                    {/* Total e botão de detalhes */}
                    <div className="flex justify-between items-center border-t mt-4 pt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center"
                      >
                        Ver Detalhes
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    Sem pedidos concluídos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Você ainda não tem pedidos concluídos.
                  </p>
                  <Button className="mt-6" onClick={() => navigate("/")}>
                    Explorar Produtos
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
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

export default Orders;
