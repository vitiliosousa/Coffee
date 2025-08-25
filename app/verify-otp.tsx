import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import DotsWhite from "@/components/Dots";
import { authService } from "@/services/auth.service";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) return Alert.alert("Erro", "Por favor, insira o código OTP.");

    try {
      setLoading(true);
      await authService.verifyOTP(otp);
      Alert.alert("Sucesso", "Conta verificada com sucesso!");
      router.push("/home"); 
    } catch (error: any) {
      console.error("Erro ao verificar OTP:", error.message);
      Alert.alert("Erro", error.message || "Falha ao verificar OTP.");
    } finally {
      setLoading(false);
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

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <View className="mt-10 gap-6">
          <Text className="text-2xl font-semibold text-background mb-2">
            Enter OTP Code
          </Text>
          <Text className="text-gray-500 mb-4">
            We sent a one-time password (OTP) to your registered email. Please enter it below to verify your account.
          </Text>

          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            keyboardType="numeric"
            className="w-full border bg-white border-gray-300 rounded-lg px-4 py-4 text-lg"
          />

          <TouchableOpacity
            disabled={!otp || loading}
            onPress={handleVerifyOTP}
            className={`mt-6 rounded-full py-4 items-center ${
              !otp || loading ? "bg-gray-300" : "bg-background"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 items-center">
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Text className="text-background font-semibold text-lg">
              Skip and continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
