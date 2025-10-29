import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async ({ name, phone, email, password }: RegisterData) => {
    if (!name || !phone || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({ name, phone, email, password });
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading };
}
