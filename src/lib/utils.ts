/**
 * utils.ts
 *
 * Funções utilitárias usadas em toda a aplicação
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS com suporte a Tailwind
 *
 * @param inputs - Classes CSS a serem combinadas
 * @returns String de classes CSS combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um número para o formato de moeda (BRL)
 *
 * @param value - Valor a ser formatado
 * @returns String formatada como moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
