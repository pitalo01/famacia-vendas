/**
 * vite.config.ts
 *
 * Configuração do Vite para o projeto da Farmácia Virtual
 * - Define plugins (React com SWC)
 * - Configura aliases para importações
 * - Define configurações de servidor de desenvolvimento
 * - Configura opções de build
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Obtém o caminho do arquivo atual e o diretório para uso nas configurações
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração do Vite: https://vitejs.dev/config/
export default defineConfig({
  // Configurações do servidor de desenvolvimento
  server: {
    host: true, // Permite acesso de outros dispositivos na rede
    port: 3000, // Define a porta padrão como 3000
    open: true, // Abre o navegador automaticamente ao iniciar
    strictPort: false, // Permite o Vite tentar outra porta se 3000 estiver em uso
  },

  // Plugins utilizados no projeto
  plugins: [
    react(), // Plugin para suporte ao React com compilador SWC (mais rápido que Babel)
  ],

  // Configuração de resolução de módulos
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // Permite usar '@' como alias para o diretório 'src'
    },
  },

  // Configurações de build para produção
  build: {
    outDir: "dist", // Diretório de saída para os arquivos compilados
    sourcemap: true, // Gera sourcemaps para facilitar debugging em produção
  },

  // Adiciona esta configuração para suportar SPA (Single Page Application)
  // e garantir que o React Router funcione corretamente
  preview: {
    port: 3000,
    host: true,
  },
});
