import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import DotsWhite from "@/components/Dots";
import { authService } from "@/services/auth.service";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Erro", "Por favor, insira o código OTP.");
      return;
    }

    // Validação básica do OTP (assumindo que são 6 dígitos)
    if (otp.length < 4) {
      Alert.alert("Erro", "O código OTP deve ter pelo menos 4 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP(otp);
      Alert.alert("Sucesso", "Conta verificada com sucesso!");
      router.replace("/home"); 
    } catch (error: any) {
      console.error("Erro ao verificar OTP:", error.message);
      Alert.alert("Erro", error.message || "Falha ao verificar OTP.");
      // Limpar OTP após erro para nova tentativa
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendingOTP(true);
    try {
      await authService.requestOTP();
      Alert.alert("Sucesso", "Novo código OTP enviado para seu email!");
      setOtp(""); 
    } catch (error: any) {  
      console.error("Erro ao reenviar OTP:", error.message);
      Alert.alert("Erro", error.message || "Falha ao reenviar OTP.");
    } finally {
      setResendingOTP(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
     
      <View className="bg-background p-6 gap-6">
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Verify OTP</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-10 gap-6">
          <Text className="text-2xl font-semibold text-background mb-2">
            Enter OTP Code
          </Text>
          <Text className="text-gray-500 mb-4">
            We sent a one-time password (OTP) to your registered email. Please
            enter it below to verify your account.
          </Text>

          <View>
            <Text className="text-background mb-2 font-semibold">OTP Code</Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP code"
              keyboardType="numeric"
              maxLength={6} 
              autoCapitalize="none"
              className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            />
          </View>

          <TouchableOpacity
            disabled={!otp || loading}
            onPress={handleVerifyOTP}
            className={`mt-6 rounded-full py-4 items-center ${
              !otp || loading ? "bg-gray-300" : "bg-background"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Verify OTP
              </Text>
            )}
          </TouchableOpacity>

        
          <TouchableOpacity
            disabled={resendingOTP}
            onPress={handleResendOTP}
            className="mt-4 items-center"
          >
            {resendingOTP ? (
              <ActivityIndicator color="#503B36" />
            ) : (
              <Text className="text-background font-semibold text-lg">
                Didn't receive code? Resend OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>

        
        <View className="mt-10 items-center">
          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Text className="text-gray-500 font-semibold text-lg">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}