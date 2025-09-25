import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Calendar, Gift } from "lucide-react-native";
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

export default function Promotions() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await adminService.getActiveCampaigns();
      
      if (response.data?.data) {
        const appPromotions = response.data.data.filter(campaign => 
          campaign.channels.includes("app")
        );
        setCampaigns(appPromotions);
      }
    } catch (error: any) {
      console.error("Erro ao carregar promoções:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar as promoções");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleAvailOffer = (campaign: Campaign) => {
    Alert.alert(
      "Oferta Ativada",
      `A promoção "${campaign.title}" foi ativada! Aproveite sua oferta.`,
      [
        {
          text: "OK",
          onPress: () => {
            // Aqui você pode implementar a lógica para aplicar a promoção
            // Por exemplo, redirecionar para o menu ou salvar a promoção ativa
            console.log("Promoção ativada:", campaign.id);
          }
        }
      ]
    );
  };

  const renderPromotionCard = (campaign: Campaign) => (
    <View key={campaign.id} className="flex-1 bg-fundo rounded-xl mb-6">
      <View className="flex-row gap-2">
        {/* Imagem da promoção */}
        <View className="w-40 h-40">
          {campaign.image_url ? (
            <Image
              source={{ uri: campaign.image_url }}
              className="w-40 h-40 rounded-xl"
              onError={(error) => {
                console.log("Erro ao carregar imagem:", error.nativeEvent.error);
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-40 h-40 rounded-xl"
            />
          )}
        </View>

        {/* Conteúdo da promoção */}
        <View className="flex-1 p-4 gap-2">
          <Text className="text-xl font-semibold text-gray-800">
            {campaign.title}
          </Text>
          <Text className="text-gray-600 text-base">
            {campaign.description}
          </Text>
          <View className="flex-row gap-1 items-center">
            <Calendar size={16} color="#503B36" />
            <Text className="text-sm text-gray-500">
              Válido até {formatDate(campaign.end_date)}
            </Text>
          </View>
        
        </View>
      </View>

      {/* Botão de ação */}
      <TouchableOpacity 
        className="flex-1 bg-background items-center justify-center p-4 rounded-b-xl"
        onPress={() => handleAvailOffer(campaign)}
      >
        <Text className="text-white font-semibold">Avail Offer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Promoções</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 p-6">
        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#503B36" />
            <Text className="text-gray-600 mt-2">Carregando promoções...</Text>
          </View>
        ) : campaigns.length === 0 ? (
          <View className="items-center py-8">
            <Gift size={60} color="#BCA9A1" />
            <Text className="text-xl font-semibold text-gray-600 mt-4">
              Nenhuma promoção disponível
            </Text>
            <Text className="text-gray-500 text-center mt-2 px-4">
              Fique atento! Novas promoções exclusivas aparecerão aqui em breve.
            </Text>
            <TouchableOpacity 
              className="mt-4 bg-background px-6 py-3 rounded-full"
              onPress={loadPromotions}
            >
              <Text className="text-white font-semibold">Atualizar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>          
            {campaigns.map(renderPromotionCard)}
          </>
        )}
      </ScrollView>
    </View>
  );
}