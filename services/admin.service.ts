import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockCategories, mockProducts } from "../mocks/productsData";
import { mockCampaigns, mockLoyaltyHistory, mockLoyaltyStats, mockPaymentCode } from "../mocks/campaignsData";
import { mockOrders, ordersStore } from "../mocks/ordersData";

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
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 📂 Listar categorias
  async listCategories(): Promise<CategoriesResponse> {
    await this.delay();
    return {
      status: "success",
      message: "Categorias obtidas com sucesso",
      data: {
        categories: mockCategories,
      },
    };
  }

  // 📂 Listar produtos
  async listProducts(categoryId?: string): Promise<ProductsResponse> {
    await this.delay();

    const filteredProducts = categoryId
      ? mockProducts.filter(p => p.category_id === categoryId)
      : mockProducts;

    return {
      status: "success",
      message: "Produtos obtidos com sucesso",
      data: {
        products: filteredProducts,
        total: filteredProducts.length,
        current_page: 1,
        per_page: 50,
        has_more: false,
      },
    };
  }

  // 🔎 Obter produto por ID
  async getProductById(productId: string): Promise<ProductResponse> {
    await this.delay();

    const product = mockProducts.find(p => p.id === productId);

    if (!product) {
      throw {
        status: "error",
        message: "Produto não encontrado",
      };
    }

    return {
      status: "success",
      message: "Produto obtido com sucesso",
      data: {
        product,
      },
    };
  }

  // 🔎 Pesquisar produtos
  async searchProducts(query: string, limit = 10): Promise<ProductsResponse> {
    await this.delay();

    const searchResults = mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, limit);

    return {
      status: "success",
      message: "Busca realizada com sucesso",
      data: {
        products: searchResults,
        total: searchResults.length,
        current_page: 1,
        per_page: limit,
        has_more: false,
      },
    };
  }

  // 📂 Listar variações
  async listVariants(productId: string): Promise<VariantsResponse> {
    await this.delay();
    return {
      status: "success",
      message: "Variações obtidas com sucesso",
      data: {
        variants: [],
        total: 0,
      },
    };
  }

  // 🔎 Obter variação por ID
  async getVariantById(variantId: string): Promise<VariantResponse> {
    await this.delay();
    throw {
      status: "error",
      message: "Variação não encontrada",
    };
  }

  // 📂 Listar campanhas ativas
  async getActiveCampaigns(): Promise<ActiveCampaignsResponse> {
    await this.delay();

    const now = new Date();
    const activeCampaigns = mockCampaigns.filter(
      c => new Date(c.start_date) <= now && new Date(c.end_date) >= now
    );

    return {
      status: "success",
      message: "Campanhas ativas obtidas com sucesso",
      data: {
        count: activeCampaigns.length,
        data: activeCampaigns,
      },
    };
  }

  // 💳 Gerar código de pagamento (5 minutos padrão, sem valor)
  async generatePaymentCode(): Promise<PaymentCodeResponse> {
    await this.delay();

    return {
      status: "success",
      message: "Código de pagamento gerado com sucesso",
      data: {
        code: `PAY${Math.floor(100000 + Math.random() * 900000)}`,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        valid_for: "5 minutos",
      },
    };
  }

  // 📦 Listar pedidos do usuário (live)
  async getUserLiveOrders(): Promise<UserOrdersResponse> {
    await this.delay();

    const liveOrders = ordersStore.filter(
      o => o.state === "ongoing" || o.state === "paid"
    );

    return {
      status: "success",
      message: "Pedidos ativos obtidos com sucesso",
      data: liveOrders,
    };
  }

  // 🎁 Obter histórico de fidelidade
  async getLoyaltyHistory(): Promise<LoyaltyHistoryResponse> {
    await this.delay();

    return {
      status: "success",
      message: "Histórico de fidelidade obtido com sucesso",
      data: {
        history: mockLoyaltyHistory,
        stats: mockLoyaltyStats,
      },
    };
  }
}

export const adminService = new AdminService();
