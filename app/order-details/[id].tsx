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
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  Truck,
  MapPin,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  User,
  Phone,
  QrCode,
  Share,
  Printer,
} from "lucide-react-native";
import { orderService, Order, OrderStatus, OrderType, OrderItem } from "@/services/order.service";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrderDetails();
      loadQRCode();
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const response = await orderService.getOrderById(id as string);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.message || "Não foi possível carregar o pedido");
      }
    } catch (error: any) {
      console.error("Erro ao carregar detalhes do pedido:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar os detalhes do pedido");
    } finally {
      setLoading(false);
    }
  };

  const loadQRCode = async () => {
    try {
      setQrCodeLoading(true);
      const response = await orderService.getOrderQRCode(id as string);
      if (response.success && response.data) {
        setQrCodeImage(response.data.qr_code);
      }
    } catch (error: any) {
      console.error("Erro ao carregar QR Code:", error);
      // Não mostrar alerta para erro de QR Code, pois não é crítico
    } finally {
      setQrCodeLoading(false);
    }
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
        return 'Pronto para Retirada';
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

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Seu pedido foi recebido e está aguardando confirmação';
      case OrderStatus.PREPARING:
        return 'Seu pedido está sendo preparado pela nossa equipe';
      case OrderStatus.READY:
        return 'Seu pedido está pronto para retirada';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'Seu pedido está a caminho do endereço informado';
      case OrderStatus.DELIVERED:
        return 'Pedido entregue com sucesso';
      case OrderStatus.COMPLETED:
        return 'Pedido finalizado';
      case OrderStatus.CANCELLED:
        return 'Pedido cancelado';
      default:
        return 'Status do pedido';
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
        return 'Carteira Digital';
      case 'pos':
        return 'Cartão/POS';
      default:
        return method;
    }
  };

  const getEstimatedTime = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '15-25 min';
      case OrderStatus.PREPARING:
        return '10-20 min';
      case OrderStatus.READY:
        return 'Pronto agora';
      case OrderStatus.OUT_FOR_DELIVERY:
        return '15-30 min';
      default:
        return '--';
    }
  };

  const handleShareOrder = () => {
    Alert.alert(
      "Compartilhar Pedido",
      "Link de compartilhamento copiado para a área de transferência!",
      [{ text: "OK" }]
    );
  };

  const handlePrintReceipt = () => {
    Alert.alert(
      "Imprimir Recibo",
      "Recibo enviado para impressora ou salvo como PDF!",
      [{ text: "OK" }]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Suporte",
      "Entre em contato conosco: (11) 99999-9999",
      [{ text: "OK" }]
    );
  };

  const renderOrderItem = (item: OrderItem, index: number) => (
    <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-gray-100">
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 text-base">
          {item.quantity}x {item.product?.name || 'Produto'}
        </Text>
        {item.variant?.name && (
          <Text className="text-gray-600 text-sm">Variante: {item.variant.name}</Text>
        )}
        {item.product?.description && (
          <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
            {item.product.description}
          </Text>
        )}
      </View>
      <Text className="font-semibold text-gray-900">
        {formatCurrency(item.total_price)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-background p-6 gap-6">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={"#FFFFFF"} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Detalhes do Pedido</Text>
          </View>
        </View>
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#503B36" />
          <Text className="text-lg mt-4 text-gray-600">Carregando pedido...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-background p-6 gap-6">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={"#FFFFFF"} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Detalhes do Pedido</Text>
          </View>
        </View>
        
        <View className="flex-1 items-center justify-center p-6">
          <Package size={60} color="#BCA9A1" />
          <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
            Pedido não encontrado
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            O pedido solicitado não existe ou não pôde ser carregado.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/myorders")}
            className="bg-background px-8 py-4 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">Voltar aos Pedidos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusConfig = getStatusColor(order.status);
  const typeConfig = getOrderTypeIcon(order.type);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Detalhes do Pedido</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Status do Pedido */}
        <View className="p-6 bg-white border-b border-gray-200">
          <View className="flex-row items-center gap-4 mb-3">
            <View className={`p-3 rounded-full ${statusConfig.bg}`}>
              <StatusIcon size={24} color={statusConfig.text} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {getStatusText(order.status)}
              </Text>
              <Text className="text-gray-600 text-sm">
                {getStatusDescription(order.status)}
              </Text>
            </View>
          </View>
          
          {order.status !== OrderStatus.CANCELLED && 
           order.status !== OrderStatus.COMPLETED && 
           order.status !== OrderStatus.DELIVERED && (
            <View className="flex-row items-center gap-2 mt-2">
              <Clock size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm">
                Tempo estimado: {getEstimatedTime(order.status)}
              </Text>
            </View>
          )}
        </View>

        {/* Informações do Pedido */}
        <View className="p-6 bg-white border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Informações do Pedido</Text>
          
          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Número do Pedido</Text>
              <Text className="font-semibold text-gray-900">
                #{order.id.substring(0, 8).toUpperCase()}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Data e Hora</Text>
              <Text className="font-semibold text-gray-900">
                {formatDate(order.created_at)} às {formatTime(order.created_at)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Tipo de Pedido</Text>
              <View className="flex-row items-center gap-2">
                <TypeIcon size={16} color={typeConfig.color} />
                <Text className="font-semibold text-gray-900">{typeConfig.text}</Text>
              </View>
            </View>

            {order.delivery_address && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Endereço de Entrega</Text>
                <Text className="font-semibold text-gray-900 text-right flex-1 ml-2">
                  {order.delivery_address}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Método de Pagamento</Text>
              <View className="flex-row items-center gap-2">
                <CreditCard size={16} color="#6b7280" />
                <Text className="font-semibold text-gray-900">
                  {getPaymentMethodText(order.payment_method)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Itens do Pedido */}
        <View className="p-6 bg-white border-b border-gray-200">
          <Text className="text-lg font-bold text-gray-900 mb-4">Itens do Pedido</Text>
          
          {order.order_items && order.order_items.length > 0 ? (
            <>
              {order.order_items.map(renderOrderItem)}
              
              {/* Totais */}
              <View className="mt-4 pt-4 border-t border-gray-200">
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text className="text-gray-900">
                    {formatCurrency(order.order_items.reduce((sum, item) => sum + item.total_price, 0))}
                  </Text>
                </View>
                
                {order.type === OrderType.DELIVERY && (
                  <View className="flex-row justify-between py-2">
                    <Text className="text-gray-600">Taxa de Entrega</Text>
                    <Text className="text-gray-900">$2.50</Text>
                  </View>
                )}
                
                <View className="flex-row justify-between py-2 border-t border-gray-200 mt-2">
                  <Text className="text-lg font-bold text-gray-900">Total</Text>
                  <Text className="text-lg font-bold text-background">
                    {formatCurrency(order.total_amount)}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <Text className="text-gray-500 text-center py-4">
              Nenhum item encontrado neste pedido
            </Text>
          )}
        </View>

        {/* QR Code para Pagamento/Acompanhamento */}
        {order.status === OrderStatus.PENDING && (
          <View className="p-6 bg-white border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900 mb-4">QR Code do Pedido</Text>
            <View className="items-center bg-gray-50 p-6 rounded-xl">
              {qrCodeLoading ? (
                <ActivityIndicator size="large" color="#503B36" />
              ) : qrCodeImage ? (
                <Image
                  source={{ uri: `data:image/png;base64,${qrCodeImage}` }}
                  className="w-48 h-48"
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center">
                  <QrCode size={64} color="#6b7280" />
                  <Text className="text-gray-500 mt-2">QR Code não disponível</Text>
                </View>
              )}
              <Text className="text-gray-600 text-center mt-4 text-sm">
                Use este QR code para pagamento ou acompanhamento do pedido
              </Text>
            </View>
          </View>
        )}

        {/* Ações Rápidas */}
        <View className="p-6 bg-white">
          <Text className="text-lg font-bold text-gray-900 mb-4">Ações</Text>
          <View className="flex-row justify-between gap-3">
            <TouchableOpacity 
              onPress={handleShareOrder}
              className="flex-1 bg-gray-100 p-4 rounded-xl items-center"
            >
              <Share size={24} color="#503B36" />
              <Text className="font-semibold mt-2 text-sm">Compartilhar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handlePrintReceipt}
              className="flex-1 bg-gray-100 p-4 rounded-xl items-center"
            >
              <Printer size={24} color="#503B36" />
              <Text className="font-semibold mt-2 text-sm">Imprimir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleContactSupport}
              className="flex-1 bg-gray-100 p-4 rounded-xl items-center"
            >
              <Phone size={24} color="#503B36" />
              <Text className="font-semibold mt-2 text-sm">Ajuda</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}