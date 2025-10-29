import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { ChevronLeft, Star, Gift, Award, Calendar, Percent } from "lucide-react-native";
import { useLoyalty } from "@/hooks/useLoyalty";

export default function Loyalty() {
  const {
    userPoints,
    campaigns,
    loyaltyHistory,
    loading,
    campaignsLoading,
    historyLoading,
    formatDate,
    formatDateTime,
    getRewardTypeText,
    getRewardTypeColor,
  } = useLoyalty();

  const getRewardTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "points": return Star;
      case "percentage_discount": return Percent;
      case "fixed_discount": return Gift;
      case "free_item": return Gift;
      default: return Award;
    }
  };

  const renderCampaignCard = (campaign: any) => (
    <View key={campaign.id} className="bg-[#FFF9EC] border border-gray-300 rounded-2xl p-6 flex-1 gap-2 mb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold flex-1 pr-2">{campaign.title}</Text>
        <View className="px-3 py-1 bg-green-500 rounded-full">
          <Text className="text-white font-semibold text-sm">{campaign.type}</Text>
        </View>
      </View>
      <Text className="text-lg text-gray-700">{campaign.description}</Text>
      <View className="flex-row items-center gap-2 mt-2">
        <Calendar size={15} color="#503B36" />
        <Text className="text-sm text-gray-600">
          {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
        </Text>
      </View>
    </View>
  );

  const renderHistoryItem = (item: any) => {
    const colors = getRewardTypeColor(item.reward_type);
    const RewardIcon = getRewardTypeIcon(item.reward_type);

    return (
      <View key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 mb-3 shadow-sm">
        <View className="flex-row items-start gap-3">
          <View className={`p-3 rounded-full ${colors.bg}`}>
            <RewardIcon size={20} color={colors.icon} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 mb-1">{item.rule_name}</Text>
            <Text className="text-sm text-gray-600 mb-2">{item.rule_description}</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className={`px-2 py-1 rounded-full ${colors.bg}`}>
                  <Text className={`text-xs font-semibold ${colors.text}`}>
                    {getRewardTypeText(item.reward_type)}
                  </Text>
                </View>
                <Text className={`text-lg font-bold ${colors.text}`}>
                  {item.reward_type === 'percentage_discount' 
                    ? `${item.applied_reward_value}%` 
                    : `${item.applied_reward_value} pts`}
                </Text>
              </View>
              <Text className="text-xs text-gray-500">{formatDateTime(item.usage_date)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
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
        <View className="bg-[#FFF9EC] p-6">
          <View className="flex-1 items-center gap-2 justify-center shadow-xl bg-white rounded-2xl p-6">
            <View className="bg-[#FEF3C7] rounded-full p-5">
              <Star size={40} color="#D97706" />
            </View>
            <Text className="text-3xl font-bold text-black mt-4">Seus Pontos</Text>
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
            <Text className="text-2xl font-bold text-black">Campanhas Activas</Text>
            {campaignsLoading && <ActivityIndicator color="#503B36" />}
          </View>
          {campaignsLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#503B36" />
              <Text className="text-gray-600 mt-2">Carregando campanhas...</Text>
            </View>
          ) : campaigns.length === 0 ? (
            <View className="items-center py-8">
              <Gift size={40} color="#BCA9A1" />
              <Text className="text-xl font-semibold text-gray-600 mt-2">Nenhuma campanha activa</Text>
              <Text className="text-gray-500 text-center mt-2">As novas campanhas aparecerão aqui</Text>
            </View>
          ) : (
            campaigns.map(renderCampaignCard)
          )}
        </View>

        {/* Histórico de Recompensas */}
        <View className="p-6 flex-1 gap-6 bg-gray-50">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-black">Histórico de Recompensas</Text>
            {historyLoading && <ActivityIndicator color="#503B36" />}
          </View>
          {historyLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#503B36" />
              <Text className="text-gray-600 mt-2">Carregando histórico...</Text>
            </View>
          ) : loyaltyHistory.length === 0 ? (
            <View className="items-center py-8 bg-white rounded-xl">
              <Award size={40} color="#BCA9A1" />
              <Text className="text-xl font-semibold text-gray-600 mt-2">Nenhuma recompensa ainda</Text>
              <Text className="text-gray-500 text-center mt-2 px-4">
                Continue usando nossos serviços para ganhar recompensas
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-sm text-gray-600">
                {loyaltyHistory.length} {loyaltyHistory.length === 1 ? 'recompensa utilizada' : 'recompensas utilizadas'}
              </Text>
              {loyaltyHistory.map(renderHistoryItem)}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
