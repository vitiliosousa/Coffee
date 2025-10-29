import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useVerifyOTP } from "@/hooks/useVerifyOTP";

export default function VerifyOTP() {
  const { otp, setOtp, loading, resendingOTP, handleVerifyOTP, handleResendOTP, router } = useVerifyOTP();

  return (
    <View className="flex-1 bg-white">
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Verificar OTP</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="mt-10 gap-6">
          <Text className="text-2xl font-semibold text-background mb-2">Inserir código OTP</Text>
          <Text className="text-gray-500 mb-4">
            Enviámos uma palavra-passe de uso único (OTP) para o seu e-mail registado. Por favor
            introduza-a abaixo para verificar a sua conta.
          </Text>

          <View>
            <Text className="text-background mb-2 font-semibold">Código OTP</Text>
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="Inserir código OTP"
              keyboardType="numeric"
              maxLength={6} 
              autoCapitalize="none"
              className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            />
          </View>

          <TouchableOpacity
            disabled={!otp || loading}
            onPress={handleVerifyOTP}
            className={`mt-6 rounded-full py-4 items-center ${!otp || loading ? "bg-gray-300" : "bg-background"}`}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold text-lg">Verificar OTP</Text>}
          </TouchableOpacity>

          <TouchableOpacity disabled={resendingOTP} onPress={handleResendOTP} className="mt-4 items-center">
            {resendingOTP ? (
              <ActivityIndicator color="#503B36" />
            ) : (
              <Text className="text-background font-semibold text-lg">Não recebeu o código? Reenviar OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-10 items-center">
          <TouchableOpacity onPress={() => router.replace("/home")}>
            <Text className="text-gray-500 font-semibold text-lg">Pular por agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
