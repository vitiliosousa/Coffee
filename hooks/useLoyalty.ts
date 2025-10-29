// hooks/useLoyalty.ts
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { adminService, Campaign, LoyaltyHistoryItem, LoyaltyStats } from "@/services/admin.service";

export function useLoyalty() {
  const [userPoints, setUserPoints] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyHistoryItem[]>([]);
  const [loyaltyStats, setLoyaltyStats] = useState<LoyaltyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const response = await authService.getAccountInfo();
      if (response.data?.account) {
        setUserPoints(response.data.account.loyalty_points || 0);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dados do usuário:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActiveCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const response = await adminService.getActiveCampaigns();
      if (response.data?.data) {
        const appCampaigns = response.data.data.filter(campaign =>
          campaign.channels.includes("app")
        );
        setCampaigns(appCampaigns);
      }
    } catch (error: any) {
      console.error("Erro ao carregar campanhas:", error);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const loadLoyaltyHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await adminService.getLoyaltyHistory();
      if (response.data) {
        setLoyaltyHistory(response.data.history || []);
        setLoyaltyStats(response.data.stats || null);
      }
    } catch (error: any) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
    loadActiveCampaigns();
    loadLoyaltyHistory();
  }, [loadUserData, loadActiveCampaigns, loadLoyaltyHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRewardTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "points":
        return "Pontos";
      case "percentage_discount":
        return "Desconto %";
      case "fixed_discount":
        return "Desconto Fixo";
      case "free_item":
        return "Item Grátis";
      default:
        return type;
    }
  };

  const getRewardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "points":
        return { bg: "bg-yellow-100", text: "text-yellow-800", icon: "#D97706" };
      case "percentage_discount":
        return { bg: "bg-green-100", text: "text-green-800", icon: "#059669" };
      case "fixed_discount":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: "#2563eb" };
      case "free_item":
        return { bg: "bg-purple-100", text: "text-purple-800", icon: "#7c3aed" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", icon: "#6b7280" };
    }
  };

  return {
    userPoints,
    campaigns,
    loyaltyHistory,
    loyaltyStats,
    loading,
    campaignsLoading,
    historyLoading,
    formatDate,
    formatDateTime,
    getRewardTypeText,
    getRewardTypeColor,
  };
}
