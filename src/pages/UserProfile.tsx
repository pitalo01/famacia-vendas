/**
 * UserProfile.tsx
 *
 * Página de perfil do usuário que exibe e permite editar informações pessoais.
 * Inclui gerenciamento de endereços e visualização de pedidos.
 * Acessa dados do usuário através do contexto de autenticação.
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, Address } from "@/lib/auth-context";
import { useOrders } from "@/lib/order-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingBag,
  LogOut,
  User,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  CheckCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminShipping from "@/components/admin/AdminShipping";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminUsers from "@/components/admin/AdminUsers";

// Schema para validação do formulário de perfil
const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }).optional(),
  cpf: z.string().min(11, { message: "CPF inválido" }).optional(),
  birthDate: z.string().optional(),
});

// Schema para validação do formulário de endereço
const addressFormSchema = z.object({
  street: z
    .string()
    .min(3, { message: "Rua deve ter pelo menos 3 caracteres" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, { message: "Bairro é obrigatório" }),
  city: z.string().min(2, { message: "Cidade é obrigatória" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  zipCode: z.string().min(8, { message: "CEP inválido" }),
  isDefault: z.boolean().default(false),
});

// Tipos para os formulários
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AddressFormValues = z.infer<typeof addressFormSchema>;

/**
 * Componente da página de perfil do usuário
 *
 * Exibe informações do usuário e opções de gerenciamento da conta.
 * Requer autenticação - redireciona para página de login se não estiver autenticado.
 */
