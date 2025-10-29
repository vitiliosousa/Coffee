import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CheckCircle, Clock, MapPin, CreditCard, Home } from "lucide-react-native";
import { useOrderConfirmation } from "@/hooks/useOrderConfirmation";

export default function OrderConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    orderData,
    getOrderTypeInfo,
    formatDate,
    getStatusColor,
    getStatusText,
  } = useOrderConfirmation({
    orderId: params.orderId as string,
    orderType: params.orderType as any,
    tableId: params.tableId as string,
    deliveryAddress: params.deliveryAddress as string,
    total: parseFloat(params.total as string),
    itemCount: parseInt(params.itemCount as string),
    paymentMethod: params.paymentMethod as string,
    status: params.status as string,
    createdAt: params.createdAt as string,
  });

  const orderTypeInfo = getOrderTypeInfo();

  const renderIcon = () => {
    switch (orderData.orderType) {
      case "dine-in":
        return <Clock size={24} color="#503B36" />;
      case "delivery":
        return <MapPin size={24} color="#503B36" />;
      case "drive-thru":
        return <CreditCard size={24} color="#503B36" />;
      default:
        return <Clock size={24} color="#503B36" />;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER DE SUCESSO */}
      <View className="bg-green-500 p-8 items-center justify-center">
        <CheckCircle size={64} color="#FFFFFF" />
        <Text className="text-white text-3xl font-bold mt-4">Pedido Confirmado!</Text>
        <Text className="text-white text-lg mt-2">Obrigado pela sua compra</Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Informações do Pedido */}
        <View className="bg-gray-50 rounded-xl p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-2xl font-bold">Pedido #{orderData.orderId.slice(-6)}</Text>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(orderData.status)}`}>
              <Text className="text-sm font-semibold">{getStatusText(orderData.status)}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            {renderIcon()}
            <View className="flex-1">
              <Text className="text-xl font-semibold">{orderTypeInfo.title}</Text>
              <Text className="text-lg text-gray-600">{orderTypeInfo.subtitle}</Text>
              {orderTypeInfo.description && (
                <Text className="text-sm text-gray-500 mt-1">{orderTypeInfo.description}</Text>
              )}
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg">Itens no pedido:</Text>
              <Text className="text-lg font-semibold">{orderData.itemCount}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg">Método de pagamento:</Text>
              <Text className="text-lg font-semibold">{orderData.paymentMethod}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg">Data do pedido:</Text>
              <Text className="text-lg font-semibold">{formatDate(orderData.createdAt)}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold">Total pago:</Text>
              <Text className="text-xl font-bold text-background">{orderData.total.toFixed(2)} MT</Text>
            </View>
          </View>
        </View>

        {/* Informações Importantes */}
        <View className="bg-yellow-50 rounded-xl p-4 mt-6 mb-20">
          <Text className="text-yellow-800 font-semibold mb-2">Informações importantes:</Text>
          <Text className="text-yellow-700 text-sm leading-5">
            • Você receberá uma notificação quando seu pedido estiver pronto{'\n'}
            • Mantenha seu celular por perto para receber atualizações{'\n'}
            • Em caso de dúvidas, entre em contato conosco
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md flex-row gap-2"
        >
          <Home size={20} color="#FFFFFF" />
          <Text className="text-white font-bold text-lg">Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
