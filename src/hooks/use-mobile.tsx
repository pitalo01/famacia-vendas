/**
 * use-mobile.tsx
 *
 * Hook personalizado para detectar se o dispositivo atual é um dispositivo móvel
 * baseado na largura da tela. É usado em componentes para adaptar a interface de
 * acordo com o tamanho do dispositivo.
 */

import * as React from "react";

// Define o ponto de quebra para considerar um dispositivo como móvel (menor que 768px)
const MOBILE_BREAKPOINT = 768;

/**
 * Hook useIsMobile
 *
 * Detecta se o dispositivo atual é móvel baseado na largura da tela.
 *
 * @returns {boolean} - Retorna true se o dispositivo for móvel (largura < 768px)
 *
 * Funcionalidades:
 * - Inicializa o estado como undefined
 * - Utiliza MediaQueryList para detectar alterações na largura da tela
 * - Atualiza o estado quando a largura da tela muda
 * - Remove os event listeners quando o componente é desmontado
 */
export function useIsMobile() {
  // Estado para armazenar se o dispositivo é móvel
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    // Cria um MediaQueryList para detectar quando a tela é menor que o ponto de quebra móvel
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Função que atualiza o estado quando a largura da tela muda
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Adiciona um listener para detectar mudanças na largura da tela
    mql.addEventListener("change", onChange);

    // Define o estado inicial com base na largura atual da tela
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup: remove o listener quando o componente é desmontado
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Retorna se é móvel, garantindo que o valor seja boolean (!! converte undefined para false)
  return !!isMobile;
}
