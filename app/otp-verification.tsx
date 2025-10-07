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
import { Shield } from "lucide-react-native";
import { useState, useRef } from "react";
import { authService } from "@/services/auth.service";

export default function OTPVerification() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Refs para os inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Aceitar apenas números
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus no próximo input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Voltar para o input anterior ao pressionar backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Erro", "Por favor, insira o código de 6 dígitos completo");
      return;
    }

    setLoading(true);

    try {
      // Aqui você chamaria authService.verifyOTP(email, otpCode)
      // Por enquanto, simulando sucesso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navegar para tela de reset de senha
      router.push({
        pathname: "/recover-password",
        params: { email, otp: otpCode },
      });
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Código inválido. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);

    try {
      // Aqui você chamaria authService.resendOTP(email)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Sucesso", "Novo código enviado para o seu email!");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível reenviar o código");
    } finally {
      setResending(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-fundo p-6">
      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Shield size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">
            Verificação
          </Text>
          <Text className="text-gray-600 text-xl">Código OTP</Text>
        </View>
      </View>

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Insira o código
        </Text>
        <Text className="text-gray-600 text-xl">
          Enviamos um código de 6 dígitos para{"\n"}
          <Text className="font-semibold text-background">{email}</Text>
        </Text>
      </View>

      <View className="mt-10 gap-6">
        {/* OTP Inputs */}
        <View className="flex-row justify-between">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              className="w-12 h-14 border-2 bg-white border-fundoescuro rounded-lg text-center text-2xl font-bold text-background"
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className="mt-4 flex items-center bg-background rounded-full py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Verificar Código
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-6 items-center gap-2">
        <Text className="text-gray-600">Não recebeu o código?</Text>
        <TouchableOpacity onPress={handleResendOTP} disabled={resending}>
          {resending ? (
            <ActivityIndicator color="#503B36" />
          ) : (
            <Text className="text-background font-bold">Reenviar Código</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        className="mt-8 flex items-center"
      >
        <Text className="text-black font-semibold">
          Voltar para{" "}
          <Text className="text-background">Recuperação de Password</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}