import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coffee } from "lucide-react-native";
import LoadingDots from "@/components/LoadingDots";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // Verifica se o app já foi aberto antes
        const hasOpened = await AsyncStorage.getItem("hasOpened");

        if (!hasOpened) {
          // Primeira vez abrindo o app → salva flag
          await AsyncStorage.setItem("hasOpened", "true");

          // Mostra a tela de splash e depois vai para o onboarding
          setTimeout(() => {
            setLoading(false);
            router.replace("/onboarding/1");
          }, 2000);
        } else {
          // Não é a primeira vez → vai direto para a tela de login
          setTimeout(() => {
            setLoading(false);
            router.replace("/login"); 
          }, 2000);
        }
      } catch (error) {
        console.error("Erro ao verificar primeira abertura:", error);
        // Em caso de erro, segue para o onboarding como fallback
        router.replace("/onboarding/1");
      }
    };

    checkFirstLaunch();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <View className="flex-1 gap-6 items-center justify-center">
          <View className="flex rounded-full items-center justify-center bg-white p-10">
            <Coffee color={"#503B36"} size={90} />
          </View>
          <Text className="text-5xl font-bold text-white">Coffee Buzz</Text>
          <Text className="text-lg text-gray-200">
            Onde cada gole conta uma história
          </Text>
        </View>
        <View className="absolute bottom-10 gap-4">
          <LoadingDots />
          <Text className="text-gray-400 italic">
            Criando a sua experiência perfeita
          </Text>
        </View>
      </View>
    );
  }

  return null;
}
