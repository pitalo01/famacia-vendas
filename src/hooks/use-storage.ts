/**
 * use-storage.ts
 *
 * Hook personalizado para persistência de dados no localStorage.
 * Fornece métodos para salvar, recuperar e remover dados, com suporte a tipagem.
 */

import { useState, useEffect } from "react";

/**
 * Hook useLocalStorage
 *
 * Permite persistir e recuperar dados do localStorage com suporte a tipagem.
 *
 * @param {string} key - Chave para armazenar o valor no localStorage
 * @param {T} initialValue - Valor inicial caso não exista dado armazenado
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} - Valor armazenado, função para atualizar e função para remover
 *
 * @example
 * // Gerenciar carrinho de compras
 * const [cart, setCart, clearCart] = useLocalStorage('cart', []);
 *
 * // Adicionar produto ao carrinho
 * setCart([...cart, newProduct]);
 *
 * // Limpar carrinho
 * clearCart();
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Tenta obter o valor do localStorage
      const item = window.localStorage.getItem(key);
      // Retorna o valor armazenado (parseado) ou o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Em caso de erro, retorna o valor inicial
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      return initialValue;
    }
  });

  // Atualiza o localStorage quando o estado muda
  useEffect(() => {
    try {
      // Armazena o valor atual no localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }, [key, storedValue]);

  // Função para atualizar o valor armazenado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite usar um callback para atualizar o valor (como o setState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Atualiza o estado
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Erro ao atualizar ${key} no localStorage:`, error);
    }
  };

  // Função para remover o valor do localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover ${key} do localStorage:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook useSessionStorage
 *
 * Similar ao useLocalStorage, mas utiliza sessionStorage (dados persistem apenas durante a sessão).
 *
 * @param {string} key - Chave para armazenar o valor no sessionStorage
 * @param {T} initialValue - Valor inicial caso não exista dado armazenado
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} - Valor armazenado, função para atualizar e função para remover
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Tenta obter o valor do sessionStorage
      const item = window.sessionStorage.getItem(key);
      // Retorna o valor armazenado (parseado) ou o valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Em caso de erro, retorna o valor inicial
      console.error(`Erro ao carregar ${key} do sessionStorage:`, error);
      return initialValue;
    }
  });

  // Atualiza o sessionStorage quando o estado muda
  useEffect(() => {
    try {
      // Armazena o valor atual no sessionStorage
      window.sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no sessionStorage:`, error);
    }
  }, [key, storedValue]);

  // Função para atualizar o valor armazenado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite usar um callback para atualizar o valor (como o setState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Atualiza o estado
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Erro ao atualizar ${key} no sessionStorage:`, error);
    }
  };

  // Função para remover o valor do sessionStorage
  const removeValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover ${key} do sessionStorage:`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}
