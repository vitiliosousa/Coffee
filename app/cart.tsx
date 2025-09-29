import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Clock, Truck, MapPin, X, Plus, Minus } from "lucide-react-native";
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

type OrderType = 'dine-in' | 'drive-thru' | 'delivery';

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
  const [selectedOrderType, setSelectedOrderType] = useState<OrderType>('dine-in');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Carregar dados vindos do MenuDetails quando a tela for acessada
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

      // Verificar se item já existe no carrinho
      setItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(
          item => item.productId === newItem.productId && item.variantId === newItem.variantId
        );

        if (existingItemIndex >= 0) {
          // Se existe, atualiza a quantidade
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          return updatedItems;
        } else {
          // Se não existe, adiciona novo item
          return [...prevItems, newItem];
        }
      });
    }
  }, [params.productId, params.productName]); // Dependências específicas para evitar loops

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

  const getTaxes = () => {
    return getSubtotal() * 0.15; // 15% de taxa
  };

  const getDiscount = () => {
    return 0; // Por enquanto sem desconto
  };

  const getTotal = () => {
    return getSubtotal() + getTaxes() - getDiscount();
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      Alert.alert("Carrinho vazio", "Adicione alguns itens ao carrinho primeiro.");
      return;
    }

    if (selectedOrderType === 'dine-in' && selectedTable === null) {
      Alert.alert("Mesa não selecionada", "Por favor, selecione uma mesa.");
      return;
    }

    if (selectedOrderType === 'delivery' && deliveryAddress.trim() === '') {
      Alert.alert("Endereço necessário", "Por favor, insira o endereço de entrega.");
      return;
    }

    // Preparar dados para enviar ao Payment
    const deliveryFee = selectedOrderType === 'delivery' ? 2.50 : 0;
    const finalTotal = getTotal() + deliveryFee;

    // Serializar itens do carrinho para passar como parâmetros
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
      // Dados do pedido
      orderType: selectedOrderType,
      tableId: selectedTable?.toString() || '',
      deliveryAddress: deliveryAddress || '',
      
      // Dados financeiros (garantir que são strings válidas)
      subtotal: getSubtotal().toFixed(2),
      taxes: getTaxes().toFixed(2),
      discount: getDiscount().toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      total: finalTotal.toFixed(2),
      
      // Quantidade de itens (para reconstruir no payment)
      itemCount: items.length.toString(),
      
      // Itens serializados
      ...itemsData
    };

    console.log("Enviando para Payment:", {
      orderType: paymentData.orderType,
      itemCount: paymentData.itemCount,
      total: paymentData.total
    });

    router.push({
      pathname: "/payment",
      params: paymentData
    });
  };

  const applyPromoCode = () => {
    Alert.alert("Código promocional", "Funcionalidade em desenvolvimento");
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white">
        {/* HEADER FIXO */}
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
          <Text className="text-lg text-gray-500 text-center mb-8">
            Adicione alguns itens deliciosos ao seu carrinho
          </Text>
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
      {/* HEADER FIXO */}
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
              onPress={() => setSelectedOrderType('dine-in')}
              className={`flex-row gap-4 px-4 py-3 rounded-full ${
                selectedOrderType === 'dine-in' ? 'bg-background' : 'border'
              }`}
            >
              <Clock size={20} color={selectedOrderType === 'dine-in' ? "#FFFFFF" : "#000000"} />
              <Text className={selectedOrderType === 'dine-in' ? "text-white" : ""}>Dine-In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOrderType('drive-thru')}
              className={`flex-row gap-4 px-4 py-3 rounded-full ${
                selectedOrderType === 'drive-thru' ? 'bg-background' : 'border'
              }`}
            >
              <Truck size={20} color={selectedOrderType === 'drive-thru' ? "#FFFFFF" : "#000000"} />
              <Text className={selectedOrderType === 'drive-thru' ? "text-white" : ""}>Drive-Thru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedOrderType('delivery')}
              className={`flex-row gap-4 px-4 py-3 rounded-full ${
                selectedOrderType === 'delivery' ? 'bg-background' : 'border'
              }`}
            >
              <MapPin size={20} color={selectedOrderType === 'delivery' ? "#FFFFFF" : "#000000"} />
              <Text className={selectedOrderType === 'delivery' ? "text-white" : ""}>Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedOrderType === 'dine-in' && (
          <View className="bg-[#F0FDF4] p-6">
            <Text className="text-lg font-semibold mb-2">Selecionar Mesa</Text>
            <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
              {[...Array(8).keys()].map((i) => {
                const num = i + 1;
                return (
                  <TouchableOpacity
                    key={num}
                    onPress={() => setSelectedTable(num)}
                    className={`w-[80px] h-12 rounded-lg items-center justify-center border ${
                      selectedTable === num ? 'bg-background border-background' : 'border-gray-300'
                    }`}
                  >
                    <Text className={`font-semibold ${selectedTable === num ? 'text-white' : ''}`}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text>Selecione a sua mesa preferida</Text>
          </View>
        )}

        {selectedOrderType === 'delivery' && (
          <View className="bg-blue-50 p-6">
            <Text className="text-lg font-semibold mb-4">Endereço de Entrega</Text>
            <TextInput
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Insira seu endereço de entrega"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="border border-gray-300 bg-white rounded-lg p-4 text-base mb-2"
            />
            <Text className="text-sm text-gray-600">
              Inclua rua, número, bairro e pontos de referência
            </Text>
          </View>
        )}

        {/* Lista de itens do carrinho */}
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
                  <View className="flex-row gap-6 mr-4 items-center justify-center">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border px-4 py-2 items-center rounded-full justify-center"
                    >
                      <Minus size={20}/>
                    </TouchableOpacity>
                    <Text className="text-2xl font-semibold">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border px-4 py-2 items-center rounded-full justify-center"
                    >
                      <Plus size={20}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Código promocional */}
        <View className="flex-row gap-2 p-6">
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Insira o código promocional"
            keyboardType="default"
            className="border w-3/4 bg-white border-background rounded-lg px-4 text-lg"
          />
          <TouchableOpacity 
            onPress={applyPromoCode}
            className="bg-background w-full flex-1 items-center justify-center rounded-xl"
          >
            <Text className="text-white">Aplicar</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo do pedido */}
        <View className="p-6 m-6 gap-4 bg-zinc-100 rounded-xl">
          <View className="flex-row justify-between">
            <Text>Subtotal</Text>
            <Text>${getSubtotal().toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Taxas</Text>
            <Text>${getTaxes().toFixed(2)}</Text>
          </View>
          {selectedOrderType === 'delivery' && (
            <View className="flex-row justify-between">
              <Text>Taxa de Entrega</Text>
              <Text>$2.50</Text>
            </View>
          )}
          <View className="flex-row justify-between">
            <Text>Desconto</Text>
            <Text>-${getDiscount().toFixed(2)}</Text>
          </View>
          <View className="w-full border border-gray-300"></View>
          <View className="flex-row justify-between">
            <Text className="text-xl font-bold">Total</Text>
            <Text className="text-xl font-bold">
              ${selectedOrderType === 'delivery' 
                ? (getTotal() + 2.50).toFixed(2) 
                : getTotal().toFixed(2)
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity
            onPress={handleProceedToPayment}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">
              Prosseguir para Pagamento - $
              {selectedOrderType === 'delivery' 
                ? (getTotal() + 2.50).toFixed(2) 
                : getTotal().toFixed(2)
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}