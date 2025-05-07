/**
 * Checkout.tsx
 *
 * Página de checkout que permite ao usuário finalizar seu pedido,
 * selecionando endereço de entrega e método de pagamento.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  useOrders,
  OrderStatus,
  PaymentMethod,
  PaymentMethodText,
  DeliveryAddress,
} from "@/lib/order-context";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Plus, CreditCard, Landmark, QrCode } from "lucide-react";

// Custo fixo do frete
const SHIPPING_COST = 12.9;

/**
 * Componente da página de checkout
 */
const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  // Estados locais
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CREDIT_CARD
  );
  const [installments, setInstallments] = useState<number>(1);
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Redireciona para página de login se o usuário não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirect: "/checkout" } });
    }
  }, [isAuthenticated, navigate]);

  // Redireciona para o carrinho se estiver vazio
  useEffect(() => {
    if (items.length === 0) {
      toast.info("Seu carrinho está vazio", {
        description: "Adicione produtos antes de finalizar a compra.",
      });
      navigate("/cart");
    }
  }, [items, navigate]);

  // Seleciona o endereço padrão automaticamente
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find((addr) => addr.isDefault);

      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (user.addresses.length > 0) {
        setSelectedAddressId(user.addresses[0].id);
      }
    }
  }, [user]);

  // Função para formatar o número do cartão
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .substr(0, 19);
  };

  // Função para formatar a data de validade do cartão
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,4})/, "$1/$2")
      .substr(0, 5);
  };

  // Handler para mudança do número do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  // Handler para mudança da data de validade
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiryDate(e.target.value));
  };

  // Handler para mudança do código de segurança
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvc(e.target.value.replace(/\D/g, "").substr(0, 3));
  };

  // Obter o endereço selecionado
  const selectedAddress = user?.addresses?.find(
    (addr) => addr.id === selectedAddressId
  );

  // Calcular total do pedido
  const shipping = SHIPPING_COST;
  const discount = 0; // Implementar lógica de desconto se necessário
  const total = subtotal + shipping - discount;

  // Processar o pedido
  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar a compra");
      return;
    }

    if (!selectedAddress) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      // Validação básica do cartão de crédito
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Número de cartão inválido");
        return;
      }

      if (!cardName.trim()) {
        toast.error("Informe o nome no cartão");
        return;
      }

      if (!cardExpiry.trim() || cardExpiry.length !== 5) {
        toast.error("Data de validade inválida");
        return;
      }

      if (!cardCvc.trim() || cardCvc.length !== 3) {
        toast.error("Código de segurança inválido");
        return;
      }
    }

    try {
      setIsProcessing(true);

      // Preparar o endereço de entrega
      const deliveryAddress: DeliveryAddress = {
        id: selectedAddress.id,
        street: selectedAddress.street,
        number: selectedAddress.number,
        complement: selectedAddress.complement,
        neighborhood: selectedAddress.neighborhood,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
      };

      // Configurar informações de pagamento com base no método selecionado
      const paymentInfo = {
        method: paymentMethod,
        ...(paymentMethod === PaymentMethod.CREDIT_CARD
          ? {
              installments,
              cardLastDigits: cardNumber.replace(/\s/g, "").slice(-4),
            }
          : {}),
        ...(paymentMethod === PaymentMethod.PIX
          ? {
              pixCode: `PIX${Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()}`,
            }
          : {}),
        ...(paymentMethod === PaymentMethod.BOLETO
          ? {
              boletoCode: `34191${Math.random()
                .toString()
                .slice(2, 12)}${Math.random().toString().slice(2, 12)}`,
            }
          : {}),
      };

      // Criar o pedido
      const orderId = await createOrder({
        status: OrderStatus.PENDING,
        items: [...items],
        subtotal,
        shipping,
        discount,
        total,
        deliveryAddress,
        payment: paymentInfo,
      });

      // Limpar o carrinho
      clearCart();

      // Redirecionar para a página do pedido
      navigate(`/orders/${orderId}`);
    } catch (error) {
      console.error("Erro ao processar pedido:", error);
      toast.error("Não foi possível processar seu pedido", {
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Caso o usuário não esteja logado, mostrar indicador de carregamento
  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Endereço e Pagamento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Seção de endereço de entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
                <CardDescription>
                  Selecione o endereço para entrega do seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    <Select
                      value={selectedAddressId}
                      onValueChange={setSelectedAddressId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um endereço" />
                      </SelectTrigger>
                      <SelectContent>
                        {user.addresses.map((address) => (
                          <SelectItem key={address.id} value={address.id}>
                            {address.street}, {address.number}
                            {address.complement
                              ? ` - ${address.complement}`
                              : ""}{" "}
                            - {address.city}/{address.state}
                            {address.isDefault ? " (Padrão)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedAddress && (
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <p className="font-medium">
                          {selectedAddress.street}, {selectedAddress.number}
                          {selectedAddress.complement
                            ? ` - ${selectedAddress.complement}`
                            : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedAddress.neighborhood} -{" "}
                          {selectedAddress.city}/{selectedAddress.state}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          CEP: {selectedAddress.zipCode}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4 text-muted-foreground">
                      Você ainda não possui endereços cadastrados
                    </p>
                    <Button
                      onClick={() => navigate("/profile")}
                      variant="secondary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Endereço
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seção de método de pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
                <CardDescription>
                  Escolha como deseja pagar seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem
                      value={PaymentMethod.CREDIT_CARD}
                      id="card"
                    />
                    <Label
                      htmlFor="card"
                      className="flex items-center cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {PaymentMethodText[PaymentMethod.CREDIT_CARD]}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value={PaymentMethod.BOLETO} id="boleto" />
                    <Label
                      htmlFor="boleto"
                      className="flex items-center cursor-pointer"
                    >
                      <Landmark className="h-4 w-4 mr-2" />
                      {PaymentMethodText[PaymentMethod.BOLETO]}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value={PaymentMethod.PIX} id="pix" />
                    <Label
                      htmlFor="pix"
                      className="flex items-center cursor-pointer"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {PaymentMethodText[PaymentMethod.PIX]}
                    </Label>
                  </div>
                </RadioGroup>

                {/* Formulário de cartão de crédito */}
                {paymentMethod === PaymentMethod.CREDIT_CARD && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        placeholder="Nome impresso no cartão"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardCvc">CVV</Label>
                        <Input
                          id="cardCvc"
                          placeholder="123"
                          value={cardCvc}
                          onChange={handleCvcChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="installments">Parcelas</Label>
                      <Select
                        value={String(installments)}
                        onValueChange={(value) =>
                          setInstallments(Number(value))
                        }
                      >
                        <SelectTrigger id="installments">
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            1x de {formatCurrency(total)} (sem juros)
                          </SelectItem>
                          <SelectItem value="2">
                            2x de {formatCurrency(total / 2)} (sem juros)
                          </SelectItem>
                          <SelectItem value="3">
                            3x de {formatCurrency(total / 3)} (sem juros)
                          </SelectItem>
                          {total >= 100 && (
                            <>
                              <SelectItem value="4">
                                4x de {formatCurrency(total / 4)} (sem juros)
                              </SelectItem>
                              <SelectItem value="5">
                                5x de {formatCurrency(total / 5)} (sem juros)
                              </SelectItem>
                              <SelectItem value="6">
                                6x de {formatCurrency(total / 6)} (sem juros)
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Informações de Boleto */}
                {paymentMethod === PaymentMethod.BOLETO && (
                  <div className="mt-6 p-4 bg-muted rounded-md">
                    <p className="text-sm">
                      Ao finalizar a compra, você receberá um boleto bancário
                      que poderá ser pago em qualquer agência bancária, internet
                      banking ou casas lotéricas.
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Importante:</span> O prazo
                      de entrega começa a contar após a confirmação do pagamento
                      do boleto.
                    </p>
                  </div>
                )}

                {/* Informações de PIX */}
                {paymentMethod === PaymentMethod.PIX && (
                  <div className="mt-6 p-4 bg-muted rounded-md">
                    <p className="text-sm">
                      Ao finalizar a compra, você receberá um código PIX para
                      realizar o pagamento imediato.
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Vantagem:</span> O
                      processamento do pedido é imediato após a confirmação do
                      pagamento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do pedido */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px] pr-4">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity}{" "}
                            {item.quantity > 1 ? "itens" : "item"} x{" "}
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p>{formatCurrency(subtotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Frete</p>
                    <p>{formatCurrency(shipping)}</p>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Desconto</p>
                      <p>-{formatCurrency(discount)}</p>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(total)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddressId}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Finalizar Compra"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-4 bg-muted mt-auto">
        <div className="container px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>
            © 2025 Farmácia Virtual Encantada. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
