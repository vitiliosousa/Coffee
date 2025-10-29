import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import { adminService, UserOrder } from "@/services/admin.service";

export const useUserOrders = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      const response = await adminService.getUserLiveOrders();
      if (response.status === "success" && Array.isArray(response.data)) {
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
      } else {
        console.warn("Estrutura de resposta inesperada:", response);
        setOrders([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar os pedidos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => `${amount.toFixed(2)} MT`;

  return {
    orders,
    loading,
    refreshing,
    handleRefresh,
    formatDate,
    formatTime,
    formatCurrency,
  };
};