const UserProfile = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  } = useAuth();
  const { userOrders } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para controle das operações
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState("dashboard");

  // Determinar qual aba deve ser aberta inicialmente com base nos parâmetros da URL
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    // Se a URL contém tab=admin e o usuário é admin, abra a aba de administração
    if (tabParam === "admin" && user?.isAdmin) {
      return "admin";
    }
    return "informacoes";
  });

  // Redireciona para página de login se o usuário não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Inicialização do formulário de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cpf: user?.cpf || "",
      birthDate: user?.birthDate || "",
    },
  });

  // Inicialização do formulário de endereço
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isDefault: false,
    },
  });

  // Se não houver usuário autenticado, exibe um estado de carregamento
  if (!user) {
    return <div>Carregando...</div>;
  }

  // Manipulador de logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Manipulador de submissão do formulário de perfil
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await updateProfile(data);
      if (success) {
        setIsEditingProfile(false);
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipulador de submissão do formulário de endereço
  const onAddressSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        // Atualizar endereço existente
        const success = await updateAddress({
          ...data,
          id: editingAddress.id,
        });

        if (success) {
          setEditingAddress(null);
          toast.success("Endereço atualizado com sucesso!");
        }
      } else {
        // Adicionar novo endereço
        const success = await addAddress(data);

        if (success) {
          setIsAddingAddress(false);
          toast.success("Endereço adicionado com sucesso!");
        }
      }

      // Resetar formulário
      addressForm.reset({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        isDefault: false,
      });
    } catch (error) {
      toast.error(
        editingAddress
          ? "Erro ao atualizar endereço"
          : "Erro ao adicionar endereço"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manipulador para excluir um endereço
  const handleRemoveAddress = async (addressId: string) => {
    if (window.confirm("Tem certeza que deseja remover este endereço?")) {
      try {
        const success = await removeAddress(addressId);

        if (success) {
          toast.success("Endereço removido com sucesso!");
        }
      } catch (error) {
        toast.error("Erro ao remover endereço");
        console.error(error);
      }
    }
  };

  // Manipulador para definir um endereço como padrão
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const success = await setDefaultAddress(addressId);

      if (success) {
        toast.success("Endereço padrão definido com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao definir endereço padrão");
      console.error(error);
    }
  };

  // Configurar o formulário para edição de endereço
  const setupAddressEditing = (address: Address) => {
    addressForm.reset({
      street: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setEditingAddress(address);
  };

  // Cancelar edição e resetar formulário
  const cancelAddressEditing = () => {
    addressForm.reset();
    setEditingAddress(null);
    setIsAddingAddress(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container py-8">
        <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="informacoes">Informações Pessoais</TabsTrigger>
            {!isAdmin && (
              <>
                <TabsTrigger value="enderecos">Endereços</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              </>
            )}
            {isAdmin && (
              <TabsTrigger value="admin" className="bg-pharmacy-primary/10">
                Administração
              </TabsTrigger>
            )}
          </TabsList>

          {/* Aba de Informações Pessoais */}
          <TabsContent value="informacoes">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seção de informações pessoais */}
              <div className="md:col-span-2 border rounded-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </h2>
                  {!isEditingProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>

                {isEditingProfile ? (
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="email@exemplo.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditingProfile(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">
                        {user.phone || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-medium">
                        {user.cpf || "Não informado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Data de Nascimento
                      </p>
                      <p className="font-medium">
                        {user.birthDate
                          ? new Date(user.birthDate).toLocaleDateString("pt-BR")
                          : "Não informada"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Endereços Cadastrados
                      </p>
                      <p className="font-medium">
                        {user.addresses && user.addresses.length > 0
                          ? `${user.addresses.length} ${
                              user.addresses.length === 1
                                ? "endereço"
                                : "endereços"
                            }`
                          : "Nenhum endereço cadastrado"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seção de ações da conta */}
              <div className="border rounded-md p-6">
                <h2 className="text-lg font-semibold mb-6">Ações</h2>

                <div className="space-y-4">
                  {!isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start py-3 h-auto font-normal"
                      onClick={() => navigate("/orders")}
                    >
                      <ShoppingBag className="h-4 w-4 mr-3" />
                      Meus Pedidos
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start py-3 h-auto font-normal"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sair da Conta
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Aba de Endereços */}
          {!isAdmin && (
            <TabsContent value="enderecos">
              <div className="border rounded-md">
                <div className="p-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <MapPin className="h-5 w-5" />
                    Meus Endereços
                  </h2>

                  <Dialog
                    open={isAddingAddress}
                    onOpenChange={setIsAddingAddress}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Endereço
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Endereço</DialogTitle>
                        <DialogDescription>
                          Preencha os dados do endereço abaixo.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addressForm}>
                        <form
                          onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                          className="space-y-4"
                        >
                          <FormField
                            control={addressForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rua</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nome da rua" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={addressForm.control}
                              name="number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Número</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addressForm.control}
                              name="complement"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Complemento</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Apto 101" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={addressForm.control}
                            name="neighborhood"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bairro</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nome do bairro"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={addressForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cidade</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nome da cidade"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addressForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estado</FormLabel>
                                  <FormControl>
                                    <Input placeholder="UF" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={addressForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CEP</FormLabel>
                                <FormControl>
                                  <Input placeholder="00000-000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={addressForm.control}
                            name="isDefault"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Definir como endereço padrão
                                  </FormLabel>
                                  <FormDescription>
                                    Este endereço será selecionado
                                    automaticamente no checkout.
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? "Salvando..." : "Salvar"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={!!editingAddress}
                    onOpenChange={(open) => !open && setEditingAddress(null)}
                  >
                    {editingAddress && (
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editar Endereço</DialogTitle>
                          <DialogDescription>
                            Atualize os dados do endereço abaixo.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...addressForm}>
                          <form
                            onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={addressForm.control}
                              name="street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rua</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nome da rua"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={addressForm.control}
                                name="number"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Número</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={addressForm.control}
                                name="complement"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Complemento</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Apto 101"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={addressForm.control}
                              name="neighborhood"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bairro</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nome do bairro"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={addressForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nome da cidade"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={addressForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                      <Input placeholder="UF" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={addressForm.control}
                              name="zipCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CEP</FormLabel>
                                  <FormControl>
                                    <Input placeholder="00000-000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={addressForm.control}
                              name="isDefault"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Definir como endereço padrão
                                    </FormLabel>
                                    <FormDescription>
                                      Este endereço será selecionado
                                      automaticamente no checkout.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={cancelAddressEditing}
                                className="mr-2"
                              >
                                Cancelar
                              </Button>
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : "Salvar"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    )}
                  </Dialog>
                </div>

                <div className="px-6 pb-6">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center mb-1">
                                  <p className="font-medium">
                                    {address.street}, {address.number}
                                    {address.complement
                                      ? ` - ${address.complement}`
                                      : ""}
                                  </p>
                                  {address.isDefault && (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Padrão
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {address.neighborhood} - {address.city}/
                                  {address.state}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  CEP: {address.zipCode}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                {!address.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleSetDefaultAddress(address.id)
                                    }
                                    title="Definir como padrão"
                                  >
                                    <Star className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setupAddressEditing(address)}
                                  title="Editar endereço"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveAddress(address.id)
                                  }
                                  title="Remover endereço"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <h3 className="mt-4 text-lg font-medium">
                        Nenhum endereço cadastrado
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Adicione seu primeiro endereço para facilitar suas
                        compras.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Aba de Pedidos */}
          {!isAdmin && (
            <TabsContent value="pedidos">
              <div className="border rounded-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <ShoppingBag className="h-5 w-5" />
                    Meus Pedidos
                  </h2>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/orders")}
                  >
                    Ver Todos
                  </Button>
                </div>

                {userOrders && userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.slice(0, 3).map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">
                                Pedido #{order.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "pt-BR"
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">
                                  Total
                                </p>
                                <p className="font-medium">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(order.total)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {userOrders.length > 3 && (
                      <div className="text-center pt-2">
                        <Button
                          variant="link"
                          onClick={() => navigate("/orders")}
                        >
                          Ver todos os {userOrders.length} pedidos
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">
                      Nenhum pedido realizado
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Você ainda não realizou nenhum pedido.
                    </p>
                    <Button className="mt-6" onClick={() => navigate("/")}>
                      Explorar Produtos
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          )}

          {/* Nova aba de Administração (visível apenas para administradores) */}
          {isAdmin && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    Painel Administrativo
                  </CardTitle>
                  <CardDescription>
                    Gerencie produtos, categorias, pedidos e configurações da
                    loja
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={adminActiveTab}
                    onValueChange={setAdminActiveTab}
                  >
                    <TabsList className="grid grid-cols-7 mb-6">
                      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                      <TabsTrigger value="products">Produtos</TabsTrigger>
                      <TabsTrigger value="categories">Categorias</TabsTrigger>
                      <TabsTrigger value="orders">Pedidos</TabsTrigger>
                      <TabsTrigger value="users">Usuários</TabsTrigger>
                      <TabsTrigger value="shipping">Fretes</TabsTrigger>
                      <TabsTrigger value="settings">Configurações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                      <AdminDashboard />
                    </TabsContent>

                    <TabsContent value="products">
                      <AdminProducts />
                    </TabsContent>

                    <TabsContent value="categories">
                      <AdminCategories />
                    </TabsContent>

                    <TabsContent value="orders">
                      <AdminOrders />
                    </TabsContent>

                    <TabsContent value="users">
                      <AdminUsers />
                    </TabsContent>

                    <TabsContent value="shipping">
                      <AdminShipping />
                    </TabsContent>

                    <TabsContent value="settings">
                      <AdminSettings />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default UserProfile;
