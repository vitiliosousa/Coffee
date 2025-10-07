import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import { authService } from "@/services/auth.service";

export default function RecoverPassword() {
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
      // Aqui você chamaria authService.requestPasswordReset(email)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navegar para tela de OTP
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

  return (
    <ScrollView className="flex-1 bg-fundo p-6">
      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Mail size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">
            Recuperar Password
          </Text>
          <Text className="text-gray-600 text-xl">Vamos te ajudar</Text>
        </View>
      </View>

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Esqueceu a sua password?
        </Text>
        <Text className="text-gray-600 text-xl">
          Insira o seu email para receber um código de verificação.
        </Text>
      </View>

      <View className="mt-10 gap-6">
        <View>
          <Text className="text-background mb-2 font-semibold">
            Endereço de Email
          </Text>
          <TextInput
            placeholder="Insira o seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

        <TouchableOpacity
          onPress={handleRecover}
          disabled={loading}
          className="mt-4 flex items-center bg-background rounded-full py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Enviar Código
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        className="mt-6 flex items-center"
      >
        <Text className="text-black font-semibold">
          Lembrou a sua password?{" "}
          <Text className="text-background">Entrar</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}