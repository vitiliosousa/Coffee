import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://162.245.188.169:8045/api/v1";

// Enums para os tipos e status
export enum OrderType {
  DRIVE_THRU = "drive_thru",
  DELIVERY = "delivery",
  DINE_IN = "dine_in",
}

export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export enum OrderState {
  ONGOING = "ongoing",
  CLOSED = "closed",
  PAID = "paid",
}

export enum PaymentMethod {
  WALLET = "wallet",
  POS = "pos",
}

export enum Terminal {
  POS = "POS",
  APP = "APP",
}

// Interfaces principais
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: string;
    name: string;
    description: string;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  table_id?: string;
  type: OrderType;
  status: OrderStatus;
  state: OrderState;
  total_amount: number;
  delivery_address?: string;
  scheduled_time?: string;
  payment_method: PaymentMethod;
  terminal: Terminal;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface MonthlySales {
  month: string;
  total_sales: number;
  total_orders: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export interface QRCode {
  order_id: string;
  qr_code: string;
}

// Interfaces de Request
export interface CreateOrderRequest {
  table_id?: string;
  type: OrderType;
  payment_method: PaymentMethod;
  terminal: Terminal;
  delivery_address?: string;
  scheduled_time?: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SearchOrdersRequest {
  id?: string;
  user_id?: string;
  status?: OrderStatus;
  type?: OrderType;
  client_name?: string;
}

export interface UpdateStatusRequest {
  order_id: string;
  status: OrderStatus;
}

export interface UpdateStateRequest {
  order_id: string;
  state: OrderState;
}

export interface TransactionRequest {
  order_id: string;
}

// Interfaces de Response
export interface CreateOrderResponse {
  success?: boolean;
  status?: string;
  message: string;
  data: {
    id: string;
    user_id: string;
    table_id?: string;
    type: OrderType;
    status: OrderStatus;
    state: OrderState;
    total_amount: number;
    delivery_address?: string;
    scheduled_time?: string;
    payment_method: PaymentMethod;
    terminal: Terminal;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
  };
}

export interface SearchOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export interface OrderTotalResponse {
  success: boolean;
  message: string;
  data: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrderItemsResponse {
  success: boolean;
  message: string;
  data: OrderItem[];
}

export interface AddItemResponse {
  success: boolean;
  message: string;
  data: OrderItem;
}

export interface RemoveItemResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    total_amount: number;
    updated_at: string;
  };
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: OrderStatus;
    updated_at: string;
  };
}

export interface UpdateStateResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    state: OrderState;
    updated_at: string;
  };
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    transaction: Transaction;
  };
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  data: QRCode;
}

export interface MonthlySalesResponse {
  success: boolean;
  message: string;
  data: MonthlySales[];
}

class OrderService {
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
    
    if (!response.ok) {
      throw new Error(data.message || "Erro ao processar requisição");
    }
    
    return data;
  }

  // 1️⃣ Criar pedido
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    // Limpar campos undefined antes de enviar
    const cleanedData = {
      ...orderData,
      table_id: orderData.table_id || undefined,
      delivery_address: orderData.delivery_address || undefined,
      scheduled_time: orderData.scheduled_time || undefined,
      items: orderData.items.map(item => ({
        ...item,
        variant_id: item.variant_id || undefined
      }))
    };

    return this.makeAuthenticatedRequest<CreateOrderResponse>("/users/orders", {
      method: "POST",
      body: JSON.stringify(cleanedData),
    });
  }

  // 2️⃣ Buscar pedidos
  async searchOrders(filters: SearchOrdersRequest): Promise<SearchOrdersResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users/orders?${queryString}` : "/users/orders";

    return this.makeAuthenticatedRequest<SearchOrdersResponse>(endpoint, {
      method: "GET",
    });
  }

  // 3️⃣ Obter total do pedido
  async getOrderTotal(orderId: string): Promise<OrderTotalResponse> {
    return this.makeAuthenticatedRequest<OrderTotalResponse>(
      `/users/orders/total/${orderId}`,
      { method: "GET" }
    );
  }

  // 4️⃣ Obter pedido por ID
  async getOrderById(orderId: string): Promise<OrderResponse> {
    return this.makeAuthenticatedRequest<OrderResponse>(
      `/users/orders/${orderId}`,
      { method: "GET" }
    );
  }

  // 5️⃣ Obter itens do pedido
  async getOrderItems(orderId: string): Promise<OrderItemsResponse> {
    return this.makeAuthenticatedRequest<OrderItemsResponse>(
      `/users/orders/${orderId}/items`,
      { method: "GET" }
    );
  }

  // 6️⃣ Criar pedido em andamento
  async createOngoingOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.makeAuthenticatedRequest<CreateOrderResponse>("/users/orders/ongoing", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // 7️⃣ Adicionar item ao pedido em andamento
  async addItemToOrder(orderId: string, item: OrderItemRequest): Promise<AddItemResponse> {
    return this.makeAuthenticatedRequest<AddItemResponse>(
      `/users/orders/${orderId}/items`,
      {
        method: "POST",
        body: JSON.stringify(item),
      }
    );
  }

  // 8️⃣ Remover item do pedido em andamento
  async removeItemFromOrder(orderId: string, itemId: string): Promise<RemoveItemResponse> {
    return this.makeAuthenticatedRequest<RemoveItemResponse>(
      `/users/orders/${orderId}/items/${itemId}/remove`,
      { method: "DELETE" }
    );
  }

  // 9️⃣ Atualizar status do pedido
  async updateOrderStatus(updateData: UpdateStatusRequest): Promise<UpdateStatusResponse> {
    return this.makeAuthenticatedRequest<UpdateStatusResponse>("/users/orders/update-status", {
      method: "POST",
      body: JSON.stringify(updateData),
    });
  }

  // 🔟 Atualizar estado do pedido
  async updateOrderState(updateData: UpdateStateRequest): Promise<UpdateStateResponse> {
    return this.makeAuthenticatedRequest<UpdateStateResponse>("/users/orders/update-state", {
      method: "POST",
      body: JSON.stringify(updateData),
    });
  }

  // 1️⃣1️⃣ Realizar transação do pedido
  async performOrderTransaction(userId: string, orderId: string): Promise<TransactionResponse> {
    return this.makeAuthenticatedRequest<TransactionResponse>(
      `/users/orders/perform-transaction/${userId}`,
      {
        method: "POST",
        body: JSON.stringify({ order_id: orderId }),
      }
    );
  }

  // 1️⃣2️⃣ Obter QR Code do pedido
  async getOrderQRCode(orderId: string): Promise<QRCodeResponse> {
    return this.makeAuthenticatedRequest<QRCodeResponse>(
      `/users/orders/${orderId}/qrcode`,
      { method: "GET" }
    );
  }

  // 1️⃣3️⃣ Obter vendas mensais
  async getMonthlySales(): Promise<MonthlySalesResponse> {
    return this.makeAuthenticatedRequest<MonthlySalesResponse>(
      "/users/orders/monthly-sales",
      { method: "GET" }
    );
  }
}

export const orderService = new OrderService();