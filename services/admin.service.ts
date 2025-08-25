import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://162.245.188.169:8045/api/v1";
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
  category?: Category; // já vem embutido no JSON
}

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product?: Product; // aparece quando buscamos um variant por ID
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: {
    categories: Category[];
  };
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: {
    products: Product[];
    total: number;
    current_page: number;
    per_page: number;
    has_more: boolean;
  };
}

export interface ProductResponse {
  status: string;
  message: string;
  data: {
    product: Product;
  };
}

export interface VariantsResponse {
  status: string;
  message: string;
  data: {
    variants: Variant[];
    total: number;
  };
}

export interface VariantResponse {
  status: string;
  message: string;
  data: {
    variant: Variant;
  };
}


class AdminService {
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await AsyncStorage.getItem("@auth_token");
    if (!token) throw new Error("Token não encontrado");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  }

  // 📂 Listar categorias
  async listCategories(): Promise<CategoriesResponse> {
    return this.makeAuthenticatedRequest<CategoriesResponse>(
      "/admin/categories",
      { method: "GET" }
    );
  }

  // 📂 Listar produtos
  async listProducts(categoryId?: string): Promise<ProductsResponse> {
    const endpoint = categoryId
      ? `/admin/products?category_id=${categoryId}`
      : "/admin/products";
    return this.makeAuthenticatedRequest<ProductsResponse>(endpoint, {
      method: "GET",
    });
  }

  // 🔎 Obter produto por ID
  async getProductById(productId: string): Promise<ProductResponse> {
    return this.makeAuthenticatedRequest<ProductResponse>(
      `/admin/products/${productId}`,
      { method: "GET" }
    );
  }

  // ✅ Criar produto
  async createProduct(product: {
    category_id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    display_order?: number;
  }): Promise<ProductResponse> {
    return this.makeAuthenticatedRequest<ProductResponse>("/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  }

  // 🔎 Pesquisar produtos
  async searchProducts(query: string, limit = 10): Promise<ProductsResponse> {
    return this.makeAuthenticatedRequest<ProductsResponse>(
      "/admin/products/search",
      {
        method: "POST",
        body: JSON.stringify({ query, limit }),
      }
    );
  }

  // ✅ Ativar/Desativar produto
  async toggleProductAvailability(
    productId: string,
    isAvailable: boolean
  ): Promise<ProductResponse> {
    return this.makeAuthenticatedRequest<ProductResponse>(
      `/admin/products/${productId}/toggle-availability`,
      {
        method: "PUT",
        body: JSON.stringify({ is_available: isAvailable }),
      }
    );
  }

  // ➕ Criar variação
  async createVariant(
    productId: string,
    variant: { name: string; price_adjustment: number; is_default: boolean }
  ): Promise<VariantResponse> {
    return this.makeAuthenticatedRequest<VariantResponse>(
      `/admin/products/${productId}/variants`,
      {
        method: "POST",
        body: JSON.stringify(variant),
      }
    );
  }

  // 📂 Listar variações
  async listVariants(productId: string): Promise<VariantsResponse> {
    return this.makeAuthenticatedRequest<VariantsResponse>(
      `/admin/products/${productId}/variants`,
      { method: "GET" }
    );
  }

  // 🔎 Obter variação por ID
  async getVariantById(variantId: string): Promise<VariantResponse> {
    return this.makeAuthenticatedRequest<VariantResponse>(
      `/admin/variants/${variantId}`,
      { method: "GET" }
    );
  }
}

export const adminService = new AdminService();