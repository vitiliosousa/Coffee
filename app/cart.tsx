import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Truck, MapPin, X, Plus, Minus } from "lucide-react-native";
import { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function Cart() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Carregar itens do AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('cartItems');
        if (stored) setItems(JSON.parse(stored));
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
      }
    };
    loadCart();
  }, []);

  // Salvar carrinho no AsyncStorage sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Carregar dados vindos do MenuDetails
  useEffect(() => {
    if (params.productId && params.productName) {
      const newItem: CartItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productId: params.productId as string,
        productName: params.productName as string,
        productDescription: (params.productDescription as string) || 'Sem descrição',
        productImage: (params.productImage as string) || 'https://via.placeholder.com/80',
        basePrice: parseFloat(params.basePrice as string) || 0,
        variantId: (params.variantId as string) === '' ? undefined : (params.variantId as string),
        variantName: (params.variantName as string) === '' ? undefined : (params.variantName as string),
        variantPriceAdjustment: parseFloat(params.variantPriceAdjustment as string) || 0,
        quantity: parseInt(params.quantity as string) || 1,
        finalPrice: parseFloat(params.finalPrice as string) || 0,
      };

      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          return updatedItems;
        } else {
          return [...prevItems, newItem];
        }
      });
    }
  }, [params.productId, params.productName]);

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    Alert.alert(
      "Remover item",
      `Deseja remover ${itemName} do carrinho?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => removeItem(itemId), style: "destructive" }
      ]
    );
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
  };

  const getDiscount = () => 0;

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscount();
    const deliveryFee = selectedOrderType === 'delivery' ? 2.50 : 0;
    
    return subtotal - discount + deliveryFee;
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione alguns itens ao carrinho primeiro.");
      return;
    }

    if (selectedOrderType === 'delivery' && deliveryAddress.trim() === '') {
      Alert.alert("Endereço necessário", "Por favor, insira o endereço de entrega.");
      return;
    }

    const deliveryFee = selectedOrderType === 'delivery' ? 2.50 : 0;
    const finalTotal = getTotal();

    const itemsData = items.map((item, index) => ({
      [`item${index}_id`]: item.id,
      [`item${index}_productId`]: item.productId,
      [`item${index}_productName`]: item.productName,
      [`item${index}_productDescription`]: item.productDescription,
      [`item${index}_productImage`]: item.productImage,
      [`item${index}_basePrice`]: item.basePrice.toString(),
      [`item${index}_variantId`]: item.variantId || '',
      [`item${index}_variantName`]: item.variantName || '',
      [`item${index}_variantPriceAdjustment`]: item.variantPriceAdjustment.toString(),
      [`item${index}_quantity`]: item.quantity.toString(),
      [`item${index}_finalPrice`]: item.finalPrice.toString(),
    })).reduce((acc, item) => ({ ...acc, ...item }), {});

    const paymentData = {
      orderType: selectedOrderType,
      deliveryAddress: deliveryAddress || '',
      subtotal: getSubtotal().toFixed(2),
      discount: getDiscount().toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: finalTotal.toFixed(2),
      itemCount: items.length.toString(),
      ...itemsData
    };

    router.push({
      pathname: "/payment",
      params: paymentData
    });
  };

  const applyPromoCode = () => {
    Alert.alert("Pontos de desconto", "Funcionalidade em desenvolvimento");
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-background p-6 gap-6">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={"#FFFFFF"} />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Carrinho</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-2xl font-bold text-gray-400 mb-4">Carrinho vazio</Text>
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="bg-background px-8 py-4 rounded-full"
          >
            <Text className="text-white font-semibold text-lg">Ver Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Carrinho ({items.length})</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 flex-1 bg-[#FFF9EC]">
          <Text className="text-lg font-semibold mb-2">Tipo de Pedido</Text>
          <View className="flex-row gap-2 justify-between">
            <TouchableOpacity
              onPress={() => setSelectedOrderType('drive-thru')}
              className={`flex-1 flex-row gap-2 px-4 py-3 rounded-full items-center justify-center ${
                selectedOrderType === 'drive-thru' ? 'bg-background' : 'border border-gray-300'
              }`}
            >
              <Truck size={20} color={selectedOrderType === 'drive-thru' ? "#FFFFFF" : "#000000"} />
              <Text className={selectedOrderType === 'drive-thru' ? "text-white" : ""}>
                Drive-Thru
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOrderType('delivery')}
              className={`flex-1 flex-row gap-2 px-4 py-3 rounded-full items-center justify-center ${
                selectedOrderType === 'delivery' ? 'bg-background' : 'border border-gray-300'
              }`}
            >
              <MapPin size={20} color={selectedOrderType === 'delivery' ? "#FFFFFF" : "#000000"} />
              <Text className={selectedOrderType === 'delivery' ? "text-white" : ""}>
                Delivery
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedOrderType === 'delivery' && (
          <View className="bg-blue-50 p-6">
            <Text className="text-lg font-semibold mb-2">Endereço de Entrega</Text>
            <TextInput
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Insira seu endereço completo..."
              multiline
              numberOfLines={2}
              className="border border-gray-300 bg-white rounded-lg p-3 text-base"
            />
            <Text className="text-sm text-gray-600 mt-1">
              Rua, número, bairro e ponto de referência
            </Text>
          </View>
        )}

        <View className="p-6">
          <Text className="text-lg font-semibold mb-4">Seus itens</Text>
          {items.map((item) => (
            <View key={item.id} className="mb-4 p-4 rounded-xl flex-row border items-center">
              <Image 
                source={{ uri: item.productImage || "https://via.placeholder.com/80" }}
                className="w-20 h-20 rounded-xl"
              />
              <View className="flex-1 p-2 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xl font-semibold">{item.productName}</Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id, item.productName)}>
                    <X size={20}/>
                  </TouchableOpacity>
                </View>
                <Text className="text-lg text-gray-600">{item.productDescription}</Text>
                {item.variantName && (
                  <Text className="text-sm text-gray-500">Variante: {item.variantName}</Text>
                )}
                <View className="flex-row justify-between">
                  <Text className="text-background text-lg font-semibold">
                    ${(item.finalPrice * item.quantity).toFixed(2)}
                  </Text>
                  <View className="flex-row gap-4 items-center">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border px-3 py-1 items-center rounded-full justify-center"
                    >
                      <Minus size={10}/>
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border px-3 py-1 items-center rounded-full justify-center"
                    >
                      <Plus size={10}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className="p-6 gap-3 bg-gray-50 rounded-xl mx-6 mb-6">
          <Text className="text-lg font-semibold mb-2">Resumo do Pedido</Text>
          <View className="flex-row justify-between">
            <Text>Subtotal</Text>
            <Text>${getSubtotal().toFixed(2)}</Text>
          </View>
          {selectedOrderType === 'delivery' && (
            <View className="flex-row justify-between">
              <Text>Taxa de Entrega</Text>
              <Text>$2.50</Text>
            </View>
          )}
          <View className="border-t border-gray-300 pt-2 mt-1">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold text-background">
                ${getTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={handleProceedToPayment}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">
            Pagar ${getTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}