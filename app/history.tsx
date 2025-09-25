import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { ChevronLeft, Banknote, Smartphone } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { authService, Transaction } from "@/services/auth.service";

export default function History() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar transações do usuário
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await authService.getWalletTransactions();
        setTransactions(response.data.items);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchFilter =
      selectedFilter === "All" || tx.status === selectedFilter.toLowerCase();
    const matchSearch =
      tx.type.toLowerCase().includes(search.toLowerCase()) ||
      tx.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/wallet"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">
            Historico de Transações
          </Text>
        </View>
      </View>

      {/* Search & Filters */}
      <View className="p-6 bg-gray-100">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Procurar transacções"
          keyboardType="default"
          className="w-full border bg-white border-gray-300 rounded-lg px-4 py-4 text-lg mb-4"
        />

        <View className="flex-row justify-between">
          {["All", "Confirmed", "Pending", "Rejected"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === filter ? "bg-background" : "bg-gray-200"
              }`}
            >
              <Text
                className={`font-semibold ${
                  selectedFilter === filter ? "text-white" : "text-gray-700"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1 p-6">
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : filteredTransactions.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            Não foram encontradas transacções
          </Text>
        ) : (
          filteredTransactions.map((tx) => {
            const Icon = tx.type === "topup" ? Smartphone : Banknote;
            const isTopup = tx.type === "topup";

            return (
              <View
                key={tx.id}
                className="flex-1 rounded-xl border border-gray-200 p-4 mt-2"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4">
                    <View className="bg-gray-100 p-3 rounded-full">
                      <Icon size={20} color="#000" />
                    </View>
                    <View>
                      <Text className="font-bold text-lg">
                        {tx.description || tx.type}
                      </Text>
                      <Text className="text-gray-500">
                        {isTopup ? "Top-up" : "Payment"}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      className={`font-bold text-2xl ${
                        isTopup ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isTopup ? `+${tx.amount}` : `-${tx.amount}`}
                    </Text>
                    <Text className="capitalize">{tx.status}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-gray-500"></Text>
                  <Text className="text-gray-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
