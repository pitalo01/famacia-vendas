import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Tag,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  ChevronsUpDown,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState<boolean>(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] =
    useState<boolean>(false);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentSubcategory, setCurrentSubcategory] =
    useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  // Buscar categorias ao carregar o componente
  useEffect(() => {
    // Em um ambiente real, buscaríamos as categorias da API
    const storedCategories = localStorage.getItem("admin-categories");

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Inicializar com dados de demonstração
      const demoCategories: Category[] = [
        {
          id: "cat-medicamentos",
          name: "Medicamentos",
          slug: "medicamentos",
          description: "Medicamentos e fármacos para sua saúde",
          icon: "Pill",
          subcategories: [
            {
              id: "subcat-dor-febre",
              name: "Dor e Febre",
              slug: "dor-febre",
              parentId: "cat-medicamentos",
            },
            {
              id: "subcat-gripe-resfriado",
              name: "Gripe e Resfriado",
              slug: "gripe-resfriado",
              parentId: "cat-medicamentos",
            },
            {
              id: "subcat-antibioticos",
              name: "Antibióticos",
              slug: "antibioticos",
              parentId: "cat-medicamentos",
            },
          ],
        },
        {
          id: "cat-higiene",
          name: "Higiene",
          slug: "higiene",
          description: "Produtos para higiene pessoal e bem-estar",
          icon: "ShowerHead",
          subcategories: [
            {
              id: "subcat-bucal",
              name: "Higiene Bucal",
              slug: "bucal",
              parentId: "cat-higiene",
            },
            {
              id: "subcat-corporal",
              name: "Higiene Corporal",
              slug: "corporal",
              parentId: "cat-higiene",
            },
            {
              id: "subcat-intima",
              name: "Higiene Íntima",
              slug: "intima",
              parentId: "cat-higiene",
            },
          ],
        },
      ];

      setCategories(demoCategories);
      localStorage.setItem("admin-categories", JSON.stringify(demoCategories));
    }

    setLoading(false);
  }, []);

  // Salvar categorias no localStorage quando houver mudanças
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("admin-categories", JSON.stringify(categories));
    }
  }, [categories, loading]);

  // Filtrar categorias com base na pesquisa
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Inicializar nova categoria
  const initializeNewCategory = () => {
    setCurrentCategory({
      id: `cat-${Date.now()}`,
      name: "",
      slug: "",
      description: "",
      icon: "",
      subcategories: [],
    });
    setIsAddCategoryOpen(true);
  };

  // Preparar categoria para edição
  const editCategory = (category: Category) => {
    setCurrentCategory({ ...category });
    setIsEditCategoryOpen(true);
  };

  // Preparar categoria para exclusão
  const deleteCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteCategoryOpen(true);
  };

  // Preparar subcategoria para adição
  const addSubcategory = (category: Category) => {
    setCurrentCategory(category);
    setCurrentSubcategory({
      id: `subcat-${Date.now()}`,
      name: "",
      slug: "",
      parentId: category.id,
    });
    setIsAddSubcategoryOpen(true);
  };

  // Manipular alterações nos campos do formulário da categoria
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (currentCategory) {
      if (name === "name" && !currentCategory.slug) {
        // Auto-gerar slug a partir do nome
        setCurrentCategory({
          ...currentCategory,
          [name]: value,
          slug: value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        });
      } else {
        setCurrentCategory({
          ...currentCategory,
          [name]: value,
        });
      }
    }
  };

  // Manipular alterações nos campos do formulário da subcategoria
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (currentSubcategory) {
      if (name === "name" && !currentSubcategory.slug) {
        // Auto-gerar slug a partir do nome
        setCurrentSubcategory({
          ...currentSubcategory,
          [name]: value,
          slug: value
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        });
      } else {
        setCurrentSubcategory({
          ...currentSubcategory,
          [name]: value,
        });
      }
    }
  };

  // Salvar nova categoria
  const saveNewCategory = () => {
    if (currentCategory) {
      if (!currentCategory.name || !currentCategory.slug) {
        toast.error("Erro ao salvar categoria", {
          description: "Nome e Slug são campos obrigatórios.",
        });
        return;
      }

      setCategories([...categories, currentCategory]);
      toast.success("Categoria adicionada com sucesso!");
      setIsAddCategoryOpen(false);
    }
  };

  // Atualizar categoria existente
  const updateCategory = () => {
    if (currentCategory) {
      if (!currentCategory.name || !currentCategory.slug) {
        toast.error("Erro ao atualizar categoria", {
          description: "Nome e Slug são campos obrigatórios.",
        });
        return;
      }

      const updatedCategories = categories.map((c) =>
        c.id === currentCategory.id ? currentCategory : c
      );
      setCategories(updatedCategories);
      toast.success("Categoria atualizada com sucesso!");
      setIsEditCategoryOpen(false);
    }
  };

  // Salvar nova subcategoria
  const saveNewSubcategory = () => {
    if (currentCategory && currentSubcategory) {
      if (!currentSubcategory.name || !currentSubcategory.slug) {
        toast.error("Erro ao adicionar subcategoria", {
          description: "Nome e Slug são campos obrigatórios.",
        });
        return;
      }

      const updatedCategories = categories.map((c) => {
        if (c.id === currentCategory.id) {
          return {
            ...c,
            subcategories: [...c.subcategories, currentSubcategory],
          };
        }
        return c;
      });

      setCategories(updatedCategories);
      toast.success("Subcategoria adicionada com sucesso!");
      setIsAddSubcategoryOpen(false);
    }
  };

  // Excluir categoria
  const confirmDeleteCategory = () => {
    if (currentCategory) {
      const updatedCategories = categories.filter(
        (c) => c.id !== currentCategory.id
      );
      setCategories(updatedCategories);
      toast.success("Categoria excluída com sucesso!");
      setIsDeleteCategoryOpen(false);
    }
  };

  // Alternar a expansão de uma categoria
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Excluir subcategoria
  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          subcategories: category.subcategories.filter(
            (subcategory) => subcategory.id !== subcategoryId
          ),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    toast.success("Subcategoria excluída com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Tag className="mr-2" />
                Categorias
              </CardTitle>
              <CardDescription>
                Gerencie as categorias e subcategorias de produtos.
              </CardDescription>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categorias..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button onClick={initializeNewCategory}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Categoria
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin">⏳</div>
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Nome</TableHead>
                    <TableHead className="w-[20%]">Slug</TableHead>
                    <TableHead className="w-[25%]">Subcategorias</TableHead>
                    <TableHead className="text-right w-[15%]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <React.Fragment key={category.id}>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </div>
                        </TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="text-sm mr-2">
                              {category.subcategories.length} subcategorias
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleCategoryExpansion(category.id)
                              }
                              className="p-0 h-6 w-6"
                            >
                              <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addSubcategory(category)}
                              className="p-0 h-6 w-6 ml-1"
                            >
                              <FolderPlus className="h-4 w-4 text-pharmacy-primary" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Subcategorias */}
                      {expandedCategories[category.id] &&
                        category.subcategories.length > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="bg-muted/30 p-0">
                              <div className="p-2">
                                <div className="text-sm font-medium mb-2">
                                  Subcategorias de {category.name}
                                </div>
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-xs text-left py-2 px-3 font-medium text-muted-foreground w-[40%]">
                                        Nome
                                      </th>
                                      <th className="text-xs text-left py-2 px-3 font-medium text-muted-foreground w-[40%]">
                                        Slug
                                      </th>
                                      <th className="text-xs text-right py-2 px-3 font-medium text-muted-foreground w-[20%]">
                                        Ações
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {category.subcategories.map(
                                      (subcategory) => (
                                        <tr
                                          key={subcategory.id}
                                          className="border-b last:border-0"
                                        >
                                          <td className="py-2 px-3 text-sm">
                                            {subcategory.name}
                                          </td>
                                          <td className="py-2 px-3 text-sm">
                                            {subcategory.slug}
                                          </td>
                                          <td className="py-2 px-3 text-right">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                deleteSubcategory(
                                                  category.id,
                                                  subcategory.id
                                                )
                                              }
                                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Tag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Tente ajustar sua pesquisa."
                  : "Comece adicionando categorias ao sistema."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para adicionar categoria */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha as informações da categoria. Nome e Slug são
              obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name" className="text-right">
                Nome*
              </Label>
              <Input
                id="name"
                name="name"
                value={currentCategory?.name || ""}
                onChange={handleCategoryChange}
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-right">
                Slug*
              </Label>
              <Input
                id="slug"
                name="slug"
                value={currentCategory?.slug || ""}
                onChange={handleCategoryChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Identificador único usado na URL (exemplo: "medicamentos")
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                value={currentCategory?.description || ""}
                onChange={handleCategoryChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="icon" className="text-right">
                Ícone
              </Label>
              <Input
                id="icon"
                name="icon"
                value={currentCategory?.icon || ""}
                onChange={handleCategoryChange}
                placeholder="Nome do ícone (ex: Pill, Heart, etc.)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCategoryOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={saveNewCategory}>Adicionar Categoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar categoria */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria. Nome e Slug são
              obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-name" className="text-right">
                Nome*
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={currentCategory?.name || ""}
                onChange={handleCategoryChange}
              />
            </div>

            <div>
              <Label htmlFor="edit-slug" className="text-right">
                Slug*
              </Label>
              <Input
                id="edit-slug"
                name="slug"
                value={currentCategory?.slug || ""}
                onChange={handleCategoryChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Identificador único usado na URL (exemplo: "medicamentos")
              </p>
            </div>

            <div>
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={currentCategory?.description || ""}
                onChange={handleCategoryChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-icon" className="text-right">
                Ícone
              </Label>
              <Input
                id="edit-icon"
                name="icon"
                value={currentCategory?.icon || ""}
                onChange={handleCategoryChange}
                placeholder="Nome do ícone (ex: Pill, Heart, etc.)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCategoryOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={updateCategory}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para adicionar subcategoria */}
      <Dialog
        open={isAddSubcategoryOpen}
        onOpenChange={setIsAddSubcategoryOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Subcategoria</DialogTitle>
            <DialogDescription>
              Adicione uma subcategoria à categoria "{currentCategory?.name}".
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="subcategory-name" className="text-right">
                Nome*
              </Label>
              <Input
                id="subcategory-name"
                name="name"
                value={currentSubcategory?.name || ""}
                onChange={handleSubcategoryChange}
              />
            </div>

            <div>
              <Label htmlFor="subcategory-slug" className="text-right">
                Slug*
              </Label>
              <Input
                id="subcategory-slug"
                name="slug"
                value={currentSubcategory?.slug || ""}
                onChange={handleSubcategoryChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Identificador único usado na URL (exemplo: "analgesicos")
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddSubcategoryOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={saveNewSubcategory}>Adicionar Subcategoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para confirmar exclusão */}
      <Dialog
        open={isDeleteCategoryOpen}
        onOpenChange={setIsDeleteCategoryOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a categoria "
              {currentCategory?.name}"? Esta ação removerá também todas as
              subcategorias e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteCategoryOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Excluir Categoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
