import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Gift, Star, Calendar } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { authService } from "@/services/auth.service";
import { adminService } from "@/services/admin.service";

interface Campaign {
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

interface ActiveCampaignsResponse {
  status: string;
  message: string;
  data: {
    count: number;
    data: Campaign[];
  };
}

export default function Loyalty() {
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadActiveCampaigns();
  }, []);

  const loadUserData = async () => {
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
  };

  const loadActiveCampaigns = async () => {
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
      Alert.alert("Erro", error.message || "Não foi possível carregar as campanhas");
    } finally {
      setCampaignsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderCampaignCard = (campaign: Campaign) => (
    <View key={campaign.id} className="bg-fundo border rounded-2xl p-6 flex-1 gap-2 mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold flex-1 pr-2">
          {campaign.title}
        </Text>
        <View className="p-2 bg-green-500 rounded-full">
          <Text className="text-white font-semibold text-sm">
            {campaign.type}
          </Text>
        </View>
      </View>
      <Text className="text-lg text-gray-700">
        {campaign.description}
      </Text>
      <View className="flex-row items-center gap-2 mt-2">
        <Calendar size={15} color="#503B36" />
        <Text className="text-sm text-gray-600">
          {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Programa de Fidelidade</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1">
        {/* Seção de Pontos */}
        <View className="bg-fundo p-6">
          <View className="flex-1 items-center gap-2 justify-center shadow-xl bg-white rounded-2xl p-6">
            <View className="bg-orange-100 rounded-full p-5">
              <Star size={40} color="#facc15" />
            </View>
            <Text className="text-3xl font-bold text-black mt-4">
              Seus Pontos
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#503B36" />
            ) : (
              <Text className="text-5xl font-bold text-background">{userPoints}</Text>
            )}
            <Text className="text-lg text-gray-800">Disponível para resgatar</Text>
          </View>
        </View>

        {/* Campanhas Ativas */}
        <View className="p-6 flex-1 gap-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-black">
              Campanhas activas
            </Text>
            {campaignsLoading && (
              <ActivityIndicator color="#503B36" />
            )}
          </View>

          {campaignsLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#503B36" />
              <Text className="text-gray-600 mt-2">Carregamento de campanhas...</Text>
            </View>
          ) : campaigns.length === 0 ? (
            <View className="items-center py-8">
              <Gift size={40} color="#BCA9A1" />
              <Text className="text-xl font-semibold text-gray-600 mt-2">
                Nenhuma campanha activa
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                As novas campanhas aparecerão aqui
              </Text>
            </View>
          ) : (
            campaigns.map(renderCampaignCard)
          )}
        </View>
      </ScrollView>
    </View>
  );
}