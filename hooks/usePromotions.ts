import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { adminService } from "@/services/admin.service";

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

export function usePromotions() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await adminService.getActiveCampaigns();
      if (response.data?.data) {
        const appPromotions = response.data.data.filter(c => c.channels.includes("app"));
        setCampaigns(appPromotions);
      }
    } catch (error: any) {
      console.error("Erro ao carregar promoções:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar as promoções");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return {
    campaigns,
    loading,
    loadPromotions,
    formatDate,
  };
}
