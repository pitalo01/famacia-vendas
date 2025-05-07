import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  TrendingUp,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowUpDown,
  CalendarIcon,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  OrderStatus,
  OrderStatusText,
  PaymentMethodText,
} from "@/lib/order-context";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Tipo para pedidos
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    date: string;
  }[];
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryAddress: {
    id: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  payment: {
    method: string;
    installments?: number;
    cardLastDigits?: string;
    pixCode?: string;
    boletoCode?: string;
  };
}

// Tipo para armazenar os dados de usuários
interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Componente AdminOrders
 *
 * Permite aos administradores gerenciar todos os pedidos da loja:
 * - Visualizar lista de pedidos com filtros
 * - Ver detalhes de cada pedido
 * - Atualizar status de pedidos
 * - Buscar pedidos por ID ou cliente
 */
const AdminOrders: React.FC = () => {
  // Estados do componente
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | "";
    direction: "ascending" | "descending";
  }>({
    key: "createdAt",
    direction: "descending",
  });

  const ITEMS_PER_PAGE = 10;

  // Buscar dados dos pedidos e usuários
  useEffect(() => {
    // Simular tempo de carregamento
    setLoading(true);

    setTimeout(() => {
      // Carregar pedidos do localStorage
      const storedOrders = localStorage.getItem("orders");
      const storedUsers = localStorage.getItem("auth-users");

      const ordersData = storedOrders ? JSON.parse(storedOrders) : [];
      const usersData = storedUsers ? JSON.parse(storedUsers) : [];

      // Processar dados de usuários para acesso rápido
      const usersMap: Record<string, User> = {};
      usersData.forEach((user: User) => {
        usersMap[user.id] = user;
      });

      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setUsers(usersMap);
      setTotalPages(Math.ceil(ordersData.length / ITEMS_PER_PAGE));
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar e ordenar pedidos
  useEffect(() => {
    let result = [...orders];

    // Aplicar filtro de texto (busca)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          (users[order.userId]?.name || "").toLowerCase().includes(query) ||
          (users[order.userId]?.email || "").toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de status
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Aplicar ordenação
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Tratamento especial para datas
        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();

          if (sortConfig.direction === "ascending") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        }

        // Outros campos
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  }, [orders, searchQuery, statusFilter, sortConfig, users]);

  // Obter pedidos da página atual
  const getCurrentPageOrders = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Alternar ordenação ao clicar no cabeçalho da tabela
  const handleSort = (key: keyof Order) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  // Formatar valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Formatar datas
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Ver detalhes de um pedido
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Atualizar status de um pedido
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const now = new Date().toISOString();

    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          updatedAt: now,
          statusHistory: [
            ...order.statusHistory,
            {
              status: newStatus,
              date: now,
            },
          ],
        };
      }
      return order;
    });

    setOrders(updatedOrders);

    // Atualizar também o pedido selecionado se estiver aberto
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        updatedAt: now,
        statusHistory: [
          ...selectedOrder.statusHistory,
          {
            status: newStatus,
            date: now,
          },
        ],
      });
    }

    // Persistir mudanças no localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    toast.success("Status do pedido atualizado", {
      description: `Pedido #${orderId.slice(-8)} agora está como "${
        OrderStatusText[newStatus]
      }"`,
    });
  };

  // Renderiza o badge de status do pedido com cor correspondente
  const renderStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.PENDING]: {
        color: "bg-amber-100 text-amber-800 hover:bg-amber-200",
        label: OrderStatusText[OrderStatus.PENDING],
      },
      [OrderStatus.CONFIRMED]: {
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        label: OrderStatusText[OrderStatus.CONFIRMED],
      },
      [OrderStatus.PROCESSING]: {
        color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        label: OrderStatusText[OrderStatus.PROCESSING],
      },
      [OrderStatus.SHIPPED]: {
        color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        label: OrderStatusText[OrderStatus.SHIPPED],
      },
      [OrderStatus.DELIVERED]: {
        color: "bg-green-100 text-green-800 hover:bg-green-200",
        label: OrderStatusText[OrderStatus.DELIVERED],
      },
      [OrderStatus.CANCELLED]: {
        color: "bg-red-100 text-red-800 hover:bg-red-200",
        label: OrderStatusText[OrderStatus.CANCELLED],
      },
    };

    const config = statusConfig[status];

    return (
      <Badge variant="outline" className={`${config.color} font-normal`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <ShoppingBag className="mr-2" />
            Gerenciamento de Pedidos
          </CardTitle>
          <CardDescription>
            Acompanhe e gerencie todos os pedidos da loja.
          </CardDescription>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente ou email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {Object.entries(OrderStatusText).map(([status, label]) => (
                    <SelectItem key={status} value={status}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 bg-muted/60 animate-pulse rounded"
                  />
                ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="w-[150px] cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Pedido ID
                        {sortConfig.key === "id" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Data
                        {sortConfig.key === "createdAt" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center">
                        Total
                        {sortConfig.key === "total" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortConfig.key === "status" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentPageOrders().map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          {users[order.userId]?.name ||
                            "Usuário não encontrado"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {users[order.userId]?.email || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>{renderStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || statusFilter !== "all"
                  ? "Tente ajustar seus filtros de busca."
                  : "Não há pedidos registrados no sistema."}
              </p>
            </div>
          )}
        </CardContent>

        {filteredOrders.length > 0 && (
          <CardFooter className="flex justify-between items-center border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Exibindo {Math.min(filteredOrders.length, ITEMS_PER_PAGE)} de{" "}
              {filteredOrders.length} pedidos
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Pedido #{selectedOrder.id.slice(-8)}</span>
                  {renderStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>
                  Efetuado em {formatDate(selectedOrder.createdAt)} por{" "}
                  {users[selectedOrder.userId]?.name ||
                    "Usuário não encontrado"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Tabs para navegar entre detalhes do pedido */}
                <Tabs defaultValue="items">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="items">Itens do Pedido</TabsTrigger>
                    <TabsTrigger value="customer">
                      Cliente e Entrega
                    </TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>

                  {/* Tab de Itens do Pedido */}
                  <TabsContent value="items" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border-b pb-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} x {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Frete:</span>
                        <span>{formatCurrency(selectedOrder.shipping)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Desconto:
                          </span>
                          <span className="text-green-600">
                            -{formatCurrency(selectedOrder.discount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-1 text-sm">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Pagamento:
                        </span>
                        <span className="font-medium">
                          {PaymentMethodText[
                            selectedOrder.payment.method as any
                          ] || selectedOrder.payment.method}
                          {selectedOrder.payment.installments &&
                            ` (${selectedOrder.payment.installments}x)`}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab de Cliente e Entrega */}
                  <TabsContent value="customer" className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Dados do Cliente
                        </h3>
                        <div className="bg-muted rounded-lg p-4 space-y-2">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Nome:
                            </div>
                            <div>
                              {users[selectedOrder.userId]?.name ||
                                "Não informado"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Email:
                            </div>
                            <div>
                              {users[selectedOrder.userId]?.email ||
                                "Não informado"}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              ID:
                            </div>
                            <div>{selectedOrder.userId}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Endereço de Entrega
                        </h3>
                        <div className="bg-muted rounded-lg p-4 space-y-2">
                          <div>
                            <div className="font-medium">
                              {selectedOrder.deliveryAddress.street},{" "}
                              {selectedOrder.deliveryAddress.number}
                              {selectedOrder.deliveryAddress.complement &&
                                ` - ${selectedOrder.deliveryAddress.complement}`}
                            </div>
                            <div>
                              {selectedOrder.deliveryAddress.neighborhood}
                            </div>
                            <div>
                              {selectedOrder.deliveryAddress.city} -{" "}
                              {selectedOrder.deliveryAddress.state}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              CEP: {selectedOrder.deliveryAddress.zipCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab de Histórico */}
                  <TabsContent value="history" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      {selectedOrder.statusHistory.map((status, index) => {
                        const statusDate = new Date(status.date);
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 border-b pb-3 last:border-0"
                          >
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                status.status === OrderStatus.DELIVERED
                                  ? "bg-green-100 text-green-800"
                                  : status.status === OrderStatus.CANCELLED
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {status.status === OrderStatus.DELIVERED ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : status.status === OrderStatus.CANCELLED ? (
                                <XCircle className="h-4 w-4" />
                              ) : status.status === OrderStatus.SHIPPED ? (
                                <Truck className="h-4 w-4" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {OrderStatusText[status.status]}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {statusDate.toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                às{" "}
                                {statusDate.toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2 border-t mt-6">
                <div className="flex-1 text-sm text-muted-foreground sm:text-left">
                  Última atualização: {formatDate(selectedOrder.updatedAt)}
                </div>

                {/* Atualizar status do pedido */}
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) =>
                      updateOrderStatus(selectedOrder.id, value as OrderStatus)
                    }
                    defaultValue={selectedOrder.status}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Atualizar status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(OrderStatusText).map(
                        ([status, label]) => (
                          <SelectItem
                            key={status}
                            value={status}
                            disabled={status === selectedOrder.status}
                          >
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
