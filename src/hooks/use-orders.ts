import { useLocalStorage } from "./use-storage";
import { CartItem } from "@/lib/cart-context";
import { Address } from "./use-addresses";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: Address;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  trackingCode?: string;
}

export const useOrders = () => {
  const [orders, setOrders, clearOrders] = useLocalStorage<Order[]>(
    "user-orders",
    []
  );

  const createOrder = (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((current) => [newOrder, ...current]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const addTrackingCode = (orderId: string, trackingCode: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, trackingCode, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "cancelled",
              updatedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    addTrackingCode,
    getOrder,
    getOrdersByStatus,
    cancelOrder,
    clearOrders,
  };
};
