import { useEffect, useState, useRef } from "react";
import { Alert, Dimensions, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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

export function useHome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

  const [accountInfo, setAccountInfo] = useState<AccountInfoResponse["data"]["account"] | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Buscar informações e campanhas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await authService.getAccountInfo();
        setAccountInfo(accountResponse.data.account);

        const promotionsResponse = await adminService.getActiveCampaigns();
        if (promotionsResponse.data?.data) {
          const appPromotions = promotionsResponse.data.data.filter((c) =>
            c.channels.includes("app")
          );
          setCampaigns(appPromotions);
        }

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

  // Auto-scroll das promoções
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

  // Ações
  const handleVerifyNow = () => {
    setShowVerificationModal(false);
    router.push("/verify-otp");
  };

  const handleContinueWithoutVerification = () => {
    setShowVerificationModal(false);
  };

  const handlePromotionPress = () => {
    router.push("/promotions");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return {
    accountInfo,
    campaigns,
    currentSlide,
    showVerificationModal,
    loading,
    router,
    scrollViewRef,
    handleVerifyNow,
    handleContinueWithoutVerification,
    handlePromotionPress,
    setCurrentSlide,
    screenWidth,
    formatDate,
  };
}
