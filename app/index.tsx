import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "@/components/SplashScreen"; // Importar o novo componente
import { authService } from "@/services/auth.service";

// Constantes para tempos de delay
const SPLASH_SCREEN_DELAY = 2000;

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasOpened = await AsyncStorage.getItem("hasOpened");

        if (!hasOpened) {
          await AsyncStorage.setItem("hasOpened", "true");
          setTimeout(() => {
            setLoading(false);
            router.replace("/onboarding/1");
          }, SPLASH_SCREEN_DELAY);
        } else {
          // Verificar se o usuário está autenticado
          const isAuthenticated = await authService.isAuthenticated();

          setTimeout(() => {
            setLoading(false);
            if (isAuthenticated) {
              router.replace("/home");
            } else {
              router.replace("/login");
            }
          }, SPLASH_SCREEN_DELAY);
        }
      } catch (error) {
        console.error("Erro ao verificar primeira abertura:", error);
        router.replace("/onboarding/1"); // Fallback em caso de erro
      }
    };

    checkFirstLaunch();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return null;
}
