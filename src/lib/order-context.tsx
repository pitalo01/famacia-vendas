/**
 * order-context.tsx
 *
 * Contexto para gerenciamento de pedidos com persistência local.
 * Permite criar, listar e gerenciar pedidos dos usuários,
 * com os dados sendo persistidos no localStorage.
 */

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/use-storage";
import { useAuth } from "@/lib/auth-context";
import { CartItem } from "@/lib/cart-context";
import { toast } from "sonner";

/**
 * Enumeração dos possíveis status de um pedido
 */
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

/**
 * Mapeamento dos status de pedido para texto em português
 */
export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Aguardando pagamento",
  [OrderStatus.CONFIRMED]: "Confirmado",
  [OrderStatus.PROCESSING]: "Em preparação",
  [OrderStatus.SHIPPED]: "Enviado",
  [OrderStatus.DELIVERED]: "Entregue",
  [OrderStatus.CANCELLED]: "Cancelado",
};

/**
 * Interface para endereço de entrega
 */
export interface DeliveryAddress {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Interface para métodos de pagamento
 */
export enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  BOLETO = "boleto",
  PIX = "pix",
}

/**
 * Mapeamento dos métodos de pagamento para texto em português
 */
export const PaymentMethodText: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: "Cartão de crédito",
  [PaymentMethod.BOLETO]: "Boleto bancário",
  [PaymentMethod.PIX]: "PIX",
};

/**
 * Interface para informações de pagamento
 */
export interface PaymentInfo {
  method: PaymentMethod;
  installments?: number;
  cardLastDigits?: string;
  pixCode?: string;
  boletoCode?: string;
}

/**
 * Interface de pedido
 *
 * @property {string} id - ID único do pedido
 * @property {string} userId - ID do usuário que fez o pedido
 * @property {Date} createdAt - Data de criação do pedido
 * @property {Date} updatedAt - Data da última atualização do pedido
 * @property {OrderStatus} status - Status atual do pedido
 * @property {CartItem[]} items - Itens incluídos no pedido
 * @property {number} subtotal - Valor total dos produtos
 * @property {number} shipping - Valor do frete
 * @property {number} discount - Valor de desconto aplicado
 * @property {number} total - Valor total do pedido
 * @property {DeliveryAddress} deliveryAddress - Endereço de entrega
 * @property {PaymentInfo} payment - Informações de pagamento
 */
export interface Order {
  id: string;
  userId: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    date: string; // ISO string
  }[];
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  payment: PaymentInfo;
}

/**
 * Interface para criação de pedido
 */
export type CreateOrderData = Omit<
  Order,
  "id" | "createdAt" | "updatedAt" | "userId" | "statusHistory"
>;

/**
 * Interface do contexto de pedidos
 *
 * Define todas as propriedades e métodos disponíveis através do contexto
 */
interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  createOrder: (orderData: CreateOrderData) => Promise<string>;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

// Criação do contexto com valor padrão
const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Props do provedor de contexto de pedidos
 */
interface OrderProviderProps {
  children: ReactNode;
}

/**
 * Provedor do contexto de pedidos
 *
 * Gerencia o estado dos pedidos e fornece métodos para manipulá-los.
 * Utiliza localStorage para persistência dos dados.
 *
 * @param {OrderProviderProps} props - Props do componente
 */
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  // Armazena os pedidos no localStorage
  const [orders, setOrders] = useLocalStorage<Order[]>("orders", []);

  // Acessa o contexto de autenticação para obter o usuário atual
  const { user } = useAuth();

  // Pedidos do usuário atual
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // Filtra os pedidos do usuário atual quando user ou orders mudam
  useEffect(() => {
    if (user) {
      const filteredOrders = orders.filter((order) => order.userId === user.id);
      setUserOrders(filteredOrders);
    } else {
      setUserOrders([]);
    }
  }, [user, orders]);

  /**
   * Cria um novo pedido
   *
   * @param {CreateOrderData} orderData - Dados do pedido a ser criado
   * @returns {Promise<string>} - ID do pedido criado
   */
  const createOrder = async (orderData: CreateOrderData): Promise<string> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!user) {
      toast.error("Erro ao criar pedido", {
        description: "Usuário não está autenticado.",
      });
      throw new Error("Usuário não autenticado");
    }

    try {
      const now = new Date().toISOString();
      const orderId = `order-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      const newOrder: Order = {
        id: orderId,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
        statusHistory: [
          {
            status: OrderStatus.PENDING,
            date: now,
          },
        ],
        ...orderData,
      };

      setOrders((prevOrders) => [...prevOrders, newOrder]);

      toast.success("Pedido realizado com sucesso!", {
        description: `Pedido #${orderId.slice(-8)} criado.`,
      });

      return orderId;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao criar pedido", {
        description: "Ocorreu um erro ao processar seu pedido.",
      });
      throw error;
    }
  };

  /**
   * Obtém um pedido pelo ID
   *
   * @param {string} orderId - ID do pedido
   * @returns {Order | undefined} - Pedido encontrado ou undefined
   */
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  /**
   * Cancela um pedido
   *
   * @param {string} orderId - ID do pedido a ser cancelado
   * @returns {Promise<boolean>} - Indica se o cancelamento foi bem-sucedido
   */
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user) {
      toast.error("Erro ao cancelar pedido", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      const orderIndex = orders.findIndex((order) => order.id === orderId);

      if (orderIndex === -1) {
        toast.error("Erro ao cancelar pedido", {
          description: "Pedido não encontrado.",
        });
        return false;
      }

      const order = orders[orderIndex];

      // Verifica se o pedido pertence ao usuário atual
      if (order.userId !== user.id) {
        toast.error("Erro ao cancelar pedido", {
          description: "Você não tem permissão para cancelar este pedido.",
        });
        return false;
      }

      // Verifica se o pedido pode ser cancelado
      if (
        [OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)
      ) {
        toast.error("Erro ao cancelar pedido", {
          description: "Este pedido não pode ser cancelado.",
        });
        return false;
      }

      const now = new Date().toISOString();
      const updatedOrder: Order = {
        ...order,
        status: OrderStatus.CANCELLED,
        updatedAt: now,
        statusHistory: [
          ...order.statusHistory,
          {
            status: OrderStatus.CANCELLED,
            date: now,
          },
        ],
      };

      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = updatedOrder;
      setOrders(updatedOrders);

      toast.success("Pedido cancelado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      toast.error("Erro ao cancelar pedido", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  // Valores e métodos fornecidos pelo contexto
  const value: OrderContextType = {
    orders,
    userOrders,
    createOrder,
    getOrderById,
    cancelOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

/**
 * Hook personalizado para acessar o contexto de pedidos
 *
 * @returns {OrderContextType} Contexto de pedidos
 * @throws {Error} Se usado fora de um OrderProvider
 */
export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error("useOrders deve ser usado dentro de um OrderProvider");
  }

  return context;
};
