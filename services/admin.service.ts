import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'http://162.245.188.169:8045/api/v1';

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
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
  display_order?: number;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
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
  };
}

class AdminService {
  private async makeAuthenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  // ✅ Listar categorias
  async listCategories(): Promise<CategoriesResponse> {
    return this.makeAuthenticatedRequest<CategoriesResponse>("/admin/categories", { method: "GET" });
  }

  // ✅ Listar produtos (opcional: por categoria)
  async listProducts(categoryId?: string): Promise<ProductsResponse> {
    const endpoint = categoryId ? `/admin/products?category_id=${categoryId}` : "/admin/products";
    return this.makeAuthenticatedRequest<ProductsResponse>(endpoint, { method: "GET" });
  }
}

export const adminService = new AdminService();
