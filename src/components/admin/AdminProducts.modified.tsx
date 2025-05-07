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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Importando os tipos e funções de produtos que já existem
import { Product, ProductDetails } from "@/lib/products";

interface ProductFormData {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  description?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  brand?: string;
  category?: string;
  subcategory?: string;
  features: string[];
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(
    null
  );
  const [newFeature, setNewFeature] = useState<string>("");

  // Buscar produtos ao carregar o componente
  useEffect(() => {
    // Em um ambiente real, buscaríamos os produtos da API
    // Como estamos usando localStorage, vamos verificar se já temos produtos lá
    const storedProducts = localStorage.getItem("admin-products");

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Inicialização com array vazio - sem produtos fictícios
      setProducts([]);
      localStorage.setItem("admin-products", JSON.stringify([]));
    }

    setLoading(false);
  }, []);

  // Salvar produtos no localStorage quando houver mudanças
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("admin-products", JSON.stringify(products));
    }
  }, [products, loading]);

  // Filtrar produtos com base na pesquisa
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inicializar produto em branco para adicionar novo
  const initializeNewProduct = () => {
    setCurrentProduct({
      id: `prod-${Date.now()}`,
      name: "",
      price: 0,
      image: "",
      requiresPrescription: false,
      inStock: true,
      features: [],
      category: "medicamentos", // Definir categoria padrão
    });
    setIsAddDialogOpen(true);
  };

  // Preparar produto para edição
  const editProduct = (product: ProductDetails) => {
    setCurrentProduct({
      ...product,
      features: product.features || [],
    });
    setIsEditDialogOpen(true);
  };

  // Preparar produto para exclusão
  const deleteProduct = (product: ProductDetails) => {
    setCurrentProduct({
      ...product,
      features: product.features || [],
    });
    setIsDeleteDialogOpen(true);
  };

  // Manipular alterações nos campos do formulário
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (currentProduct) {
      if (name === "price" || name === "oldPrice") {
        setCurrentProduct({
          ...currentProduct,
          [name]: parseFloat(value) || 0,
        });
      } else {
        setCurrentProduct({
          ...currentProduct,
          [name]: value,
        });
      }
    }
  };

  // Manipular alterações em checkboxes e switches
  const handleToggleChange = (name: string, checked: boolean) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [name]: checked,
      });
    }
  };

  // Adicionar uma nova característica
  const addFeature = () => {
    if (newFeature.trim() && currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        features: [...currentProduct.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  // Remover uma característica
  const removeFeature = (index: number) => {
    if (currentProduct) {
      const updatedFeatures = [...currentProduct.features];
      updatedFeatures.splice(index, 1);
      setCurrentProduct({
        ...currentProduct,
        features: updatedFeatures,
      });
    }
  };

  // Salvar novo produto
  const saveNewProduct = () => {
    if (currentProduct) {
      if (
        !currentProduct.name ||
        !currentProduct.price ||
        !currentProduct.image
      ) {
        toast.error("Erro ao salvar produto", {
          description: "Nome, preço e imagem são campos obrigatórios.",
        });
        return;
      }

      // Garantir que o produto tenha uma categoria, usar "medicamentos" como padrão
      const productToSave = {
        ...currentProduct,
        category: currentProduct.category || "medicamentos",
      };

      setProducts([...products, productToSave as ProductDetails]);
      toast.success("Produto adicionado com sucesso!", {
        description: "O produto agora aparecerá no site da loja.",
      });

      // Força recarregar a página para atualizar os produtos visíveis no site
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setIsAddDialogOpen(false);
    }
  };

  // Atualizar produto existente
  const updateProduct = () => {
    if (currentProduct) {
      if (
        !currentProduct.name ||
        !currentProduct.price ||
        !currentProduct.image
      ) {
        toast.error("Erro ao atualizar produto", {
          description: "Nome, preço e imagem são campos obrigatórios.",
        });
        return;
      }

      // Garantir que o produto tenha uma categoria, usar "medicamentos" como padrão
      const productToUpdate = {
        ...currentProduct,
        category: currentProduct.category || "medicamentos",
      };

      const updatedProducts = products.map((p) =>
        p.id === productToUpdate.id ? (productToUpdate as ProductDetails) : p
      );
      setProducts(updatedProducts);
      toast.success("Produto atualizado com sucesso!", {
        description: "As alterações do produto aparecerão no site da loja.",
      });

      // Força recarregar a página para atualizar os produtos visíveis no site
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setIsEditDialogOpen(false);
    }
  };

  // Excluir produto
  const confirmDeleteProduct = () => {
    if (currentProduct) {
      const updatedProducts = products.filter(
        (p) => p.id !== currentProduct.id
      );
      setProducts(updatedProducts);
      toast.success("Produto excluído com sucesso!", {
        description: "O produto foi removido do site da loja.",
      });

      // Força recarregar a página para atualizar os produtos visíveis no site
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setIsDeleteDialogOpen(false);
    }
  };

  // Renderizar formulário de produto (usado tanto para adicionar quanto para editar)
  const renderProductForm = () => {
    if (!currentProduct) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Produto*</Label>
            <Input
              id="name"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              placeholder="Ex: Dipirona Sódica 1g"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (R$)*</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={currentProduct.price}
                onChange={handleInputChange}
                min={0}
                step={0.01}
              />
            </div>
            <div>
              <Label htmlFor="oldPrice">Preço Original (R$)</Label>
              <Input
                id="oldPrice"
                name="oldPrice"
                type="number"
                value={currentProduct.oldPrice || ""}
                onChange={handleInputChange}
                min={0}
                step={0.01}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">URL da Imagem*</Label>
            <Input
              id="image"
              name="image"
              value={currentProduct.image}
              onChange={handleInputChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              name="brand"
              value={currentProduct.brand || ""}
              onChange={handleInputChange}
              placeholder="Ex: Medley"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria*</Label>
              <Select
                value={currentProduct.category || "medicamentos"}
                onValueChange={(value) =>
                  handleInputChange({
                    target: { name: "category", value },
                  } as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="saude">Saúde</SelectItem>
                  <SelectItem value="higiene">Higiene</SelectItem>
                  <SelectItem value="bebe">Bebê</SelectItem>
                  <SelectItem value="beleza">Beleza</SelectItem>
                  <SelectItem value="bem-estar">Bem-estar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategoria</Label>
              <Input
                id="subcategory"
                name="subcategory"
                value={currentProduct.subcategory || ""}
                onChange={handleInputChange}
                placeholder="Ex: analgesicos"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={currentProduct.description || ""}
              onChange={handleInputChange}
              placeholder="Descreva o produto..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Características</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Adicionar característica..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                disabled={!newFeature.trim()}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2">
              <ul className="space-y-1">
                {currentProduct.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-muted p-2 rounded text-sm"
                  >
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeFeature(index)}
                      className="h-6 w-6 p-0"
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="requiresPrescription" className="cursor-pointer">
                Requer Receita Médica
              </Label>
              <Switch
                id="requiresPrescription"
                checked={currentProduct.requiresPrescription}
                onCheckedChange={(checked) =>
                  handleToggleChange("requiresPrescription", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="inStock" className="cursor-pointer">
                Em Estoque
              </Label>
              <Switch
                id="inStock"
                checked={currentProduct.inStock}
                onCheckedChange={(checked) =>
                  handleToggleChange("inStock", checked)
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Package className="mr-2" />
                Produtos
              </CardTitle>
              <CardDescription>
                Gerencie o catálogo de produtos da farmácia.
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button onClick={initializeNewProduct}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin">⏳</div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              R$ {product.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{product.category || "-"}</TableCell>
                      <TableCell>
                        {product.inStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="mr-1 h-3 w-3" />
                            Em estoque
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="mr-1 h-3 w-3" />
                            Indisponível
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.requiresPrescription ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Sim
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Não</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editProduct(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProduct(product)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Tente ajustar sua pesquisa."
                  : "Comece adicionando produtos ao catálogo."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para adicionar produto */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha as informações do produto. Campos marcados com * são
              obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {renderProductForm()}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveNewProduct}>Adicionar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar produto */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize as informações do produto. Campos marcados com * são
              obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {renderProductForm()}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={updateProduct}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmar exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{currentProduct?.name}"?
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
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Excluir Produto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
