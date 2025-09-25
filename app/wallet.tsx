import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, CreditCard, Plus, RotateCcw, Banknote, Smartphone } from "lucide-react-native";
import { authService, AccountInfoResponse, WalletTransactionsResponse, Transaction } from "@/services/auth.service";

export default function Wallet() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<AccountInfoResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = await authService.getAccountInfo();
        setAccountInfo(account);

        const txResponse: WalletTransactionsResponse = await authService.getWalletTransactions();
        // Ordenar da mais recente para a mais antiga
        const sortedTx = txResponse.data.items.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTransactions(sortedTx);
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível carregar os dados da carteira");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#503B36" />
        <Text className="mt-2 text-background">Carregando carteira...</Text>
      </View>
    );
  }

  const recentTransactions = transactions.slice(0, 3);

  return (
    <View className="flex-1 bg-white">
      {/* Cabeçalho */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Minha Carteira</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-background rounded-xl p-6 gap-6">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-yellow-300 text-xl">Salto Actual</Text>
              <Text className="text-white text-4xl font-bold">
                ${accountInfo?.data?.account.wallet_balance?.toFixed(2) ?? "0.00"}
              </Text>
            </View>
            <CreditCard size={50} color="#fde047" />
          </View>

          <View className="flex-row items-center justify-between">
            <View className="gap-2">
              <Text className="text-yellow-300">Nome</Text>
              <Text className="text-white text-2xl">{accountInfo?.data?.account.name}</Text>
            </View>
            <View>
              <Text className="text-yellow-300">Estado</Text>
              <Text className="text-white text-2xl">{accountInfo?.data?.account.status}</Text>
            </View>
          </View>
        </View>

        <View className="mt-6 flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.push("/addmoney")}
            className="bg-background rounded-xl p-4 flex-1 items-center justify-center gap-2"
          >
            <Plus size={24} color="#FFFFFF" />
            <Text className="text-white text-center text-lg">Adicionar dinheiro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/history")}
            className="bg-white rounded-xl p-4 flex-1 items-center justify-center border border-background gap-2"
          >
            <RotateCcw size={24} color="#503B36" />
            <Text className="text-background text-center text-lg">Histórico</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-8 mb-4">
          <Text className="text-2xl font-bold">Transações Recentes</Text>
          <Link href={"/history"} className="text-background">Ver Todas</Link>
        </View>

        {recentTransactions.map((tx) => {
          const isTopup = tx.type === "topup";
          const Icon = isTopup ? Banknote : Smartphone;
          const bgColor = isTopup ? "bg-green-200" : "bg-red-200";
          const iconColor = isTopup ? "#22c55e" : "#ef4444";

          return (
            <View
              key={tx.id}
              className="flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl mb-4 border border-gray-100"
            >
              <View className={`p-5 rounded-full ${bgColor}`}>
                <Icon size={24} color={iconColor} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg">{tx.description || tx.type}</Text>
                <Text className="text-gray-500">M-Pesa . {new Date(tx.created_at).toLocaleDateString()}</Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold text-xl ${isTopup ? "text-green-500" : "text-red-500"}`}>
                  {isTopup ? `+${tx.amount}` : `-${tx.amount}`}
                </Text>
                <Text className="text-gray-500 capitalize">{tx.status}</Text>
              </View>
            </View>
          );
        })}

      </ScrollView>
    </View>
  );
}
