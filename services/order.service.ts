import AsyncStorage from "@react-native-async-storage/async-storage";
import { ordersStore } from "../mocks/ordersData";
import { authService } from "./auth.service";

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
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 🔹 Realizar transação do pedido via QR code (usando payment code)
  async performOrderTransaction(
    paymentCode: string,
    orderId: string
  ): Promise<TransactionResponse> {
    await this.delay(1000);

    const order = ordersStore.find(o => o.id === orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    if (order.state === "paid" || order.state === "closed") {
      throw new Error("Este pedido já foi pago");
    }

    const currentUser = await authService.getUser();
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    if (currentUser.wallet_balance < order.total_amount) {
      throw new Error("Saldo insuficiente na carteira");
    }

    currentUser.wallet_balance -= order.total_amount;
    currentUser.loyalty_points += Math.floor(order.total_amount / 10);
    await authService.saveUser(currentUser);

    order.state = "paid" as any;
    order.status = "preparing" as any;
    order.updated_at = new Date().toISOString();

    const transaction: Transaction = {
      id: `trans-${Date.now()}`,
      amount: order.total_amount,
      type: "payment",
      description: `Pagamento - Pedido #${orderId}`,
      created_at: new Date().toISOString(),
      current_balance: currentUser.wallet_balance,
    };

    return {
      status: "success",
      message: "Transação realizada com sucesso",
      data: {
        order: order as any,
        transaction,
      },
    };
  }

  // 🔹 Criar pedido
  async createOrder(orderData: any) {
    await this.delay(800);

    const currentUser = await authService.getUser();
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    const totalAmount = orderData.items.reduce(
      (sum: number, item: any) => sum + item.total_price,
      0
    );

    const orderId = `order-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      user_id: currentUser.id,
      table_id: orderData.table_id,
      type: orderData.type,
      status: OrderStatus.PENDING,
      state: OrderState.ONGOING,
      total_amount: totalAmount,
      delivery_address: orderData.delivery_address,
      scheduled_time: orderData.scheduled_time,
      payment_method: orderData.payment_method,
      terminal: orderData.terminal,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_items: orderData.items.map((item: any, index: number) => ({
        id: `item-${Date.now()}-${index}`,
        order_id: orderId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
    };

    ordersStore.unshift(newOrder as any);

    return {
      status: "success",
      message: "Pedido criado com sucesso",
      data: {
        order: newOrder,
      },
    };
  }

  // 🔹 Buscar pedido por ID
  async getOrderById(orderId: string) {
    await this.delay();

    const order = ordersStore.find(o => o.id === orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return {
      status: "success",
      message: "Pedido obtido com sucesso",
      data: {
        order,
      },
    };
  }
}

export const orderService = new OrderService();
