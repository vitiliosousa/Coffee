import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from "react-native";
import { Link } from "expo-router";
import { ChevronLeft, CreditCard, Plus, RotateCcw, Banknote, Smartphone, QrCode, Copy, X, Clock } from "lucide-react-native";
import { useWallet } from "@/hooks/useWallet";

export default function Wallet() {
  const {
    loading,
    accountInfo,
    recentTransactions,
    showPaymentIdModal,
    paymentCode,
    generatingCode,
    handleOpenModal,
    setShowPaymentIdModal,
    generatePaymentCode,
    copyToClipboard,
    formatExpiryTime,
    router,
  } = useWallet();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#503B36" />
        <Text className="mt-2 text-background">Carregando carteira...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Modal Código de Pagamento */}
      <Modal
        visible={showPaymentIdModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentIdModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-background">Código de Pagamento</Text>
              <TouchableOpacity onPress={() => setShowPaymentIdModal(false)} className="p-2">
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {!paymentCode ? (
              <View className="gap-4">
                <Text className="text-center text-gray-600 mb-4">
                  Clique no botão abaixo para gerar um código de pagamento válido por 5 minutos
                </Text>
                <TouchableOpacity
                  onPress={generatePaymentCode}
                  disabled={generatingCode}
                  className={`py-3 rounded-xl ${generatingCode ? 'bg-gray-400' : 'bg-background'}`}
                >
                  {generatingCode ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-center text-lg">
                      Gerar Código
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center gap-4">
                <View className="bg-green-50 p-4 rounded-xl w-full border-2 border-green-200">
                  <Text className="text-center text-sm text-gray-600 mb-3">
                    Compartilhe este código para receber o pagamento
                  </Text>
                  <View className="items-center gap-3 bg-white p-4 rounded-lg">
                    <Text className="text-4xl font-bold text-background tracking-widest">
                      {paymentCode.code}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Clock size={14} color="#6B7280" />
                      <Text className="text-xs text-gray-500">
                        Expira em: {formatExpiryTime(paymentCode.expires_at)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={copyToClipboard}
                    className="flex-row items-center justify-center gap-2 bg-background px-4 py-3 rounded-full mt-3"
                  >
                    <Copy size={18} color="#FFFFFF" />
                    <Text className="text-white font-semibold">Copiar Código</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setShowPaymentIdModal(false)}
                  className="w-full bg-gray-200 py-3 rounded-xl"
                >
                  <Text className="text-center font-semibold text-gray-700">
                    Fechar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Cabeçalho */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Minha Carteira</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 pb-10">
        {/* Saldo */}
        <View className="bg-background rounded-xl p-6 gap-6">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="text-yellow-300 text-xl">Saldo Actual</Text>
              <Text className="text-white text-4xl font-bold">
                {accountInfo?.data?.account.wallet_balance?.toFixed(2) ?? "0.00"} MT
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
              <Text className="text-white text-2xl capitalize">{accountInfo?.data?.account.status}</Text>
            </View>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View className="mt-6 gap-4">
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={() => router.push("/addmoney")}
              className="bg-background rounded-xl p-4 flex-1 items-center justify-center gap-2"
            >
              <Plus size={24} color="#FFFFFF" />
              <Text className="text-white text-center text-base font-semibold">
                Adicionar{"\n"}Dinheiro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/history")}
              className="bg-white rounded-xl p-4 flex-1 items-center justify-center border border-background gap-2"
            >
              <RotateCcw size={24} color="#503B36" />
              <Text className="text-background text-center text-base font-semibold">Histórico</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4 mt-2">
            <TouchableOpacity
              onPress={() => router.push("/qrscanner")}
              className="bg-yellow-400 rounded-xl p-4 flex-1 flex-row items-center justify-center gap-3 border-2 border-yellow-500 shadow-lg"
            >
              <QrCode size={24} color="#503B36" strokeWidth={2.5} />
              <View className="flex-1">
                <Text className="text-background font-bold text-base">Pagar com QR</Text>
                <Text className="text-background/70 text-xs">Escaneie e pague</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleOpenModal}
              className="bg-green-400 rounded-xl p-4 flex-1 flex-row items-center justify-center gap-3 border-2 border-green-500 shadow-lg"
            >
              <Copy size={24} color="#FFFFFF" strokeWidth={2.5} />
              <View className="flex-1">
                <Text className="text-white font-bold text-base">Gerar Código</Text>
                <Text className="text-white/80 text-xs">Receber pagamento</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transações Recentes */}
        <View className="flex-row justify-between items-center mt-8 mb-4">
          <Text className="text-2xl font-bold">Transações Recentes</Text>
          <Link href={"/history"} className="text-background font-semibold">Ver Todas</Link>
        </View>

        {recentTransactions.length === 0 ? (
          <View className="bg-gray-50 rounded-xl p-8 items-center">
            <Text className="text-gray-400 text-center">Nenhuma transação recente</Text>
          </View>
        ) : (
          recentTransactions.map((tx) => {
            const isTopup = tx.type === "topup";
            const Icon = isTopup ? Banknote : Smartphone;
            const bgColor = isTopup ? "bg-green-200" : "bg-red-200";
            const iconColor = isTopup ? "#22c55e" : "#ef4444";

            return (
              <View
                key={tx.id}
                className="flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm"
              >
                <View className={`p-5 rounded-full ${bgColor}`}>
                  <Icon size={24} color={iconColor} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-lg">{tx.description || tx.type}</Text>
                  <Text className="text-gray-500">
                    M-Pesa · {new Date(tx.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className={`font-bold text-xl ${isTopup ? "text-green-500" : "text-red-500"}`}>
                    {isTopup ? `+${Number(tx.amount).toFixed(2)} MT` : `-${Number(tx.amount).toFixed(2)} MT`}
                  </Text>
                  <Text className="text-gray-500 capitalize text-sm">{tx.status}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
