import { useEffect, useState, useRef } from "react";
import {View,Text,TouchableOpacity,ScrollView,Image,Modal,Alert,Dimensions,
} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {Calendar,Car,Coffee,ArrowRight,Wallet,User,Menu,Star,Bell,Tag,
} from "lucide-react-native";
import { authService, AccountInfoResponse } from "@/services/auth.service";
import { adminService } from "@/services/admin.service";

const { width: screenWidth } = Dimensions.get("window");

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

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [accountInfo, setAccountInfo] = useState<
    AccountInfoResponse["data"]["account"] | null
  >(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar informações da conta
        const accountResponse = await authService.getAccountInfo();
        setAccountInfo(accountResponse.data.account);

        // Buscar promoções
        const promotionsResponse = await adminService.getActiveCampaigns();
        if (promotionsResponse.data?.data) {
          const appPromotions = promotionsResponse.data.data.filter(
            (campaign) => campaign.channels.includes("app")
          );
          setCampaigns(appPromotions);
        }

        // Verifica se veio de um login e se a conta não está verificada
        if (
          accountResponse.data.account.status !== "active" &&
          params.fromLogin === "true"
        ) {
          setShowVerificationModal(true);
          router.replace("/home");
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados:", error.message);
        Alert.alert("Erro", "Não foi possível carregar as informações");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.fromLogin]);

  // Auto-scroll das promoções (só se tiver mais de 1 slide)
  useEffect(() => {
    if (campaigns.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          if (nextSlide >= campaigns.length) {
            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
            return 0;
          } else {
            scrollViewRef.current?.scrollTo({
              x: nextSlide * (screenWidth - 48),
              animated: true,
            });
            return nextSlide;
          }
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [campaigns.length]);

  const handleVerifyNow = () => {
    setShowVerificationModal(false);
    router.push("/verify-otp");
  };

  const handleContinueWithoutVerification = () => {
    setShowVerificationModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handlePromotionPress = () => {
    router.push("/promotions");
  };

  const renderPromotionSlide = (campaign: Campaign, index: number) => (
    <View
      key={campaign.id}
      style={{ width: screenWidth - 48 }}
      className="bg-background p-8 rounded-2xl gap-4 mr-4"
    >
      <Text className="text-white font-bold text-2xl">☕ {campaign.title}</Text>
      <Text className="text-gray-300 text-xl">{campaign.description}</Text>
      <TouchableOpacity
        className="h-14 w-32 justify-center items-center rounded-xl bg-white"
        onPress={handlePromotionPress}>
        <Text className="text-background font-bold text-lg">Ver Ofertas</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderização quando NÃO há promoções
  const renderNoPromotions = () => (
    <View style={{ width: screenWidth - 48 }} className="bg-gray-100 p-8 rounded-2xl gap-4">
      <View className="items-center justify-center">
        <Tag size={40} color="#9CA3AF" />
      </View>
      <Text className="text-gray-500 font-bold text-xl text-center">
        Nenhuma Promoção Disponível
      </Text>
      <Text className="text-gray-400 text-lg text-center">
        No momento não temos promoções ativas. Continue acompanhando para não perder nossas próximas ofertas!
      </Text>
      <TouchableOpacity
        className="h-14 w-40 justify-center items-center rounded-xl bg-gray-300 self-center"
        onPress={() => router.push("/menu")}>
        <Text className="text-gray-600 font-bold text-lg">Ver Menu</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderização quando HÁ promoções
  const renderPromotionsSection = () => (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.round(
            event.nativeEvent.contentOffset.x / (screenWidth - 48)
          );
          setCurrentSlide(slideIndex);
        }}
      >
        {campaigns.map((campaign, index) => renderPromotionSlide(campaign, index))}
      </ScrollView>

      {/* Indicadores de slide - só mostra se tiver mais de 1 promoção */}
      {campaigns.length > 1 && (
        <View className="flex-row justify-center mt-4 gap-2">
          {campaigns.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? "bg-background" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-fundo">
        <Text className="text-background text-xl">Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fundo">
      <Modal visible={showVerificationModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white p-6 rounded-xl w-full">
            <Text className="text-xl font-bold mb-4">Conta não verificada</Text>
            <Text className="mb-6">
              Sua conta ainda não está verificada. Você pode verificar agora
              para acessar todas as funcionalidades.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-xl mr-2 text-center flex-1 items-center justify-center"
                onPress={handleContinueWithoutVerification}
              >
                <Text>Continuar sem verificação</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-background px-4 py-2 rounded-xl flex-1 ml-2 items-center justify-center"
                onPress={handleVerifyNow}
              >
                <Text className="text-white font-bold">Verificar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="bg-fundo px-6 pt-6 pb-4">
        <View className="flex-row items-center">
          <View className="flex-1" />
          <View className="flex-1 items-end">
            <Link href="/create-account" className="text-gray-400">
              <Bell size={20} color="#503B36" />
            </Link>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-6 w-full">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-background rounded-full items-center justify-center">
              <Coffee size={30} color="#FFFFFF" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-600 text-xl">Bom Dia ☀️</Text>
              <Text className="text-3xl font-bold text-background">
                {accountInfo?.name || "Amante de Café"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Link href="/wallet">
              <Wallet size={20} color="#503B36" />
            </Link>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-[40px] gap-5 mb-5">
          <Text className="text-2xl font-bold text-background">
            O que você gostaria de fazer?
          </Text>
        </View>

        <View className="flex flex-col gap-5">
          <TouchableOpacity
            onPress={() => router.push("/reservation")}
            className="flex-row gap-4 bg-white p-5 rounded-2xl"
          >
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Calendar size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Reservar uma mesa
              </Text>
              <Text className="text-gray-400">
                Reserve seu lugar perfeito para uma experiência aconchegante de
                café
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/menu")}
            className="flex-row gap-4 bg-white p-5 rounded-2xl"
          >
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Car size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Iniciar Pedido
              </Text>
              <Text className="text-gray-400">
                Retirada rápida, sem esperar na fila
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-4 items-center justify-center">
            <TouchableOpacity
              onPress={() => router.push("/menu")}
              className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4"
            >
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Menu />
              </View>
              <Text className="text-background text-lg font-bold">
                Menu Completo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/loyalty")}
              className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4"
            >
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Star />
              </View>
              <Text className="text-background text-lg font-bold">
                Recompensas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção de Promoções - Agora com tratamento para quando não há promoções */}
          <View>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-background">
                🎁 Promoções Especiais
              </Text>
              {campaigns.length > 0 && (
                <TouchableOpacity 
                  onPress={handlePromotionPress}
                  className="flex-row items-center gap-1"
                >
                  <Text className="text-background text-sm">Ver todas</Text>
                  <ArrowRight size={16} color="#503B36" />
                </TouchableOpacity>
              )}
            </View>

            {/* Renderização condicional */}
            {campaigns.length > 0 ? renderPromotionsSection() : renderNoPromotions()}
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-12 mb-6">
          <Text className="text-xl font-bold text-background">
            🔥 Favoritos dos Clientes
          </Text>
          <View className="flex-row items-center gap-2">
            <Link href={"/menu"}>Ver todos</Link>
            <ArrowRight size={20} color="#503B36" />
          </View>
        </View>

        <View className="flex gap-5 mb-10">
          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1">
              <Text className="text-background font-bold text-xl">
                Cappuccino Signature
              </Text>
              <Text className="text-gray-400 text-lg">
                Espresso rico com espuma aveludada
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">
                  4,50 MT
                </Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>

          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coldbrew.jpg")}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1">
              <Text className="text-background font-bold text-xl">
                Cold Brew Especial
              </Text>
              <Text className="text-gray-400 text-lg">
                Cold brew suave de 12 horas
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">
                  4,50 MT
                </Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row justify-between items-center bg-white p-6 border-t border-gray-300 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => router.push("/myorders")}
          className="p-4"
        >
          <Coffee size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/myreservation")}
          className="p-4"
        >
          <Calendar size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/menu")}
          className="bg-background rounded-2xl px-8 py-4 flex-row items-center justify-center gap-2"
        >
          <Text className="text-white text-xl font-bold text-center">
            Pedir
          </Text>
          <Menu size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/loyalty")}
          className="p-4"
        >
          <Star size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="p-4"
        >
          <User size={20} color="#503B36" />
        </TouchableOpacity>
      </View>
    </View>
  );
}