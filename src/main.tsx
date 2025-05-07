/**
 * main.tsx
 *
 * Arquivo de ponto de entrada da aplicação React que:
 * - Importa o componente App principal
 * - Importa os estilos globais
 * - Renderiza a aplicação no elemento raiz do DOM
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Cria uma raiz React e renderiza o componente App no elemento com id "root" do HTML
// O operador "!" indica ao TypeScript que temos certeza que esse elemento existe
createRoot(document.getElementById("root")!).render(<App />);
