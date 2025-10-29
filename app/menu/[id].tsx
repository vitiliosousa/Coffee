import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react-native";
import { useMenuDetails } from "@/hooks/useMenuDetails";

export default function MenuDetails() {
  const router = useRouter();
  const {
    product,
    variants,
    selectedVariantId,
    setSelectedVariantId,
    quantity,
    setQuantity,
    loading,
    cartItemsCount,
    getFinalPrice,
    handleAddToCart,
  } = useMenuDetails();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#503B36" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Top Header */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center justify-between">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Detalhes</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/cart")} className="relative">
            <ShoppingCart size={24} color="#FFFFFF" />
            {cartItemsCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-background text-xs font-bold">{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-6 bg-white">
        <View className="flex-1 items-center justify-center mt-10">
          <Image source={{ uri: product.image_url || "https://via.placeholder.com/300" }} className="h-72 w-72 rounded-full" />
        </View>

        <View className="flex-1 items-center justify-center mt-10 gap-3">
          <Text className="text-4xl font-bold">{product.name}</Text>
          <Text className="text-xl text-gray-500">{product.description}</Text>
          <Text className="text-4xl font-bold text-background">{getFinalPrice().toFixed(2)} MT</Text>
        </View>

        {variants.length > 0 && (
          <>
            <Text className="text-2xl font-bold mt-10 mb-4">Escolha da variante</Text>
            <View className="flex-1 gap-3">
              {variants.map((variant) => (
                <TouchableOpacity
                  key={variant.id}
                  onPress={() => setSelectedVariantId(variant.id)}
                  className={`border flex-row justify-between items-center p-4 rounded-xl mt-2 ${
                    selectedVariantId === variant.id ? "border-background bg-background" : "border-gray-300"
                  }`}
                >
                  <Text className={`text-lg ${selectedVariantId === variant.id ? "text-white" : "text-gray-700"}`}>
                    {variant.name}
                  </Text>
                  <Text className={`text-lg font-bold ${selectedVariantId === variant.id ? "text-white" : "text-gray-700"}`}>
                    {variant.price_adjustment >= 0 ? "+" : ""}
                    {variant.price_adjustment.toFixed(2)} MT
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View className="flex-row justify-center items-center mt-10 mb-10 gap-4">
          <TouchableOpacity onPress={() => setQuantity((prev) => Math.max(1, prev - 1))} className="border border-background rounded-full p-5">
            <Minus size={20} color="#503B36" />
          </TouchableOpacity>
          <Text className="text-3xl">{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity((prev) => prev + 1)} className="border border-background rounded-full p-5">
            <Plus size={20} color="#503B36" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={() =>
            handleAddToCart(
              () => {
                Alert.alert(
                  "Sucesso!",
                  `${product.name} foi adicionado ao carrinho`,
                  [
                    { text: "Continuar comprando", style: "cancel" },
                    { text: "Ver carrinho", onPress: () => router.push("/cart") },
                  ]
                );
              },
              () => Alert.alert("Erro", "Não foi possível adicionar ao carrinho")
            )
          }
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">
            Adicionar ao Carrinho - {(getFinalPrice() * quantity).toFixed(2)} MT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
