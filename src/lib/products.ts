// Interface para o tipo de produto básico usado nos cards
export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  requiresPrescription?: boolean;
  inStock?: boolean;
  category?: string;
  subcategory?: string;
}

// Interface estendida com informações detalhadas para a página de detalhes
export interface ProductDetails extends Product {
  description?: string;
  features?: string[];
  brand?: string;
  rating?: number;
  ratingCount?: number;
  seller?: string;
}

/**
 * Função para carregar produtos do localStorage
 * @returns Array de produtos cadastrados pelo administrador
 */
function loadAdminProducts(): ProductDetails[] {
  try {
    const storedProducts = localStorage.getItem("admin-products");
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
  } catch (error) {
    console.error("Erro ao carregar produtos do administrador:", error);
  }
  return [];
}

/**
 * Função para filtrar produtos por categoria
 * @param products Array de produtos
 * @param category Nome da categoria
 * @returns Array de produtos filtrados por categoria
 */
function filterProductsByCategory(
  products: ProductDetails[],
  category: string
): ProductDetails[] {
  return products.filter((product) => product.category === category);
}

// Carrega produtos do painel administrativo
const adminProducts = loadAdminProducts();

// Separar produtos por categoria para os diferentes componentes do site
export const featuredProductsData = adminProducts;
export const healthProductsData = filterProductsByCategory(
  adminProducts,
  "saude"
);
export const hygieneProductsData = filterProductsByCategory(
  adminProducts,
  "higiene"
);

// Função para obter um produto pelo ID
export const getProductById = (id: string): ProductDetails | null => {
  const product = adminProducts.find((product) => product.id === id);

  if (!product) {
    return null;
  }

  // Adicionar detalhes padrão se necessário
  return {
    ...product,
    rating: product.rating || 4.5,
    ratingCount: product.ratingCount || Math.floor(Math.random() * 200) + 50,
    seller: product.seller || "Drogaria São Rafael",
    features: product.features || ["Informações sobre o produto em breve."],
  };
};
