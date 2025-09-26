import { Link, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  CreditCard,
  Phone,
  Banknote,
  CheckCircle
} from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useCart } from "@/contexts/CartContext";
import { authService, AccountInfoResponse } from "@/services/auth.service";

type PaymentMethod = 'balance' | 'mpesa' | 'card';

export default function Payment() {
  const router = useRouter();
  const { getTotal, clearCart, items } = useCart();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('balance');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [availableBalance, setAvailableBalance] = useState<number>(0);

  const totalAmount = getTotal();
  const hasSufficientBalance = availableBalance >= totalAmount;

  // Buscar saldo real da API
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const account: AccountInfoResponse = await authService.getAccountInfo();
        const balance = account?.data?.account?.wallet_balance ?? 0;
        setAvailableBalance(balance);
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível carregar o saldo disponível.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handlePayment = async () => {
    if (items.length === 0) {
      Alert.alert("Erro", "Carrinho vazio!");
      return;
    }

    if (selectedPaymentMethod === 'balance' && !hasSufficientBalance) {
      Alert.alert("Saldo insuficiente", "Você não tem saldo suficiente para este pedido.");
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);

      Alert.alert(
        "Pagamento realizado com sucesso!",
        `Seu pedido no valor de $${totalAmount.toFixed(2)} foi processado com sucesso.`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.push("/home");
            }
          }
        ]
      );
    }, 2000);
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'balance':
        return <CreditCard size={24} />;
      case 'mpesa':
        return <Phone size={24} />;
      case 'card':
        return <Banknote size={24} />;
    }
  };

  const getPaymentMethodTitle = (method: PaymentMethod) => {
    switch (method) {
      case 'balance':
        return 'Saldo';
      case 'mpesa':
        return 'M-Pesa';
      case 'card':
        return 'Cartão Bancário';
    }
  };

  const getPaymentMethodDescription = (method: PaymentMethod) => {
    switch (method) {
      case 'balance':
        return `Disponível: $${availableBalance.toFixed(2)}`;
      case 'mpesa':
        return 'Transferência móvel';
      case 'card':
        return 'Crédito ou cartão de débito';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#503B36" />
        <Text className="mt-2">Carregando saldo...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Pagamento</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Status do pedido */}
        <View className="p-6 gap-4 flex-row bg-zinc-100 items-center justify-between">
          <View className="flex-row gap-4 items-center">
            <Clock size={24} />
            <View>
              <Text className="text-xl font-semibold">Pedido</Text>
              <Text className="text-lg">Aguardando pagamento</Text>
              <Text className="text-sm">Estimativa: 15-20 minutos</Text>
            </View>
          </View>
          <Text className="text-2xl font-semibold text-background">
            ${totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Métodos de pagamento */}
        <View className="flex-1 p-6 gap-4">
          <Text className="font-bold text-2xl">Selecione o método de pagamento</Text>

          {(['balance', 'mpesa', 'card'] as PaymentMethod[]).map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setSelectedPaymentMethod(method)}
              className={`p-4 flex-row border rounded-xl items-center justify-between ${
                selectedPaymentMethod === method ? 'border-background bg-background/10' : 'border-gray-300'
              }`}
            >
              <View className="flex flex-row gap-4 items-center">
                {getPaymentMethodIcon(method)}
                <View>
                  <Text className="font-semibold text-xl">{getPaymentMethodTitle(method)}</Text>
                  <Text className="text-lg text-gray-600">{getPaymentMethodDescription(method)}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {method === 'balance' && (
                  <View className={`px-3 py-1 rounded-full ${
                    hasSufficientBalance ? 'bg-green-200' : 'bg-red-200'
                  }`}>
                    <Text className={`text-sm font-semibold ${
                      hasSufficientBalance ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {hasSufficientBalance ? 'Suficiente' : 'Insuficiente'}
                    </Text>
                  </View>
                )}

                {selectedPaymentMethod === method && (
                  <CheckCircle size={20} color="#503B36" />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Resumo final */}
          <View className="mt-6 p-4 bg-gray-50 rounded-xl">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold">Total a pagar:</Text>
              <Text className="text-2xl font-bold text-background">
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 mt-2">
              Método: {getPaymentMethodTitle(selectedPaymentMethod)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={handlePayment}
          disabled={processing || (selectedPaymentMethod === 'balance' && !hasSufficientBalance)}
          className={`w-full h-14 rounded-full items-center justify-center shadow-md ${
            processing || (selectedPaymentMethod === 'balance' && !hasSufficientBalance)
              ? 'bg-gray-400'
              : 'bg-background'
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {processing ? 'Processando...' : `Pagar ${totalAmount.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}