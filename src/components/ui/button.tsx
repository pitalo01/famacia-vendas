/**
 * button.tsx
 *
 * Componente de botão reutilizável com múltiplas variantes e tamanhos.
 * Construído com Radix UI e estilizado com Tailwind CSS através do class-variance-authority.
 * Suporta diferentes estilos visuais, tamanhos e pode receber ícones.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Definição de variantes do botão usando class-variance-authority
 *
 * Inclui:
 * - Estilos base compartilhados por todas as variantes
 * - Variantes de aparência (default, destructive, outline, etc.)
 * - Variantes de tamanho (default, sm, lg, icon)
 * - Variantes padrão quando não especificadas
 */
const buttonVariants = cva(
  // Estilos base aplicados a todos os botões
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Variantes de aparência
      variant: {
        // Estilo padrão: fundo colorido com texto contrastante
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Estilo destrutivo: geralmente vermelho, para ações de exclusão
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Estilo contornado: apenas borda, sem preenchimento
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Estilo secundário: menos destaque que o padrão
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Estilo fantasma: visível apenas ao passar o mouse
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Estilo de link: aparência de texto com sublinhado
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Variantes de tamanho
      size: {
        default: "h-10 px-4 py-2", // Tamanho padrão
        sm: "h-9 rounded-md px-3", // Tamanho pequeno
        lg: "h-11 rounded-md px-8", // Tamanho grande
        icon: "h-10 w-10", // Tamanho quadrado para ícones
      },
    },
    // Variantes aplicadas quando não especificadas explicitamente
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Interface de propriedades do componente Button
 *
 * @property {boolean} asChild - Quando true, renderiza o conteúdo filho diretamente, útil para composição
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement> - Herda todas as propriedades HTML nativas de botão
 * @extends VariantProps<typeof buttonVariants> - Adiciona as propriedades de variante definidas acima
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Componente Button
 *
 * Um botão altamente personalizável que pode ser usado em diversas situações na interface.
 * Suporta todos os eventos e propriedades de um botão HTML nativo.
 *
 * @example
 * // Botão padrão
 * <Button>Clique aqui</Button>
 *
 * @example
 * // Botão destrutivo pequeno
 * <Button variant="destructive" size="sm">Excluir</Button>
 *
 * @example
 * // Botão com ícone
 * <Button><TrashIcon /> Excluir</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Se asChild for true, usa o Slot do Radix para compor o componente
    // Caso contrário, usa um elemento button padrão
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
// Define o nome de exibição para ferramentas de desenvolvimento
Button.displayName = "Button";

export { Button, buttonVariants };
