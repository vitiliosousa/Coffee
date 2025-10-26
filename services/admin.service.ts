import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://eticketsmz.site/brewhouse/api/v1";

// ==================== INTERFACES ====================

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
  category?: Category;
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
  product?: Product;
}

export interface Campaign {
  id: string;
  title: string;
  type: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string;
  send_notification: boolean;
  channels: string[];
  created_at: string;
  updated_at: string;
}

export interface PaymentCode {
  code: string;
  expires_at: string;
  valid_for: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
  };
}

export interface UserOrder {
  id: string;
  user_id: string;
  table_id: string | null;
  type: string;
  status: string;
  state: string;
  total_amount: number;
  delivery_address: string | null;
  scheduled_time: string | null;
  payment_method: string;
  terminal: string;
  created_at: string;
  updated_at: string;
  table?: {
    id: string;
    number: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  user?: {
    id: string;
    name: string;
    phone: string;
    role: string;
    wallet_balance: number;
    loyalty_points: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  order_items?: OrderItem[];
}

export interface LoyaltyHistoryItem {
  id: string;
  rule_name: string;
  rule_description: string;
  reward_type: string;
  applied_reward_value: number;
  channel: string;
  usage_date: string;
}

export interface LoyaltyStats {
  total_usages: number;
  total_discounts: number;
  total_points: number;
  last_usage_date: string;
}

// ==================== RESPONSE TYPES ====================

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

export interface ActiveCampaignsResponse {
  status: string;
  message: string;
  data: {
    count: number;
    data: Campaign[];
  };
}

export interface PaymentCodeResponse {
  status: string;
  message: string;
  data: PaymentCode;
}

export interface UserOrdersResponse {
  status: string;
  message: string;
  data: UserOrder[];
}

export interface LoyaltyHistoryResponse {
  status: string;
  message: string;
  data: {
    history: LoyaltyHistoryItem[];
    stats: LoyaltyStats;
  };
}

// ==================== SERVICE CLASS ====================

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

  // 📂 Listar campanhas ativas
  async getActiveCampaigns(): Promise<ActiveCampaignsResponse> {
    return this.makeAuthenticatedRequest<ActiveCampaignsResponse>(
      "/admin/campaigns/active",
      { method: "GET" }
    );
  }

  // 💳 Gerar código de pagamento (5 minutos padrão, sem valor)
  async generatePaymentCode(): Promise<PaymentCodeResponse> {
    return this.makeAuthenticatedRequest<PaymentCodeResponse>(
      "/admin/payment-code/generate",
      {
        method: "POST",
        body: JSON.stringify({
          validity_minutes: 5, // ⏱️ Tempo fixo de 5 minutos
        }),
      }
    );
  }

  // 📦 Listar pedidos do usuário (live)
  async getUserLiveOrders(): Promise<UserOrdersResponse> {
    return this.makeAuthenticatedRequest<UserOrdersResponse>(
      "/admin/orders/user-live",
      { method: "GET" }
    );
  }

  // 🎁 Obter histórico de fidelidade
  async getLoyaltyHistory(): Promise<LoyaltyHistoryResponse> {
    return this.makeAuthenticatedRequest<LoyaltyHistoryResponse>(
      "/admin/loyalty/history",
      { method: "GET" }
    );
  }
}

export const adminService = new AdminService();
