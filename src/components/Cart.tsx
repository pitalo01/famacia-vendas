import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, AlertTriangle, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Sample cart item type
interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
}

// Sample cart data
const sampleCartItems: CartItem[] = [
  {
    id: "1",
    name: "Dipirona Sódica 1g com 10 comprimidos",
    image: "/placeholder.svg",
    price: 12.99,
    quantity: 1,
    requiresPrescription: false,
  },
  {
    id: "2",
    name: "Vitamina C 1g com 30 comprimidos efervescentes",
    image: "/placeholder.svg",
    price: 25.9,
    quantity: 2,
    requiresPrescription: false,
  },
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = React.useState<CartItem[]>(sampleCartItems);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const FREE_SHIPPING_THRESHOLD = 100;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const total = subtotal + shippingFee;

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success("Item removido do carrinho");
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { redirectTo: "/checkout" } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-medium">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Adicione produtos ao seu carrinho para continuar com a compra
        </p>
        <Button asChild>
          <Link to="/categories">Continuar comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row border rounded-lg p-4 animate-fade-in"
            >
              <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-grow sm:ml-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    {item.requiresPrescription && (
                      <div className="mt-1 flex items-center">
                        <span className="prescription-badge flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Receita
                          necessária
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-pharmacy-primary mt-1 sm:mt-0">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <Button variant="outline" asChild>
              <Link to="/categories">Continuar comprando</Link>
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg h-fit space-y-4">
          <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            {shippingFee === 0 ? (
              <span className="text-pharmacy-green">Grátis</span>
            ) : (
              <span>R$ {shippingFee.toFixed(2)}</span>
            )}
          </div>
          {shippingFee > 0 && (
            <div className="text-xs text-muted-foreground">
              Faltam R$ {(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} para
              frete grátis
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-lg">R$ {total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark-primary"
            onClick={handleCheckout}
          >
            Finalizar Compra
          </Button>

          {cartItems.some((item) => item.requiresPrescription) && (
            <div className="flex items-start space-x-2 p-3 bg-pharmacy-red/10 rounded-md mt-4">
              <AlertTriangle className="h-5 w-5 text-pharmacy-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-pharmacy-red">
                Este pedido contém itens que exigem receita médica. Você
                precisará apresentar a receita para concluir a compra.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
