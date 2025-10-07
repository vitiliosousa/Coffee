import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Clock,
  CreditCard,
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
import { authService, AccountInfoResponse } from "@/services/auth.service";
import { 
  orderService, 
  CreateOrderRequest, 
  OrderItemRequest, 
  OrderType as ApiOrderType,
  PaymentMethod as ApiPaymentMethod,
  Terminal 
} from "@/services/order.service";

type OrderType = 'drive-thru' | 'delivery';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string;
  basePrice: number;
  variantId?: string;
  variantName?: string;
  variantPriceAdjustment: number;
  quantity: number;
  finalPrice: number;
}

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedPaymentMethod] = useState<'balance'>('balance');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // Dados vindos do Cart
  const [orderData, setOrderData] = useState({
    orderType: 'delivery' as OrderType,
    deliveryAddress: '',
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
    items: [] as CartItem[]
  });

  // Buscar saldo da API
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

  // Processar dados vindos do Cart
  useEffect(() => {
    if (params.orderType && params.itemCount) {
      const itemCount = parseInt(params.itemCount as string) || 0;
      const items: CartItem[] = [];

      // Reconstruir itens do carrinho
      for (let i = 0; i < itemCount; i++) {
        if (!params[`item${i}_productId`] || !params[`item${i}_productName`]) {
          console.warn(`Item ${i} está incompleto, pulando...`);
          continue;
        }

        const item: CartItem = {
          id: params[`item${i}_id`] as string || '',
          productId: params[`item${i}_productId`] as string,
          productName: params[`item${i}_productName`] as string,
          productDescription: params[`item${i}_productDescription`] as string || '',
          productImage: params[`item${i}_productImage`] as string || 'https://via.placeholder.com/80',
          basePrice: parseFloat(params[`item${i}_basePrice`] as string) || 0,
          variantId: (params[`item${i}_variantId`] as string) === '' ? undefined : (params[`item${i}_variantId`] as string),
          variantName: (params[`item${i}_variantName`] as string) === '' ? undefined : (params[`item${i}_variantName`] as string),
          variantPriceAdjustment: parseFloat(params[`item${i}_variantPriceAdjustment`] as string) || 0,
          quantity: parseInt(params[`item${i}_quantity`] as string) || 1,
          finalPrice: parseFloat(params[`item${i}_finalPrice`] as string) || 0,
        };
        items.push(item);
      }

      setOrderData({
        orderType: params.orderType as OrderType,
        deliveryAddress: params.deliveryAddress as string || '',
        subtotal: parseFloat(params.subtotal as string) || 0,
        discount: parseFloat(params.discount as string) || 0,
        deliveryFee: parseFloat(params.deliveryFee as string) || 0,
        total: parseFloat(params.total as string) || 0,
        items
      });
    }
  }, [params.orderType, params.itemCount]);

  const hasSufficientBalance = availableBalance >= orderData.total;

  const mapOrderType = (type: OrderType): ApiOrderType => {
    switch (type) {
      case 'drive-thru': return ApiOrderType.DRIVE_THRU;
      case 'delivery': return ApiOrderType.DELIVERY;
      default: return ApiOrderType.DELIVERY;
    }
  };

  const handlePayment = async () => {
    if (orderData.items.length === 0) {
      Alert.alert("Erro", "Nenhum item no pedido!");
      return;
    }

    if (!hasSufficientBalance) {
      Alert.alert("Saldo insuficiente", "Você não tem saldo suficiente para este pedido.");
      return;
    }

    setProcessing(true);

    try {
      // Converter itens do carrinho para formato da API
      const orderItems: OrderItemRequest[] = orderData.items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId || undefined,
        quantity: item.quantity,
        unit_price: item.finalPrice,
        total_price: item.finalPrice * item.quantity
      }));

      // Preparar dados do pedido
      const createOrderRequest: CreateOrderRequest = {
        type: mapOrderType(orderData.orderType),
        payment_method: ApiPaymentMethod.WALLET,
        terminal: Terminal.APP,
        delivery_address: orderData.deliveryAddress && orderData.deliveryAddress !== '' ? orderData.deliveryAddress : undefined,
        items: orderItems
      };

      console.log("Enviando pedido:", JSON.stringify(createOrderRequest, null, 2));

      // Criar pedido na API
      const response = await orderService.createOrder(createOrderRequest);
      
      const isSuccess = response.success === true || response.status === "success";
      
      if (isSuccess && response.data) {
        console.log("Pedido criado com sucesso:", response.data.id);
        
        // Navegar para confirmação com dados do pedido
        router.push({
          pathname: "/order-confirmation",
          params: {
            orderId: response.data.id,
            orderType: orderData.orderType,
            deliveryAddress: orderData.deliveryAddress,
            total: orderData.total.toFixed(2),
            itemCount: orderData.items.length.toString(),
            paymentMethod: "Saldo",
            status: response.data.status,
            createdAt: response.data.created_at
          }
        });
      } else {
        Alert.alert("Erro", response.message || "Falha ao criar pedido. Tente novamente.");
      }

    } catch (error: any) {
      console.error("Erro ao criar pedido:", error);
      Alert.alert(
        "Erro no pagamento", 
        error.message || "Não foi possível processar o pedido. Tente novamente."
      );
    } finally {
      setProcessing(false);
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
              <Text className="text-xl font-semibold">Pedido ({orderData.items.length} itens)</Text>
              <Text className="text-lg">Aguardando pagamento</Text>
              <Text className="text-sm">
                {orderData.orderType === 'delivery' && 'Entrega'}
                {orderData.orderType === 'drive-thru' && 'Drive-Thru'}
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-semibold text-background">
            ${orderData.total.toFixed(2)}
          </Text>
        </View>

        {/* Resumo dos valores */}
        <View className="p-6 m-6 gap-2 bg-gray-50 rounded-xl">
          <Text className="text-lg font-semibold mb-2">Resumo do Pedido</Text>
          <View className="flex-row justify-between">
            <Text>Subtotal</Text>
            <Text>${orderData.subtotal.toFixed(2)}</Text>
          </View>
          {orderData.deliveryFee > 0 && (
            <View className="flex-row justify-between">
              <Text>Taxa de Entrega</Text>
              <Text>${orderData.deliveryFee.toFixed(2)}</Text>
            </View>
          )}
          {orderData.discount > 0 && (
            <View className="flex-row justify-between">
              <Text>Desconto</Text>
              <Text>-${orderData.discount.toFixed(2)}</Text>
            </View>
          )}
          <View className="w-full border-t border-gray-300 my-2"></View>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold">${orderData.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Método de pagamento (apenas saldo) */}
        <View className="flex-1 p-6 gap-4">
          <Text className="font-bold text-2xl">Método de Pagamento</Text>

          <View className="p-4 flex-row border border-background bg-background/10 rounded-xl items-center justify-between">
            <View className="flex flex-row gap-4 items-center">
              <CreditCard size={24} />
              <View>
                <Text className="font-semibold text-xl">Saldo da Carteira</Text>
                <Text className="text-lg text-gray-600">
                  Disponível: ${availableBalance.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              <View className={`px-3 py-1 rounded-full ${
                hasSufficientBalance ? 'bg-green-200' : 'bg-red-200'
              }`}>
                <Text className={`text-sm font-semibold ${
                  hasSufficientBalance ? 'text-green-700' : 'text-red-700'
                }`}>
                  {hasSufficientBalance ? 'Suficiente' : 'Insuficiente'}
                </Text>
              </View>

              <CheckCircle size={20} color="#503B36" />
            </View>
          </View>

          {/* Aviso sobre método único */}
          <View className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Text className="text-blue-800 text-sm text-center">
              💡 Atualmente aceitamos apenas pagamento com saldo da carteira
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={handlePayment}
          disabled={processing || !hasSufficientBalance}
          className={`w-full h-14 rounded-full items-center justify-center shadow-md ${
            processing || !hasSufficientBalance
              ? 'bg-gray-400'
              : 'bg-background'
          }`}
        >
          <Text className="text-white font-bold text-lg">
            {processing ? 'Processando pedido...' : `Finalizar Pedido - $${orderData.total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}