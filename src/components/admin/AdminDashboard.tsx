import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

/**
 * Componente de Dashboard Administrativo
 *
 * Exibe estatísticas e métricas importantes para o administrador visualizar
 * o desempenho da loja, incluindo:
 * - Resumo de vendas
 * - Total de usuários
 * - Produtos mais vendidos
 * - Vendas por período
 * - Status de pedidos
 */
const AdminDashboard: React.FC = () => {
  // Estados para armazenar dados do dashboard
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>(
    {}
  );
  const [orderPeriod, setOrderPeriod] = useState<"week" | "month" | "year">(
    "month"
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Buscar dados das estatísticas
  useEffect(() => {
    // Simulando carregamento
    setIsLoading(true);

    setTimeout(() => {
      // Carregar dados do localStorage
      const storedOrders = localStorage.getItem("orders");
      const storedUsers = localStorage.getItem("auth-users");
      const storedProducts = localStorage.getItem("admin-products");

      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const products = storedProducts ? JSON.parse(storedProducts) : [];

      // Calcular estatísticas
      setTotalOrders(orders.length);
      setTotalUsers(users.length);
      setTotalProducts(products.length);

      // Calcular total de vendas
      const sales = orders.reduce((acc, order) => acc + order.total, 0);
      setTotalSales(sales);

      // Obter pedidos recentes (últimos 5)
      const recent = [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      setRecentOrders(recent);

      // Contar pedidos por status
      const statusCount = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      setOrdersByStatus(statusCount);

      // Calcular produtos mais vendidos
      // Criar um mapa de produtos e quantidades vendidas
      const productSales = {};
      orders.forEach((order) => {
        order.items.forEach((item) => {
          productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
      });

      // Organizar produtos por quantidade vendida
      const topSelling = products
        .filter((p) => productSales[p.id])
        .map((p) => ({
          ...p,
          quantitySold: productSales[p.id] || 0,
          totalSales: (productSales[p.id] || 0) * p.price,
        }))
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5);

      setTopProducts(topSelling);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Formatar valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card de Total de Vendas */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Vendas</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? "..." : formatCurrency(totalSales)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+12.5%</span>
              <span className="ml-1">desde o mês passado</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Total de Pedidos */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Pedidos</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? "..." : totalOrders}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ShoppingBag className="mr-1 h-3 w-3 text-pharmacy-primary" />
              <span>
                {isLoading
                  ? "..."
                  : `${Object.keys(ordersByStatus).length} status diferentes`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Total de Usuários */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Usuários</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? "..." : totalUsers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+8.1%</span>
              <span className="ml-1">novos usuários</span>
            </div>
          </CardContent>
        </Card>

        {/* Card de Produtos Cadastrados */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Produtos Cadastrados</CardDescription>
            <CardTitle className="text-2xl">
              {isLoading ? "..." : totalProducts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground flex items-center">
              <Package className="mr-1 h-3 w-3 text-pharmacy-primary" />
              <span>
                {isLoading
                  ? "..."
                  : `${Math.round(totalProducts * 0.87)} em estoque`}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Pedidos Recentes e Status */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Pedidos Recentes
            </CardTitle>
            <CardDescription>
              Visão geral dos últimos pedidos recebidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-12 bg-muted/60 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const createdDate = new Date(order.createdAt);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div>
                        <div className="font-medium">
                          Pedido #{order.id.slice(-8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {createdDate.toLocaleDateString("pt-BR")} -{" "}
                          {order.items.length} itens
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-medium">
                          {formatCurrency(order.total)}
                        </div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status === "delivered"
                            ? "Entregue"
                            : order.status === "cancelled"
                            ? "Cancelado"
                            : order.status === "shipped"
                            ? "Enviado"
                            : order.status === "processing"
                            ? "Em preparação"
                            : order.status === "confirmed"
                            ? "Confirmado"
                            : "Aguardando pagamento"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum pedido registrado.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="text-xs text-muted-foreground">
              Exibindo {recentOrders.length} de {totalOrders} pedidos
            </div>
            <div className="text-xs text-pharmacy-primary cursor-pointer hover:underline">
              Ver todos os pedidos
            </div>
          </CardFooter>
        </Card>

        {/* Produtos Mais Vendidos */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Top produtos por volume de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-12 bg-muted/60 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div className="text-sm font-medium line-clamp-1">
                          {product.name}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {product.quantitySold} un.
                      </div>
                    </div>
                    <Progress
                      value={
                        (product.quantitySold / topProducts[0].quantitySold) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum dado de vendas disponível.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas de Pedidos por Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Análise de Pedidos
          </CardTitle>
          <CardDescription>Estatísticas de pedidos por status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 bg-muted/60 animate-pulse rounded" />
          ) : Object.keys(ordersByStatus).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(ordersByStatus).map(([status, count]) => {
                const statusText =
                  status === "delivered"
                    ? "Entregue"
                    : status === "cancelled"
                    ? "Cancelado"
                    : status === "shipped"
                    ? "Enviado"
                    : status === "processing"
                    ? "Em preparação"
                    : status === "confirmed"
                    ? "Confirmado"
                    : "Aguardando pagamento";

                const percentage = (count / totalOrders) * 100;

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">{statusText}</div>
                      <div className="text-sm">
                        {count} pedidos ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        status === "delivered"
                          ? "bg-muted/30 [&>div]:bg-green-500"
                          : status === "cancelled"
                          ? "bg-muted/30 [&>div]:bg-red-500"
                          : status === "shipped"
                          ? "bg-muted/30 [&>div]:bg-blue-500"
                          : "bg-muted/30 [&>div]:bg-amber-500"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum dado de pedidos disponível.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
