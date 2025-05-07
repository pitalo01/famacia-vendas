/**
 * cart-context.tsx
 *
 * Contexto para gerenciamento de carrinho de compras com persistência local.
 * Permite adicionar, remover e atualizar produtos no carrinho,
 * com os dados sendo persistidos no localStorage.
 */

import React, { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-storage";
import { toast } from "sonner";

/**
 * Interface de produto no carrinho
 *
 * @property {string} id - ID único do produto
 * @property {string} name - Nome do produto
 * @property {string} image - URL da imagem do produto
 * @property {number} price - Preço unitário do produto
 * @property {number} quantity - Quantidade selecionada
 * @property {boolean} requiresPrescription - Indica se o produto requer receita médica
 */
export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  requiresPrescription?: boolean;
}

/**
 * Interface do contexto do carrinho
 *
 * Define todas as propriedades e métodos disponíveis através do contexto
 */
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

// Criação do contexto com valor padrão
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Props do provedor de contexto do carrinho
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provedor do contexto de carrinho
 *
 * Gerencia o estado do carrinho e fornece métodos para manipulá-lo.
 * Utiliza localStorage para persistência dos dados.
 *
 * @param {CartProviderProps} props - Props do componente
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Utilizando o hook customizado para persistir o carrinho no localStorage
  const [items, setItems, clearItems] = useLocalStorage<CartItem[]>(
    "cart-items",
    []
  );

  /**
   * Adiciona um produto ao carrinho
   *
   * Se o produto já existe, aumenta sua quantidade
   *
   * @param {CartItem} newItem - Produto a ser adicionado
   */
  const addItem = (newItem: CartItem) => {
    setItems((currentItems) => {
      // Verifica se o item já existe no carrinho
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === newItem.id
      );

      // Se o item já existe, incrementa a quantidade
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity:
            updatedItems[existingItemIndex].quantity + (newItem.quantity || 1),
        };
        return updatedItems;
      }

      // Caso contrário, adiciona o novo item
      return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
    });

    toast.success("Produto adicionado ao carrinho!", {
      description: newItem.name,
    });
  };

  /**
   * Atualiza a quantidade de um produto no carrinho
   *
   * @param {string} id - ID do produto
   * @param {number} quantity - Nova quantidade
   */
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Remove um produto do carrinho
   *
   * @param {string} id - ID do produto a ser removido
   */
  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    toast.info("Produto removido do carrinho");
  };

  /**
   * Limpa todos os itens do carrinho
   */
  const clearCart = () => {
    clearItems();
    toast.info("Carrinho esvaziado");
  };

  // Calcula o subtotal somando o preço * quantidade de todos os itens
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calcula o total de itens (soma das quantidades)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Valores e métodos fornecidos pelo contexto
  const value: CartContextType = {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook personalizado para acessar o contexto do carrinho
 *
 * @returns {CartContextType} Contexto do carrinho
 * @throws {Error} Se usado fora de um CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }

  return context;
};
