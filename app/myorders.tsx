import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  Truck,
  MapPin,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
} from "lucide-react-native";
import { orderService, Order, OrderStatus, OrderType } from "@/services/order.service";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.searchOrders({});
      
      if (response.success && Array.isArray(response.data)) {
        // Ordenar por data de criação (mais recente primeiro)
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
      } else {
        console.warn("Estrutura de resposta inesperada:", response);
        setOrders([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar pedidos:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar os pedidos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case OrderStatus.PREPARING:
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Package };
      case OrderStatus.READY:
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case OrderStatus.OUT_FOR_DELIVERY:
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck };
      case OrderStatus.DELIVERED:
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case OrderStatus.COMPLETED:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle };
      case OrderStatus.CANCELLED:
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendente';
      case OrderStatus.PREPARING:
        return 'Preparando';
      case OrderStatus.READY:
        return 'Pronto';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'Saiu para Entrega';
      case OrderStatus.DELIVERED:
        return 'Entregue';
      case OrderStatus.COMPLETED:
        return 'Concluído';
      case OrderStatus.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getOrderTypeIcon = (type: OrderType) => {
    switch (type) {
      case OrderType.DELIVERY:
        return { icon: Truck, color: '#3b82f6', text: 'Entrega' };
      case OrderType.DRIVE_THRU:
        return { icon: Truck, color: '#8b5cf6', text: 'Drive-Thru' };
      case OrderType.DINE_IN:
        return { icon: MapPin, color: '#10b981', text: 'Mesa' };
      default:
        return { icon: Package, color: '#6b7280', text: 'Pedido' };
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'wallet':
        return 'Carteira';
      case 'pos':
        return 'Cartão/POS';
      default:
        return method;
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  const renderOrderCard = (order: Order) => {
    const statusConfig = getStatusColor(order.status);
    const typeConfig = getOrderTypeIcon(order.type);
    const StatusIcon = statusConfig.icon;
    const TypeIcon = typeConfig.icon;

    return (
      <TouchableOpacity
        key={order.id}
        onPress={() => handleOrderPress(order.id)}
        className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm"
      >
        {/* Header - Número do Pedido e Status */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <TypeIcon size={20} color={typeConfig.color} />
            <Text className="text-lg font-bold text-gray-900">
              Pedido #{order.id.substring(0, 8).toUpperCase()}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${statusConfig.bg}`}>
            <Text className={`text-xs font-semibold ${statusConfig.text}`}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>

        {/* Detalhes do Pedido */}
        <View className="gap-2 mb-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Data</Text>
            <Text className="text-gray-900 font-medium">
              {formatDate(order.created_at)} às {formatTime(order.created_at)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Tipo</Text>
            <Text className="text-gray-900 font-medium">{typeConfig.text}</Text>
          </View>

          {order.delivery_address && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Endereço</Text>
              <Text className="text-gray-900 font-medium text-right flex-1 ml-2" numberOfLines={1}>
                {order.delivery_address}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between">
            <Text className="text-gray-600">Pagamento</Text>
            <Text className="text-gray-900 font-medium">
              {getPaymentMethodText(order.payment_method)}
            </Text>
          </View>
        </View>

        {/* Itens do Pedido */}
        <View className="border-t border-gray-100 pt-3">
          <Text className="text-gray-600 text-sm mb-2">Itens:</Text>
          {order.order_items && order.order_items.slice(0, 2).map((item, index) => (
            <View key={item.id} className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                {item.quantity}x {item.product?.name || 'Produto'}
              </Text>
              <Text className="text-gray-600 text-sm">
                {formatCurrency(item.total_price)}
              </Text>
            </View>
          ))}
          {order.order_items && order.order_items.length > 2 && (
            <Text className="text-gray-500 text-xs mt-1">
              +{order.order_items.length - 2} outros itens
            </Text>
          )}
        </View>

        {/* Footer - Total e Status Icon */}
        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <View className="flex-row items-center gap-2">
            <StatusIcon size={16} color={statusConfig.text} />
            <Text className={`text-sm font-medium ${statusConfig.text}`}>
              {getStatusText(order.status)}
            </Text>
          </View>
          <Text className="text-lg font-bold text-background">
            {formatCurrency(order.total_amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-background p-6 gap-6">
          <View className="flex-row gap-4 items-center">
            <Link href={"/home"}>
              <ChevronLeft size={24} color={"#FFFFFF"} />
            </Link>
            <Text className="text-white text-2xl font-bold">Meus Pedidos</Text>
          </View>
        </View>
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#503B36" />
          <Text className="text-lg mt-4 text-gray-600">Carregando pedidos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Meus Pedidos</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView 
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#503B36"]}
            tintColor="#503B36"
          />
        }
      >
        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Package size={60} color="#BCA9A1" />
            <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
              Nenhum pedido encontrado
            </Text>
            <Text className="text-gray-500 text-center mt-2 mb-6">
              Você ainda não fez nenhum pedido.{'\n'}Faça seu primeiro pedido!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/menu")}
              className="bg-background px-8 py-4 rounded-full"
            >
              <Text className="text-white font-semibold text-lg">Ver Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-600">
                {orders.length} {orders.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
              </Text>
              <TouchableOpacity onPress={handleRefresh} className="p-2">
                <Text className="text-background font-semibold">Atualizar</Text>
              </TouchableOpacity>
            </View>

            {orders.map(renderOrderCard)}

            <View className="mt-6 bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-600 text-sm text-center">
                Arraste para baixo para atualizar a lista de pedidos
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Adicione o import do RefreshControl no topo do arquivo
import { RefreshControl } from "react-native";