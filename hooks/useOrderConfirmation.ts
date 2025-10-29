import { useState } from "react";
import { Alert } from "react-native";

export type OrderType = "dine-in" | "drive-thru" | "delivery";

export interface OrderData {
  orderId: string;
  orderType: OrderType;
  tableId?: string;
  deliveryAddress?: string;
  total: number;
  itemCount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export function useOrderConfirmation(initialData: Partial<OrderData>) {
  const [orderData] = useState<OrderData>({
    orderId: initialData.orderId || "",
    orderType: initialData.orderType || "dine-in",
    tableId: initialData.tableId,
    deliveryAddress: initialData.deliveryAddress,
    total: initialData.total || 0,
    itemCount: initialData.itemCount || 0,
    paymentMethod: initialData.paymentMethod || "",
    status: initialData.status || "",
    createdAt: initialData.createdAt || new Date().toISOString(),
  });

  const getOrderTypeInfo = () => {
    switch (orderData.orderType) {
      case "dine-in":
        return {
          icon: "clock",
          title: "Dine-In",
          subtitle: `Mesa ${orderData.tableId}`,
          description: "Seu pedido será servido na mesa selecionada",
        };
      case "delivery":
        return {
          icon: "map-pin",
          title: "Delivery",
          subtitle: "Entrega no endereço",
          description: orderData.deliveryAddress,
        };
      case "drive-thru":
        return {
          icon: "credit-card",
          title: "Drive-Thru",
          subtitle: "Retirada no balcão",
          description: "Retire seu pedido no balcão quando estiver pronto",
        };
      default:
        return {
          icon: "clock",
          title: "Pedido",
          subtitle: "",
          description: "",
        };
    }
  };

  const getEstimatedTime = () => {
    switch (orderData.orderType) {
      case "dine-in":
        return "15-20 minutos";
      case "delivery":
        return "25-35 minutos";
      case "drive-thru":
        return "10-15 minutos";
      default:
        return "15-20 minutos";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pendente";
      case "preparing":
        return "Preparando";
      case "ready":
        return "Pronto";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  const handleViewOrderDetails = () => {
    Alert.alert("Ver Detalhes", "Funcionalidade de detalhes do pedido em desenvolvimento");
  };

  const handleTrackOrder = () => {
    Alert.alert("Acompanhar Pedido", "Funcionalidade de acompanhamento em desenvolvimento");
  };

  return {
    orderData,
    getOrderTypeInfo,
    getEstimatedTime,
    formatDate,
    getStatusColor,
    getStatusText,
    handleViewOrderDetails,
    handleTrackOrder,
  };
}
