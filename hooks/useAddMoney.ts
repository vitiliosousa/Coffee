import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

export function useAddMoney() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [200, 500, 1000, 2000];

  // Carrega telefone salvo do usuário
  useEffect(() => {
    (async () => {
      try {
        const user = await authService.getUser();
        if (user?.phone) setPhone(user.phone);
      } catch (error: any) {
        console.error("Erro ao carregar telefone:", error);
      }
    })();
  }, []);

  const handleConfirmDeposit = async () => {
    if (!amount || !paymentMethod || !phone) {
      Alert.alert("Aviso", "Preencha todos os campos antes de continuar.");
      return;
    }

    if (paymentMethod !== "mpesa") {
      Alert.alert("Aviso", "Por enquanto só o Mpesa está disponível.");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.getUser();
      if (!user) {
        Alert.alert("Erro", "Usuário não encontrado. Faça login novamente.");
        return;
      }

      const response = await authService.walletTopUp({
        user_id: user.id,
        amount: parseFloat(amount),
        phone,
        description: "Recarga via app",
        method: "mpesa",
      });

      Alert.alert("Sucesso", response.message || "Recarga solicitada!");
      router.push("/wallet");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Falha ao processar a recarga.");
    } finally {
      setLoading(false);
    }
  };

  return {
    amount,
    setAmount,
    phone,
    setPhone,
    paymentMethod,
    setPaymentMethod,
    loading,
    quickAmounts,
    handleConfirmDeposit,
    router,
  };
}
