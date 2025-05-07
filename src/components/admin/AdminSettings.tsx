import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  MailIcon,
  Phone,
  MapPin,
  Globe,
  Image,
  AlertCircle,
  Tag,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-storage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Interface para configurações da loja
 */
interface StoreSettings {
  // Informações da Loja
  name: string;
  slogan: string;
  description: string;
  logo: string;
  primaryColor: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;

  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  whatsappNumber?: string;

  // Configurações de Checkout
  enabledPaymentMethods: {
    creditCard: boolean;
    pix: boolean;
    boleto: boolean;
  };
  minimumOrderValue: number;

  // Configurações de Pedidos
  defaultOrderStatus: string;
  allowGuestCheckout: boolean;

  // Configurações de Exibição
  productsPerPage: number;
  showOutOfStockProducts: boolean;

  // Políticas
  termsAndConditions: string;
  privacyPolicy: string;
  returnPolicy: string;
}

/**
 * Configurações padrão da loja
 */
const defaultSettings: StoreSettings = {
  name: "Drogaria São Rafael",
  slogan: "Sua saúde em boas mãos",
  description:
    "A melhor drogaria online com os melhores preços e produtos de qualidade.",
  logo: "/images/logo.png",
  primaryColor: "#1C4B29",
  phoneNumber: "(11) 3456-7890",
  email: "contato@drogariasaorafael.com",
  address: {
    street: "Avenida Paulista",
    number: "1000",
    complement: "Sala 123",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
  },

  metaTitle: "Drogaria São Rafael | Medicamentos e Produtos de Saúde",
  metaDescription:
    "Drogaria online com os melhores preços. Medicamentos, produtos de higiene, beleza e muito mais com entrega rápida e segura.",
  metaKeywords:
    "drogaria, medicamentos, saúde, beleza, higiene, entrega rápida",

  facebookUrl: "https://facebook.com/drogariasaorafael",
  instagramUrl: "https://instagram.com/drogariasaorafael",
  twitterUrl: "",
  whatsappNumber: "5511987654321",

  enabledPaymentMethods: {
    creditCard: true,
    pix: true,
    boleto: true,
  },
  minimumOrderValue: 30,

  defaultOrderStatus: "pending",
  allowGuestCheckout: false,

  productsPerPage: 12,
  showOutOfStockProducts: true,

  termsAndConditions:
    "# Termos e Condições\n\nEstes são os termos e condições da Farmácia Virtual...",
  privacyPolicy:
    "# Política de Privacidade\n\nA Farmácia Virtual está comprometida com a segurança dos seus dados...",
  returnPolicy:
    "# Política de Devolução\n\nA Farmácia Virtual oferece 30 dias para devolução de produtos...",
};

/**
 * Componente AdminSettings
 *
 * Permite gerenciar todas as configurações do sistema da farmácia.
 */
