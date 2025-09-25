import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Banknote, Smartphone } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { authService } from "@/services/auth.service";

export default function AddMoney() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(""); // Novo campo de telefone
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAmounts = [200, 500, 1000, 2000];

  // Preenche o telefone do usuário caso esteja salvo
  useEffect(() => {
    (async () => {
      const user = await authService.getUser();
      if (user?.phone) setPhone(user.phone);
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

    try {
      setLoading(true);

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

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6 gap-6">
        
        <View className="flex-row gap-4 items-center">
          <Link href={"/wallet"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Adicionar Dinheiro</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Campo de valor */}
        <View className="mb-6 gap-4">
          <Text className="text-2xl font-semibold mb-2 text-background">
            Introduzir o montante
          </Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="500"
            keyboardType="numeric"
            className="w-full border bg-white border-gray-300 rounded-lg px-4 py-4 text-lg"
          />
        </View>

        <View className="flex-row flex-wrap justify-between mb-6">
          {quickAmounts.map((val) => (
            <TouchableOpacity
              key={val}
              onPress={() => setAmount(val.toString())}
              className="bg-transparent border border-yellow-300 px-6 py-3 rounded-xl mb-4 w-[48%] items-center"
            >
              <Text className="text-background text-lg">{val}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campo de telefone */}
        <View className="mb-6 gap-4">
          <Text className="text-2xl font-semibold mb-2 text-background">
            Número de Telefone (Mpesa)
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="2547XXXXXXXX"
            keyboardType="phone-pad"
            className="w-full border bg-white border-gray-300 rounded-lg px-4 py-4 text-lg"
          />
        </View>

        <Text className="text-2xl font-semibold mb-3 text-background">
          Selecionar o método de pagamento
        </Text>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => setPaymentMethod("bank")}
            className={`flex-row items-center gap-4 p-5 rounded-xl border ${
              paymentMethod === "bank"
                ? "border-background bg-background/10"
                : "border-gray-300 bg-white"
            }`}
          >
            <Banknote size={28} color="#3b82f6" />
            <View>
              <Text className="text-lg font-semibold text-background">
                Transferencia Bancária
              </Text>
              <Text>Transferencia Bancaria Directa</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod("mpesa")}
            className={`flex-row items-center gap-4 p-5 rounded-xl border ${
              paymentMethod === "mpesa"
                ? "border-background bg-background/10"
                : "border-gray-200 bg-white"
            }`}
          >
            <Smartphone size={28} color="#22c55e" />
            <View>
              <Text className="text-lg font-semibold text-background">
                Mpesa
              </Text>
              <Text className="text-gray-500">Transferência de dinheiro móvel</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          disabled={!amount || !paymentMethod || !phone || loading}
          onPress={handleConfirmDeposit}
          className={`mt-10 mb-10 rounded-full py-4 items-center ${
            !amount || !paymentMethod || !phone || loading
              ? "bg-gray-300"
              : "bg-background"
          }`}
        >
          <Text className="text-white font-semibold text-lg">
            {loading ? "Processando..." : "Confirmar Deposito"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
