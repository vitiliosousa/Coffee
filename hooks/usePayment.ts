import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService, AccountInfoResponse } from "@/services/auth.service";
import { 
  orderService,
  OrderType as ApiOrderType,
  PaymentMethod as ApiPaymentMethod,
  Terminal 
} from "@/services/order.service";

export type OrderType = 'drive-thru' | 'delivery';

export interface CartItem {
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

export interface OrderData {
  orderType: OrderType;
  deliveryAddress: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  items: CartItem[];
}

export function usePayment(initialParams: Record<string, any>) {
  const [orderData, setOrderData] = useState<OrderData>({
    orderType: 'delivery',
    deliveryAddress: '',
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
    items: []
  });

  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Saldo do usuário
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

  // Processar dados vindos do carrinho
  useEffect(() => {
    const itemCount = parseInt(initialParams.itemCount as string) || 0;
    const items: CartItem[] = [];

    for (let i = 0; i < itemCount; i++) {
      if (!initialParams[`item${i}_productId`] || !initialParams[`item${i}_productName`]) continue;

      items.push({
        id: initialParams[`item${i}_id`] || '',
        productId: initialParams[`item${i}_productId`],
        productName: initialParams[`item${i}_productName`],
        productDescription: initialParams[`item${i}_productDescription`] || '',
        productImage: initialParams[`item${i}_productImage`] || 'https://via.placeholder.com/80',
        basePrice: parseFloat(initialParams[`item${i}_basePrice`] || 0),
        variantId: initialParams[`item${i}_variantId`] || undefined,
        variantName: initialParams[`item${i}_variantName`] || undefined,
        variantPriceAdjustment: parseFloat(initialParams[`item${i}_variantPriceAdjustment`] || 0),
        quantity: parseInt(initialParams[`item${i}_quantity`] || 1),
        finalPrice: parseFloat(initialParams[`item${i}_finalPrice`] || 0)
      });
    }

    setOrderData({
      orderType: initialParams.orderType || 'delivery',
      deliveryAddress: initialParams.deliveryAddress || '',
      subtotal: parseFloat(initialParams.subtotal) || 0,
      discount: parseFloat(initialParams.discount) || 0,
      deliveryFee: parseFloat(initialParams.deliveryFee) || 0,
      total: parseFloat(initialParams.total) || 0,
      items
    });
  }, [initialParams]);

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
    if (orderData.total <= 0) {
      Alert.alert("Erro", "O valor total do pedido deve ser maior que zero.");
      return;
    }

    setProcessing(true);

    try {
      const orderItems = orderData.items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.finalPrice > 0 ? item.finalPrice : item.basePrice,
        total_price: (item.finalPrice > 0 ? item.finalPrice : item.basePrice) * item.quantity
      }));

      const createOrderRequest = {
        type: mapOrderType(orderData.orderType),
        payment_method: ApiPaymentMethod.WALLET,
        terminal: Terminal.APP,
        delivery_address: orderData.deliveryAddress || undefined,
        items: orderItems
      };

      const response: any = await orderService.createOrder(createOrderRequest);

      const isSuccess = response.success === true || response.status === "success";

      if (isSuccess && response.data) {
        await AsyncStorage.removeItem('cartItems');
        return response.data; // Retorna dados do pedido
      } else {
        throw new Error(response.message || "Falha ao criar pedido.");
      }
    } catch (error: any) {
      let errorMessage = error.message || "Não foi possível processar o pedido.";
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      Alert.alert("Erro no pagamento", errorMessage);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return {
    orderData,
    availableBalance,
    hasSufficientBalance,
    loading,
    processing,
    handlePayment
  };
}
