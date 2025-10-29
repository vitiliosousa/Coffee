import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { authService, Transaction } from "@/services/auth.service";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  // Tradução de status
  const translateStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      confirmed: "Confirmada",
      pending: "Pendente",
      rejected: "Rejeitada",
      completed: "Completa",
      failed: "Falhada",
    };
    return statusMap[status.toLowerCase()] || status;
  };

  // Tradução de tipo de transação
  const translateType = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      topup: "Recarga",
      payment: "Pagamento",
      transfer: "Transferência",
      refund: "Reembolso",
      withdrawal: "Levantamento",
    };
    return typeMap[type.toLowerCase()] || type;
  };

  // Mapeamento de filtros
  const filterMap: { [key: string]: string } = {
    Todos: "all",
    Confirmada: "confirmed",
    Pendente: "pending",
    Rejeitada: "rejected",
  };

  // Buscar transações
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await authService.getWalletTransactions();
        setTransactions(response.data.items);
      } catch (error: any) {
        console.error("Erro ao buscar transações:", error);
        Alert.alert("Erro", error.message || "Não foi possível carregar as transações");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filtrar e pesquisar transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const filterValue = filterMap[selectedFilter];
      const matchFilter =
        filterValue === "all" || tx.status.toLowerCase() === filterValue;

      const matchSearch =
        translateType(tx.type).toLowerCase().includes(search.toLowerCase()) ||
        tx.description?.toLowerCase().includes(search.toLowerCase()) ||
        translateStatus(tx.status).toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [transactions, selectedFilter, search]);

  return {
    transactions: filteredTransactions,
    loading,
    selectedFilter,
    setSelectedFilter,
    search,
    setSearch,
    translateStatus,
    translateType,
  };
};
