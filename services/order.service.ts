import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://162.245.188.169:8045/api/v1";

export enum OrderType {
  DRIVE_THRU = "drive_thru",
  DELIVERY = "delivery",
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

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  current_balance?: number;
}

export interface TransactionResponse {
  status: string;
  message: string;
  data: {
    order: Order;
    transaction: Transaction;
  };
}

export interface TransactionRequest {
  order_id: string;
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

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`=== REQUEST: ${options.method || "GET"} ${url} ===`);
    if (options.body) console.log("Body:", options.body);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`=== RESPONSE: ${response.status} ${response.statusText} ===`);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      const message = data.message || "Erro ao processar requisição";
      throw new Error(message);
    }

    return data;
  }

  // 🔹 Realizar transação do pedido via QR code (usando payment code)
  async performOrderTransaction(
    paymentCode: string,
    orderId: string
  ): Promise<TransactionResponse> {
    try {
      console.log("=== ORDER SERVICE: Iniciando transação ===");
      console.log("Payment Code:", paymentCode);
      console.log("Order ID:", orderId);

      const payload = { order_id: orderId };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await this.makeAuthenticatedRequest<TransactionResponse>(
        `/users/orders/perform-transaction/${paymentCode}`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      console.log("=== ORDER SERVICE: Transação concluída ===");
      console.log("Resposta:", JSON.stringify(response, null, 2));

      return response;
    } catch (error: any) {
      console.error("=== ORDER SERVICE: Erro na transação ===");
      console.error("Erro completo:", error);
      throw error;
    }
  }

  // 🔹 Criar pedido
  async createOrder(orderData: any) {
    const cleanedData = {
      type: orderData.type,
      payment_method: orderData.payment_method,
      terminal: orderData.terminal,
      ...(orderData.table_id && { table_id: orderData.table_id }),
      ...(orderData.delivery_address && { delivery_address: orderData.delivery_address }),
      ...(orderData.scheduled_time && { scheduled_time: orderData.scheduled_time }),
      items: orderData.items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        ...(item.variant_id && { variant_id: item.variant_id }),
      })),
    };

    console.log("=== Criando pedido ===");
    console.log(JSON.stringify(cleanedData, null, 2));

    return this.makeAuthenticatedRequest("/users/orders", {
      method: "POST",
      body: JSON.stringify(cleanedData),
    });
  }

  // 🔹 Buscar pedido por ID
  async getOrderById(orderId: string) {
    return this.makeAuthenticatedRequest(`/users/orders/${orderId}`, {
      method: "GET",
    });
  }
}

export const orderService = new OrderService();
