import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { Link } from "expo-router";
import { ChevronLeft, Calendar, Gift } from "lucide-react-native";
import { usePromotions } from "@/hooks/usePromotions";

export default function Promotions() {
  const { campaigns, loading, loadPromotions, formatDate } = usePromotions();

  const renderPromotionCard = (campaign: any) => (
    <View key={campaign.id} className="flex-1 bg-fundo rounded-xl mb-6">
      <View className="flex-row gap-2">
        <View className="w-40 h-40">
          {campaign.image_url ? (
            <Image
              source={{ uri: campaign.image_url }}
              className="w-40 h-40 rounded-xl"
              onError={(error) => console.log("Erro ao carregar imagem:", error.nativeEvent.error)}
            />
          ) : (
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-40 h-40 rounded-xl"
            />
          )}
        </View>

        <View className="flex-1 p-4 gap-2">
          <Text className="text-xl font-semibold text-gray-800">{campaign.title}</Text>
          <Text className="text-gray-600 text-base">{campaign.description}</Text>
          <View className="flex-row gap-1 items-center">
            <Calendar size={16} color="#503B36" />
            <Text className="text-sm text-gray-500">
              Válido até {formatDate(campaign.end_date)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Promoções</Text>
        </View>
      </View>

      {/* Conteúdo scrollável */}
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
          campaigns.map(renderPromotionCard)
        )}
      </ScrollView>
    </View>
  );
}
