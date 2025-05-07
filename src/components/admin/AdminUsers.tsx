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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash2,
  MapPin,
  User,
  ShoppingBag,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Address, User as UserType } from "@/lib/auth-context";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/**
 * Componente de Gerenciamento de Usuários
 *
 * Permite aos administradores:
 * - Visualizar todos os usuários cadastrados
 * - Filtrar e buscar usuários
 * - Editar informações de usuários
 * - Excluir usuários
 * - Conceder/revogar privilégios de administrador
 */
const AdminUsers: React.FC = () => {
  // Estados do componente
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<
    "all" | "admin" | "customer"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Buscar usuários ao carregar o componente
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      // Carregar usuários do localStorage
      const storedUsers = localStorage.getItem("auth-users");
      const usersData = storedUsers ? JSON.parse(storedUsers) : [];

      setUsers(usersData);
      setFilteredUsers(usersData);
      setTotalPages(Math.ceil(usersData.length / ITEMS_PER_PAGE));
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar usuários quando os filtros mudarem
  useEffect(() => {
    let result = [...users];

    // Aplicar filtro de texto (busca)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          (user.name?.toLowerCase() || "").includes(query) ||
          (user.email?.toLowerCase() || "").includes(query)
      );
    }

    // Aplicar filtro de tipo de usuário
    if (userTypeFilter === "admin") {
      result = result.filter((user) => user.isAdmin);
    } else if (userTypeFilter === "customer") {
      result = result.filter((user) => !user.isAdmin);
    }

    setFilteredUsers(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Reset to first page on filter change
  }, [users, searchQuery, userTypeFilter]);

  // Obter usuários da página atual
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Abrir o modal de detalhes do usuário
  const viewUserDetails = (user: UserType) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  // Abrir o modal de edição de usuário
  const editUser = (user: UserType) => {
    setEditedUser({ ...user });
    setIsEditDialogOpen(true);
  };

  // Abrir o modal de confirmação de exclusão
  const confirmDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Salvar as alterações do usuário
  const saveUserChanges = () => {
    if (!editedUser) return;

    // Atualizar o usuário na lista de usuários
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );

    setUsers(updatedUsers);

    // Atualizar o localStorage
    localStorage.setItem("auth-users", JSON.stringify(updatedUsers));

    // Fechar o modal de edição
    setIsEditDialogOpen(false);

    toast.success("Usuário atualizado com sucesso!");
  };

  // Excluir um usuário
  const deleteUser = () => {
    if (!selectedUser) return;

    // Verificar se é o único administrador
    if (selectedUser.isAdmin) {
      const adminCount = users.filter((user) => user.isAdmin).length;
      if (adminCount <= 1) {
        toast.error("Erro ao excluir usuário", {
          description:
            "Não é possível excluir o único administrador do sistema.",
        });
        setIsDeleteDialogOpen(false);
        return;
      }
    }

    // Remover o usuário da lista
    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    setUsers(updatedUsers);

    // Atualizar o localStorage
    localStorage.setItem("auth-users", JSON.stringify(updatedUsers));

    // Fechar o modal de confirmação
    setIsDeleteDialogOpen(false);

    toast.success("Usuário excluído com sucesso!");
  };

  // Alternar o status de administrador de um usuário
  const toggleAdminStatus = (userId: string, isAdmin: boolean) => {
    // Se estiver removendo o status de administrador, verificar se é o último
    if (!isAdmin) {
      const adminCount = users.filter((user) => user.isAdmin).length;
      if (
        adminCount <= 1 &&
        users.find((user) => user.id === userId)?.isAdmin
      ) {
        toast.error("Erro ao alterar permissões", {
          description:
            "Não é possível remover o status de administrador do único administrador do sistema.",
        });
        return;
      }
    }

    // Atualizar o usuário na lista
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return { ...user, isAdmin };
      }
      return user;
    });

    setUsers(updatedUsers);

    // Atualizar o localStorage
    localStorage.setItem("auth-users", JSON.stringify(updatedUsers));

    toast.success("Permissões atualizadas com sucesso!");
  };

  // Formatar data
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Não informado";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Formatar o CPF com máscara
  const formatCPF = (cpf?: string): string => {
    if (!cpf) return "Não informado";
    if (cpf.length !== 11) return cpf;

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  // Formatar o telefone com máscara
  const formatPhone = (phone?: string): string => {
    if (!phone) return "Não informado";

    // Remover caracteres não numéricos
    const digits = phone.replace(/\D/g, "");

    if (digits.length === 11) {
      return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return phone;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="mr-2" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Administre contas de usuários da plataforma.
          </CardDescription>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={userTypeFilter}
              onValueChange={(value: "all" | "admin" | "customer") =>
                setUserTypeFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="customer">Clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="h-12 bg-muted/60 animate-pulse rounded"
                  />
                ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead>Endereços</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentPageUsers().map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        {user.cpf && (
                          <div className="text-xs text-muted-foreground">
                            CPF: {formatCPF(user.cpf)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatPhone(user.phone)}</TableCell>
                      <TableCell>
                        {user.birthDate ? formatDate(user.birthDate) : "-"}
                      </TableCell>
                      <TableCell>
                        {user.addresses && user.addresses.length > 0
                          ? `${user.addresses.length} endereço(s)`
                          : "Nenhum"}
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 font-normal"
                          >
                            Administrador
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-800 font-normal"
                          >
                            Cliente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => viewUserDetails(user)}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.isAdmin ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleAdminStatus(user.id, false)
                                }
                                className="text-amber-600"
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Remover admin
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => toggleAdminStatus(user.id, true)}
                                className="text-green-600"
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                Tornar admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDeleteUser(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery || userTypeFilter !== "all"
                  ? "Tente ajustar seus filtros de busca."
                  : "Não há usuários registrados no sistema."}
              </p>
            </div>
          )}
        </CardContent>

        {filteredUsers.length > 0 && (
          <CardFooter className="flex justify-between items-center border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Exibindo {Math.min(filteredUsers.length, ITEMS_PER_PAGE)} de{" "}
              {filteredUsers.length} usuários
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Modal de Detalhes do Usuário */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes do Usuário</DialogTitle>
                <DialogDescription>
                  Informações detalhadas sobre {selectedUser.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="profile">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="profile">Perfil</TabsTrigger>
                  <TabsTrigger value="addresses">Endereços</TabsTrigger>
                  <TabsTrigger value="orders">Pedidos</TabsTrigger>
                </TabsList>

                {/* Tab de Perfil */}
                <TabsContent value="profile" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Nome:
                        </div>
                        <div>{selectedUser.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Email:
                        </div>
                        <div>{selectedUser.email}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Telefone:
                        </div>
                        <div>{formatPhone(selectedUser.phone)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          CPF:
                        </div>
                        <div>{formatCPF(selectedUser.cpf)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Data de Nascimento:
                        </div>
                        <div>
                          {selectedUser.birthDate
                            ? formatDate(selectedUser.birthDate)
                            : "Não informado"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          ID:
                        </div>
                        <div className="text-xs">{selectedUser.id}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Tipo de Conta:
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedUser.isAdmin ? (
                            <>
                              <ShieldAlert className="h-4 w-4 text-amber-600" />
                              <span>Administrador</span>
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 text-slate-600" />
                              <span>Cliente</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab de Endereços */}
                <TabsContent value="addresses" className="space-y-4 pt-4">
                  {selectedUser.addresses &&
                  selectedUser.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">
                              {address.street}, {address.number}
                            </div>
                            {address.isDefault && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                Principal
                              </Badge>
                            )}
                          </div>
                          {address.complement && (
                            <div className="text-sm">{address.complement}</div>
                          )}
                          <div className="text-sm">{address.neighborhood}</div>
                          <div className="text-sm">
                            {address.city} - {address.state}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            CEP: {address.zipCode}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p>Este usuário não possui endereços cadastrados.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Tab de Pedidos */}
                <TabsContent value="orders" className="space-y-4 pt-4">
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p>
                      As informações de pedidos estarão disponíveis em breve.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  onClick={() => {
                    setIsUserDetailsOpen(false);
                    editUser(selectedUser);
                  }}
                >
                  Editar Usuário
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição de Usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {editedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Altere as informações do usuário conforme necessário
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={editedUser.name}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={editedUser.phone || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone: e.target.value })
                      }
                      placeholder="(99) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={editedUser.cpf || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, cpf: e.target.value })
                      }
                      placeholder="999.999.999-99"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={editedUser.birthDate || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          birthDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <Checkbox
                      id="isAdmin"
                      checked={editedUser.isAdmin || false}
                      onCheckedChange={(checked) => {
                        // Verificar se é o único administrador
                        if (!checked && editedUser.isAdmin) {
                          const adminCount = users.filter(
                            (user) => user.isAdmin
                          ).length;
                          if (adminCount <= 1) {
                            toast.error("Erro", {
                              description:
                                "Não é possível remover o status de administrador do único administrador do sistema.",
                            });
                            return;
                          }
                        }
                        setEditedUser({
                          ...editedUser,
                          isAdmin: checked as boolean,
                        });
                      }}
                    />
                    <Label htmlFor="isAdmin" className="cursor-pointer">
                      Administrador do Sistema
                    </Label>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      ID do usuário:{" "}
                      <span className="text-xs font-mono">{editedUser.id}</span>
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={saveUserChanges}>Salvar Alterações</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário {selectedUser?.name}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Excluir Usuário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
