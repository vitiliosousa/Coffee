import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Minus, Plus, Square } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { adminService, Product } from "@/services/admin.service";

export default function MenuDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // pega o id do produto da rota
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await adminService.getProductById(id as string);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Detail</Text>
        </View>
      </View>

      {/* Conteúdo do produto */}
      <ScrollView className="flex-1 p-6 bg-white">
        <View className="flex-1 items-center justify-center mt-10">
          <Image
            source={{ uri: product.image_url || "https://via.placeholder.com/300" }}
            className="h-72 w-72 rounded-full"
          />
        </View>

        <View className="flex-1 items-center justify-center mt-10 gap-3">
          <Text className="text-4xl font-bold">{product.name}</Text>
          <Text className="text-xl text-gray-500">{product.description}</Text>
          <Text className="text-4xl font-bold text-background">
            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
          </Text>
        </View>

        {/* Aqui você pode renderizar opções adicionais dinamicamente se existir */}
        {/* Por exemplo size options */}
      </ScrollView>

      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
