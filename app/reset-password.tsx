import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Lock, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { authService } from "@/services/auth.service";

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const otp = params.otp as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);

    try {
      // Aqui você chamaria authService.resetPassword(email, otp, newPassword)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert(
        "Sucesso!",
        "Sua senha foi redefinida com sucesso. Faça login com a nova senha.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível redefinir a senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return { text: "", color: "" };

    if (newPassword.length < 6) {
      return { text: "Fraca", color: "text-red-500" };
    } else if (newPassword.length < 8) {
      return { text: "Média", color: "text-yellow-500" };
    } else if (newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) {
      return { text: "Forte", color: "text-green-500" };
    } else {
      return { text: "Boa", color: "text-blue-500" };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <ScrollView className="flex-1 bg-fundo p-6">
      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Lock size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">
            Nova Senha
          </Text>
          <Text className="text-gray-600 text-xl">Redefina agora</Text>
        </View>
      </View>

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Crie uma nova senha
        </Text>
        <Text className="text-gray-600 text-xl">
          Sua nova senha deve ser diferente das senhas anteriores.
        </Text>
      </View>

      <View className="mt-10 gap-6">
        {/* Nova Senha */}
        <View>
          <Text className="text-background mb-2 font-semibold">
            Nova Senha
          </Text>
          <View className="relative">
            <TextInput
              placeholder="Digite sua nova senha"
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
              className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg pr-12"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-4"
            >
              {showNewPassword ? (
                <EyeOff size={24} color="#503B36" />
              ) : (
                <Eye size={24} color="#503B36" />
              )}
            </TouchableOpacity>
          </View>
          {newPassword.length > 0 && (
            <Text className={`mt-2 font-semibold ${passwordStrength.color}`}>
              Força da senha: {passwordStrength.text}
            </Text>
          )}
        </View>

        {/* Confirmar Senha */}
        <View>
          <Text className="text-background mb-2 font-semibold">
            Confirmar Nova Senha
          </Text>
          <View className="relative">
            <TextInput
              placeholder="Confirme sua nova senha"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg pr-12"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-4"
            >
              {showConfirmPassword ? (
                <EyeOff size={24} color="#503B36" />
              ) : (
                <Eye size={24} color="#503B36" />
              )}
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <Text className="mt-2 text-red-500 font-semibold">
              As senhas não coincidem
            </Text>
          )}
        </View>

        {/* Requisitos da senha */}
        <View className="bg-blue-50 p-4 rounded-lg">
          <Text className="text-background font-semibold mb-2">
            Requisitos da senha:
          </Text>
          <Text className="text-gray-600">• Mínimo de 6 caracteres</Text>
          <Text className="text-gray-600">• Recomendado: 8+ caracteres</Text>
          <Text className="text-gray-600">• Inclua letras maiúsculas e números</Text>
        </View>

        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={loading}
          className="mt-4 flex items-center bg-background rounded-full py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Redefinir Senha
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        className="mt-6 flex items-center"
      >
        <Text className="text-black font-semibold">
          Voltar para <Text className="text-background">Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}