const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<StoreSettings>(
    "store-settings",
    defaultSettings
  );
  const [isSaving, setIsSaving] = useState(false);

  // Estado para edição de configurações
  const [editedSettings, setEditedSettings] = useState<StoreSettings>(settings);

  // Atualizar configurações editadas quando as configurações salvas mudarem
  useEffect(() => {
    setEditedSettings(settings);
  }, [settings]);

  // Manipular mudanças nos campos básicos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setEditedSettings({
        ...editedSettings,
        [group]: {
          ...editedSettings[group as keyof StoreSettings],
          [field]: value,
        },
      });
    } else {
      setEditedSettings({
        ...editedSettings,
        [name]: value,
      });
    }
  };

  // Manipular mudanças nos campos de tipo switch (boolean)
  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name.includes(".")) {
      const [group, field] = name.split(".");
      setEditedSettings({
        ...editedSettings,
        [group]: {
          ...editedSettings[group as keyof StoreSettings],
          [field]: checked,
        },
      });
    } else {
      setEditedSettings({
        ...editedSettings,
        [name]: checked,
      });
    }
  };

  // Salvar configurações
  const saveSettings = () => {
    setIsSaving(true);

    // Simular atraso de rede
    setTimeout(() => {
      setSettings(editedSettings);
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso!");
    }, 1000);
  };

  // Cancelar edições
  const cancelChanges = () => {
    setEditedSettings(settings);
    toast.info("Alterações descartadas");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Settings className="mr-2" />
            Configurações do Sistema
          </CardTitle>
          <CardDescription>
            Gerencie as configurações gerais do sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="store">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="store">
                <Store className="w-4 h-4 mr-2" />
                Informações da Loja
              </TabsTrigger>
              <TabsTrigger value="seo">
                <Globe className="w-4 h-4 mr-2" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="checkout">
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout
              </TabsTrigger>
              <TabsTrigger value="policies">
                <AlertCircle className="w-4 h-4 mr-2" />
                Políticas
              </TabsTrigger>
            </TabsList>

            {/* Tab: Informações da Loja */}
            <TabsContent value="store">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações Básicas</h3>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Loja</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editedSettings.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slogan">Slogan</Label>
                      <Input
                        id="slogan"
                        name="slogan"
                        value={editedSettings.slogan}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={editedSettings.description}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">URL do Logo</Label>
                      <Input
                        id="logo"
                        name="logo"
                        value={editedSettings.logo}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Cor Principal</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          name="primaryColor"
                          value={editedSettings.primaryColor}
                          onChange={handleChange}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{
                            backgroundColor: editedSettings.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações de Contato */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Informações de Contato
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Telefone</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedSettings.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editedSettings.email}
                        onChange={handleChange}
                      />
                    </div>

                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="address">
                        <AccordionTrigger className="text-sm font-medium">
                          Endereço Físico
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label
                                htmlFor="address.street"
                                className="text-xs"
                              >
                                Rua
                              </Label>
                              <Input
                                id="address.street"
                                name="address.street"
                                value={editedSettings.address.street}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label
                                htmlFor="address.number"
                                className="text-xs"
                              >
                                Número
                              </Label>
                              <Input
                                id="address.number"
                                name="address.number"
                                value={editedSettings.address.number}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="address.complement"
                              className="text-xs"
                            >
                              Complemento
                            </Label>
                            <Input
                              id="address.complement"
                              name="address.complement"
                              value={editedSettings.address.complement}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="address.neighborhood"
                              className="text-xs"
                            >
                              Bairro
                            </Label>
                            <Input
                              id="address.neighborhood"
                              name="address.neighborhood"
                              value={editedSettings.address.neighborhood}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label htmlFor="address.city" className="text-xs">
                                Cidade
                              </Label>
                              <Input
                                id="address.city"
                                name="address.city"
                                value={editedSettings.address.city}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label
                                htmlFor="address.state"
                                className="text-xs"
                              >
                                Estado
                              </Label>
                              <Input
                                id="address.state"
                                name="address.state"
                                value={editedSettings.address.state}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor="address.zipCode"
                              className="text-xs"
                            >
                              CEP
                            </Label>
                            <Input
                              id="address.zipCode"
                              name="address.zipCode"
                              value={editedSettings.address.zipCode}
                              onChange={handleChange}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="social">
                        <AccordionTrigger className="text-sm font-medium">
                          Redes Sociais
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-2">
                          <div className="space-y-1">
                            <Label htmlFor="facebookUrl" className="text-xs">
                              Facebook URL
                            </Label>
                            <Input
                              id="facebookUrl"
                              name="facebookUrl"
                              value={editedSettings.facebookUrl}
                              onChange={handleChange}
                              placeholder="https://facebook.com/..."
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="instagramUrl" className="text-xs">
                              Instagram URL
                            </Label>
                            <Input
                              id="instagramUrl"
                              name="instagramUrl"
                              value={editedSettings.instagramUrl}
                              onChange={handleChange}
                              placeholder="https://instagram.com/..."
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="twitterUrl" className="text-xs">
                              Twitter URL
                            </Label>
                            <Input
                              id="twitterUrl"
                              name="twitterUrl"
                              value={editedSettings.twitterUrl}
                              onChange={handleChange}
                              placeholder="https://twitter.com/..."
                            />
                          </div>

                          <div className="space-y-1">
                            <Label htmlFor="whatsappNumber" className="text-xs">
                              WhatsApp
                            </Label>
                            <Input
                              id="whatsappNumber"
                              name="whatsappNumber"
                              value={editedSettings.whatsappNumber}
                              onChange={handleChange}
                              placeholder="5511999999999"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Inclua o código do país (ex: 55 para Brasil)
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: SEO */}
            <TabsContent value="seo">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configurações de SEO</h3>

                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      value={editedSettings.metaTitle}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      O título que aparece na aba do navegador e nos resultados
                      de busca.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={editedSettings.metaDescription}
                      onChange={handleChange}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Breve descrição que aparece nos resultados de busca.
                      Recomendado 150-160 caracteres.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Palavras-chave</Label>
                    <Textarea
                      id="metaKeywords"
                      name="metaKeywords"
                      value={editedSettings.metaKeywords}
                      onChange={handleChange}
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separadas por vírgula. Ex: farmácia, medicamentos, saúde.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Checkout */}
            <TabsContent value="checkout">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Opções de Pagamento */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Opções de Pagamento</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="enabledPaymentMethods.creditCard"
                          className="cursor-pointer"
                        >
                          Cartão de Crédito
                        </Label>
                        <Switch
                          id="enabledPaymentMethods.creditCard"
                          checked={
                            editedSettings.enabledPaymentMethods.creditCard
                          }
                          onCheckedChange={(checked) =>
                            handleSwitchChange(
                              "enabledPaymentMethods.creditCard",
                              checked
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="enabledPaymentMethods.pix"
                          className="cursor-pointer"
                        >
                          PIX
                        </Label>
                        <Switch
                          id="enabledPaymentMethods.pix"
                          checked={editedSettings.enabledPaymentMethods.pix}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(
                              "enabledPaymentMethods.pix",
                              checked
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="enabledPaymentMethods.boleto"
                          className="cursor-pointer"
                        >
                          Boleto Bancário
                        </Label>
                        <Switch
                          id="enabledPaymentMethods.boleto"
                          checked={editedSettings.enabledPaymentMethods.boleto}
                          onCheckedChange={(checked) =>
                            handleSwitchChange(
                              "enabledPaymentMethods.boleto",
                              checked
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <Label htmlFor="minimumOrderValue">
                        Valor Mínimo de Pedido (R$)
                      </Label>
                      <Input
                        id="minimumOrderValue"
                        name="minimumOrderValue"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editedSettings.minimumOrderValue}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            minimumOrderValue: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Configurações de Pedidos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Configurações de Pedidos
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="defaultOrderStatus">
                        Status Padrão de Pedidos
                      </Label>
                      <Select
                        value={editedSettings.defaultOrderStatus}
                        onValueChange={(value) =>
                          setEditedSettings({
                            ...editedSettings,
                            defaultOrderStatus: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status padrão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            Aguardando Pagamento
                          </SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="processing">
                            Em Processamento
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Label
                        htmlFor="allowGuestCheckout"
                        className="cursor-pointer"
                      >
                        Permitir Checkout como Visitante
                      </Label>
                      <Switch
                        id="allowGuestCheckout"
                        checked={editedSettings.allowGuestCheckout}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("allowGuestCheckout", checked)
                        }
                      />
                    </div>

                    <div className="space-y-2 mt-6">
                      <Label htmlFor="productsPerPage">
                        Produtos por Página
                      </Label>
                      <Select
                        value={editedSettings.productsPerPage.toString()}
                        onValueChange={(value) =>
                          setEditedSettings({
                            ...editedSettings,
                            productsPerPage: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a quantidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                          <SelectItem value="16">16</SelectItem>
                          <SelectItem value="24">24</SelectItem>
                          <SelectItem value="36">36</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Label
                        htmlFor="showOutOfStockProducts"
                        className="cursor-pointer"
                      >
                        Exibir Produtos Fora de Estoque
                      </Label>
                      <Switch
                        id="showOutOfStockProducts"
                        checked={editedSettings.showOutOfStockProducts}
                        onCheckedChange={(checked) =>
                          handleSwitchChange("showOutOfStockProducts", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Políticas */}
            <TabsContent value="policies">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Políticas e Termos</h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="termsAndConditions">
                      Termos e Condições
                    </Label>
                    <Textarea
                      id="termsAndConditions"
                      name="termsAndConditions"
                      value={editedSettings.termsAndConditions}
                      onChange={handleChange}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Suporta formatação em Markdown.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicy">
                      Política de Privacidade
                    </Label>
                    <Textarea
                      id="privacyPolicy"
                      name="privacyPolicy"
                      value={editedSettings.privacyPolicy}
                      onChange={handleChange}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Suporta formatação em Markdown.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="returnPolicy">Política de Devolução</Label>
                    <Textarea
                      id="returnPolicy"
                      name="returnPolicy"
                      value={editedSettings.returnPolicy}
                      onChange={handleChange}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Suporta formatação em Markdown.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={cancelChanges}>
            Cancelar
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSettings;
