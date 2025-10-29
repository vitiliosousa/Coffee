import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

export function useRecoverPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRecover = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira o seu email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido");
      return;
    }

    setLoading(true);

    try {
      // Aqui você chamaria o serviço real:
      // await authService.requestPasswordReset(email)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push({
        pathname: "/otp-verification" as any,
        params: { email },
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível iniciar a recuperação da password"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    handleRecover,
  };
}
