import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

export function useVerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Erro", "Por favor, insira o código OTP.");
      return;
    }

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

  return {
    otp,
    setOtp,
    loading,
    resendingOTP,
    handleVerifyOTP,
    handleResendOTP,
    router,
  };
}
