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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, PlusCircle, Pencil, Trash2, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/use-storage";

// Tipos
interface ShippingZone {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface ShippingMethod {
  id: string;
  zoneId: string;
  name: string;
  type: "fixed" | "weight" | "percentage" | "free";
  cost: number;
  minValue?: number;
  minWeight?: number;
  deliveryTime: string;
  isActive: boolean;
}

/**
 * Componente AdminShipping
 *
 * Permite gerenciar as opções e custos de frete para diferentes regiões.
 */
const AdminShipping: React.FC = () => {
  // Estados para zonas de entrega
  const [zones, setZones] = useLocalStorage<ShippingZone[]>(
    "shipping-zones",
    []
  );
  const [methods, setMethods] = useLocalStorage<ShippingMethod[]>(
    "shipping-methods",
    []
  );
  const [activeTab, setActiveTab] = useState<string>("zones");

  // Estados para modais
  const [isAddZoneOpen, setIsAddZoneOpen] = useState<boolean>(false);
  const [isEditZoneOpen, setIsEditZoneOpen] = useState<boolean>(false);
  const [isDeleteZoneOpen, setIsDeleteZoneOpen] = useState<boolean>(false);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState<boolean>(false);
  const [isEditMethodOpen, setIsEditMethodOpen] = useState<boolean>(false);
  const [isDeleteMethodOpen, setIsDeleteMethodOpen] = useState<boolean>(false);

  // Estado atual
  const [currentZone, setCurrentZone] = useState<ShippingZone | null>(null);
  const [currentMethod, setCurrentMethod] = useState<ShippingMethod | null>(
    null
  );

  // Inicializar dados de exemplo
  useEffect(() => {
    if (zones.length === 0) {
      const defaultZones: ShippingZone[] = [
        {
          id: "zone-1",
          name: "São Paulo - Capital",
          description: "Entregas na região central de São Paulo",
          isActive: true,
        },
        {
          id: "zone-2",
          name: "São Paulo - Interior",
          description: "Entregas no interior do estado de São Paulo",
          isActive: true,
        },
        {
          id: "zone-3",
          name: "Outros Estados",
          description: "Demais estados do Brasil",
          isActive: true,
        },
      ];

      setZones(defaultZones);
    }

    if (methods.length === 0) {
      const defaultMethods: ShippingMethod[] = [
        {
          id: "method-1",
          zoneId: "zone-1",
          name: "Entrega Rápida",
          type: "fixed",
          cost: 15.9,
          deliveryTime: "1-2 dias úteis",
          isActive: true,
        },
        {
          id: "method-2",
          zoneId: "zone-1",
          name: "Entrega Padrão",
          type: "fixed",
          cost: 9.9,
          deliveryTime: "3-5 dias úteis",
          isActive: true,
        },
        {
          id: "method-3",
          zoneId: "zone-2",
          name: "Entrega Padrão",
          type: "fixed",
          cost: 18.5,
          deliveryTime: "4-6 dias úteis",
          isActive: true,
        },
        {
          id: "method-4",
          zoneId: "zone-3",
          name: "Entrega Padrão",
          type: "fixed",
          cost: 25.9,
          deliveryTime: "7-10 dias úteis",
          isActive: true,
        },
        {
          id: "method-5",
          zoneId: "zone-1",
          name: "Frete Grátis",
          type: "free",
          cost: 0,
          minValue: 150,
          deliveryTime: "3-5 dias úteis",
          isActive: true,
        },
      ];

      setMethods(defaultMethods);
    }
  }, [zones.length, methods.length, setZones, setMethods]);

  // Adicionar nova zona
  const handleAddZone = () => {
    if (!currentZone) return;

    const newZone: ShippingZone = {
      ...currentZone,
      id: `zone-${Date.now()}`,
    };

    setZones([...zones, newZone]);
    setIsAddZoneOpen(false);
    toast.success("Zona de entrega adicionada com sucesso!");
  };

  // Atualizar zona existente
  const handleUpdateZone = () => {
    if (!currentZone) return;

    const updatedZones = zones.map((zone) =>
      zone.id === currentZone.id ? currentZone : zone
    );

    setZones(updatedZones);
    setIsEditZoneOpen(false);
    toast.success("Zona de entrega atualizada com sucesso!");
  };

  // Excluir zona
  const handleDeleteZone = () => {
    if (!currentZone) return;

    // Verificar se há métodos de entrega vinculados a esta zona
    const linkedMethods = methods.filter(
      (method) => method.zoneId === currentZone.id
    );

    if (linkedMethods.length > 0) {
      toast.error("Não é possível excluir esta zona", {
        description:
          "Existem métodos de entrega vinculados a esta zona. Remova-os primeiro.",
      });
      setIsDeleteZoneOpen(false);
      return;
    }

    const updatedZones = zones.filter((zone) => zone.id !== currentZone.id);
    setZones(updatedZones);
    setIsDeleteZoneOpen(false);
    toast.success("Zona de entrega excluída com sucesso!");
  };

  // Adicionar novo método de entrega
  const handleAddMethod = () => {
    if (!currentMethod) return;

    const newMethod: ShippingMethod = {
      ...currentMethod,
      id: `method-${Date.now()}`,
    };

    setMethods([...methods, newMethod]);
    setIsAddMethodOpen(false);
    toast.success("Método de entrega adicionado com sucesso!");
  };

  // Atualizar método de entrega
  const handleUpdateMethod = () => {
    if (!currentMethod) return;

    const updatedMethods = methods.map((method) =>
      method.id === currentMethod.id ? currentMethod : method
    );

    setMethods(updatedMethods);
    setIsEditMethodOpen(false);
    toast.success("Método de entrega atualizado com sucesso!");
  };

  // Excluir método de entrega
  const handleDeleteMethod = () => {
    if (!currentMethod) return;

    const updatedMethods = methods.filter(
      (method) => method.id !== currentMethod.id
    );
    setMethods(updatedMethods);
    setIsDeleteMethodOpen(false);
    toast.success("Método de entrega excluído com sucesso!");
  };

  // Formatar valores monetários
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Truck className="mr-2" />
            Configurações de Frete
          </CardTitle>
          <CardDescription>
            Gerencie opções de frete, taxas e regiões de entrega.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="zones">Zonas de Entrega</TabsTrigger>
              <TabsTrigger value="methods">Métodos de Entrega</TabsTrigger>
            </TabsList>

            {/* Zonas de Entrega */}
            <TabsContent value="zones" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Zonas de Entrega</h3>
                <Button
                  onClick={() => {
                    setCurrentZone({
                      id: "",
                      name: "",
                      description: "",
                      isActive: true,
                    });
                    setIsAddZoneOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Zona
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">
                          {zone.name}
                        </TableCell>
                        <TableCell>{zone.description}</TableCell>
                        <TableCell>
                          {zone.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Inativo
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentZone(zone);
                                setIsEditZoneOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentZone(zone);
                                setIsDeleteZoneOpen(true);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {zones.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhuma zona de entrega configurada.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Métodos de Entrega */}
            <TabsContent value="methods" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Métodos de Entrega</h3>
                <Button
                  onClick={() => {
                    if (zones.length === 0) {
                      toast.error("Não é possível adicionar método", {
                        description:
                          "Você precisa criar pelo menos uma zona de entrega primeiro.",
                      });
                      return;
                    }

                    setCurrentMethod({
                      id: "",
                      zoneId: zones[0].id,
                      name: "",
                      type: "fixed",
                      cost: 0,
                      deliveryTime: "",
                      isActive: true,
                    });
                    setIsAddMethodOpen(true);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Método
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>Zona</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Custo</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {methods.map((method) => {
                      const zone = zones.find((z) => z.id === method.zoneId);

                      return (
                        <TableRow key={method.id}>
                          <TableCell className="font-medium">
                            {method.name}
                          </TableCell>
                          <TableCell>
                            {zone?.name || "Zona desconhecida"}
                          </TableCell>
                          <TableCell>
                            {method.type === "fixed" && "Valor fixo"}
                            {method.type === "weight" && "Por peso"}
                            {method.type === "percentage" && "Percentual"}
                            {method.type === "free" && "Grátis"}
                          </TableCell>
                          <TableCell>
                            {method.type === "free" ? (
                              "Grátis"
                            ) : (
                              <>
                                {formatCurrency(method.cost)}
                                {method.minValue &&
                                  ` (mín. ${formatCurrency(method.minValue)})`}
                                {method.minWeight &&
                                  ` (mín. ${method.minWeight}kg)`}
                              </>
                            )}
                          </TableCell>
                          <TableCell>{method.deliveryTime}</TableCell>
                          <TableCell>
                            {method.isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Inativo
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentMethod(method);
                                  setIsEditMethodOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setCurrentMethod(method);
                                  setIsDeleteMethodOpen(true);
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {methods.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">
                            Nenhum método de entrega configurado.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal para adicionar Zona */}
      <Dialog open={isAddZoneOpen} onOpenChange={setIsAddZoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Zona de Entrega</DialogTitle>
            <DialogDescription>
              Adicione uma nova região para configuração de métodos de entrega.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Zona</Label>
              <Input
                id="name"
                placeholder="Ex: São Paulo - Capital"
                value={currentZone?.name || ""}
                onChange={(e) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                placeholder="Ex: Entregas na região metropolitana de São Paulo"
                value={currentZone?.description || ""}
                onChange={(e) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="cursor-pointer">
                Zona Ativa
              </Label>
              <Switch
                id="isActive"
                checked={currentZone?.isActive || false}
                onCheckedChange={(checked) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, isActive: checked } : null
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddZoneOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddZone} disabled={!currentZone?.name}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar Zona */}
      <Dialog open={isEditZoneOpen} onOpenChange={setIsEditZoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Zona de Entrega</DialogTitle>
            <DialogDescription>
              Modifique as informações da zona de entrega.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Zona</Label>
              <Input
                id="edit-name"
                placeholder="Ex: São Paulo - Capital"
                value={currentZone?.name || ""}
                onChange={(e) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Input
                id="edit-description"
                placeholder="Ex: Entregas na região metropolitana de São Paulo"
                value={currentZone?.description || ""}
                onChange={(e) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-isActive" className="cursor-pointer">
                Zona Ativa
              </Label>
              <Switch
                id="edit-isActive"
                checked={currentZone?.isActive || false}
                onCheckedChange={(checked) =>
                  setCurrentZone((prev) =>
                    prev ? { ...prev, isActive: checked } : null
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditZoneOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateZone} disabled={!currentZone?.name}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para excluir Zona */}
      <Dialog open={isDeleteZoneOpen} onOpenChange={setIsDeleteZoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Zona de Entrega</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta zona de entrega? Esta ação não
              pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p>
              Você está prestes a excluir a zona:
              <span className="font-semibold block mt-2">
                {currentZone?.name}
              </span>
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteZoneOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteZone}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar Método */}
      <Dialog open={isAddMethodOpen} onOpenChange={setIsAddMethodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Método de Entrega</DialogTitle>
            <DialogDescription>
              Defina um novo método de entrega para uma zona específica.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="method-name">Nome do Método</Label>
              <Input
                id="method-name"
                placeholder="Ex: Entrega Expressa"
                value={currentMethod?.name || ""}
                onChange={(e) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method-zone">Zona de Entrega</Label>
              <Select
                value={currentMethod?.zoneId}
                onValueChange={(value) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, zoneId: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method-type">Tipo de Frete</Label>
              <Select
                value={currentMethod?.type}
                onValueChange={(
                  value: "fixed" | "weight" | "percentage" | "free"
                ) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, type: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                  <SelectItem value="weight">Por Peso</SelectItem>
                  <SelectItem value="percentage">
                    Percentual do Pedido
                  </SelectItem>
                  <SelectItem value="free">Frete Grátis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentMethod?.type !== "free" && (
              <div className="space-y-2">
                <Label htmlFor="method-cost">Valor do Frete</Label>
                <Input
                  id="method-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentMethod?.cost || 0}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev
                        ? { ...prev, cost: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
            )}

            {currentMethod?.type === "free" && (
              <div className="space-y-2">
                <Label htmlFor="method-minValue">Valor Mínimo do Pedido</Label>
                <Input
                  id="method-minValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentMethod?.minValue || 0}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev
                        ? { ...prev, minValue: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="method-deliveryTime">Prazo de Entrega</Label>
              <Input
                id="method-deliveryTime"
                placeholder="Ex: 2-3 dias úteis"
                value={currentMethod?.deliveryTime || ""}
                onChange={(e) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, deliveryTime: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="method-isActive" className="cursor-pointer">
                Método Ativo
              </Label>
              <Switch
                id="method-isActive"
                checked={currentMethod?.isActive || false}
                onCheckedChange={(checked) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, isActive: checked } : null
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMethodOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddMethod}
              disabled={
                !currentMethod?.name ||
                !currentMethod?.zoneId ||
                !currentMethod?.deliveryTime
              }
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar Método */}
      <Dialog open={isEditMethodOpen} onOpenChange={setIsEditMethodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Método de Entrega</DialogTitle>
            <DialogDescription>
              Modifique as informações do método de entrega.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-method-name">Nome do Método</Label>
              <Input
                id="edit-method-name"
                placeholder="Ex: Entrega Expressa"
                value={currentMethod?.name || ""}
                onChange={(e) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-method-zone">Zona de Entrega</Label>
              <Select
                value={currentMethod?.zoneId}
                onValueChange={(value) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, zoneId: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma zona" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-method-type">Tipo de Frete</Label>
              <Select
                value={currentMethod?.type}
                onValueChange={(
                  value: "fixed" | "weight" | "percentage" | "free"
                ) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, type: value } : null
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                  <SelectItem value="weight">Por Peso</SelectItem>
                  <SelectItem value="percentage">
                    Percentual do Pedido
                  </SelectItem>
                  <SelectItem value="free">Frete Grátis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentMethod?.type !== "free" && (
              <div className="space-y-2">
                <Label htmlFor="edit-method-cost">Valor do Frete</Label>
                <Input
                  id="edit-method-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentMethod?.cost || 0}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev
                        ? { ...prev, cost: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
            )}

            {currentMethod?.type === "free" && (
              <div className="space-y-2">
                <Label htmlFor="edit-method-minValue">
                  Valor Mínimo do Pedido
                </Label>
                <Input
                  id="edit-method-minValue"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentMethod?.minValue || 0}
                  onChange={(e) =>
                    setCurrentMethod((prev) =>
                      prev
                        ? { ...prev, minValue: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-method-deliveryTime">Prazo de Entrega</Label>
              <Input
                id="edit-method-deliveryTime"
                placeholder="Ex: 2-3 dias úteis"
                value={currentMethod?.deliveryTime || ""}
                onChange={(e) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, deliveryTime: e.target.value } : null
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="edit-method-isActive" className="cursor-pointer">
                Método Ativo
              </Label>
              <Switch
                id="edit-method-isActive"
                checked={currentMethod?.isActive || false}
                onCheckedChange={(checked) =>
                  setCurrentMethod((prev) =>
                    prev ? { ...prev, isActive: checked } : null
                  )
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditMethodOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateMethod}
              disabled={
                !currentMethod?.name ||
                !currentMethod?.zoneId ||
                !currentMethod?.deliveryTime
              }
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para excluir Método */}
      <Dialog open={isDeleteMethodOpen} onOpenChange={setIsDeleteMethodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Método de Entrega</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este método de entrega? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p>
              Você está prestes a excluir o método:
              <span className="font-semibold block mt-2">
                {currentMethod?.name}
              </span>
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteMethodOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteMethod}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShipping;
