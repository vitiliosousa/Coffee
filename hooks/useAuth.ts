import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

interface LoginData {
  email: string;
  password: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async ({ email, password }: LoginData) => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      Alert.alert("Sucesso", `Bem-vindo, ${response.data.user.name}!`);
      router.replace("/home?fromLogin=true");
    } catch (error: any) {
      Alert.alert("Erro no login", error.message || "Não foi possível logar");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
}
