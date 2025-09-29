import { useRouter, useLocalSearchParams } from "expo-router";
import {
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Home,
  Receipt
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert
} from "react-native";

type OrderType = 'dine-in' | 'drive-thru' | 'delivery';

export default function OrderConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [orderData] = useState({
    orderId: params.orderId as string,
    orderType: params.orderType as OrderType,
    tableId: params.tableId as string,
    deliveryAddress: params.deliveryAddress as string,
    total: parseFloat(params.total as string),
    itemCount: parseInt(params.itemCount as string),
    paymentMethod: params.paymentMethod as string,
    status: params.status as string,
    createdAt: params.createdAt as string
  });

  const getOrderTypeInfo = () => {
    switch (orderData.orderType) {
      case 'dine-in':
        return {
          icon: <Clock size={24} color="#503B36" />,
          title: 'Dine-In',
          subtitle: `Mesa ${orderData.tableId}`,
          description: 'Seu pedido será servido na mesa selecionada'
        };
      case 'delivery':
        return {
          icon: <MapPin size={24} color="#503B36" />,
          title: 'Delivery',
          subtitle: 'Entrega no endereço',
          description: orderData.deliveryAddress
        };
      case 'drive-thru':
        return {
          icon: <CreditCard size={24} color="#503B36" />,
          title: 'Drive-Thru',
          subtitle: 'Retirada no balcão',
          description: 'Retire seu pedido no balcão quando estiver pronto'
        };
      default:
        return {
          icon: <Clock size={24} color="#503B36" />,
          title: 'Pedido',
          subtitle: '',
          description: ''
        };
    }
  };

  const getEstimatedTime = () => {
    switch (orderData.orderType) {
      case 'dine-in': return '15-20 minutos';
      case 'delivery': return '25-35 minutos';
      case 'drive-thru': return '10-15 minutos';
      default: return '15-20 minutos';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Pronto';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const handleViewOrderDetails = () => {
    Alert.alert("Ver Detalhes", "Funcionalidade de detalhes do pedido em desenvolvimento");
  };

  const handleTrackOrder = () => {
    Alert.alert("Acompanhar Pedido", "Funcionalidade de acompanhamento em desenvolvimento");
  };

  const orderTypeInfo = getOrderTypeInfo();

  return (
    <View className="flex-1 bg-white">
      {/* Header de Sucesso */}
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
              <Text className={`text-sm font-semibold`}>
                {getStatusText(orderData.status)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 mb-4">
            {orderTypeInfo.icon}
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
              <Text className="text-xl font-bold text-background">${orderData.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Tempo Estimado */}
        <View className="bg-blue-50 rounded-xl p-6 mb-6">
          <View className="flex-row items-center gap-4">
            <Clock size={32} color="#3B82F6" />
            <View>
              <Text className="text-xl font-semibold">Tempo estimado</Text>
              <Text className="text-2xl font-bold text-blue-600">{getEstimatedTime()}</Text>
              <Text className="text-gray-600">
                {orderData.orderType === 'delivery' 
                  ? 'Incluindo tempo de entrega' 
                  : 'Para ficar pronto'}
              </Text>
            </View>
          </View>
        </View>

        {/* Botões de Ação */}
        <View className="gap-4">
          <TouchableOpacity
            onPress={handleTrackOrder}
            className="bg-background rounded-xl p-4 flex-row items-center justify-center gap-2"
          >
            <Receipt size={20} color="#FFFFFF" />
            <Text className="text-white font-bold text-lg">Acompanhar Pedido</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleViewOrderDetails}
            className="border border-background rounded-xl p-4 flex-row items-center justify-center gap-2"
          >
            <Receipt size={20} color="#503B36" />
            <Text className="text-background font-bold text-lg">Ver Detalhes do Pedido</Text>
          </TouchableOpacity>
        </View>

        {/* Informações Adicionais */}
        <View className="bg-yellow-50 rounded-xl p-4 mt-6">
          <Text className="text-yellow-800 font-semibold mb-2">Informações importantes:</Text>
          <Text className="text-yellow-700 text-sm leading-5">
            • Você receberá uma notificação quando seu pedido estiver pronto{'\n'}
            • Mantenha seu celular por perto para receber atualizações{'\n'}
            • Em caso de dúvidas, entre em contato conosco
          </Text>
        </View>
      </ScrollView>

      {/* Footer com botão para voltar ao início */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="w-full h-14 rounded-full bg-gray-100 items-center justify-center shadow-md flex-row gap-2"
        >
          <Home size={20} color="#503B36" />
          <Text className="text-background font-bold text-lg">Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}