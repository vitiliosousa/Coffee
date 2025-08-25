import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { adminService, Category, Product } from "@/services/admin.service";

export default function Menu() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminService.listCategories();
        setCategories(
          Array.isArray(response.data.categories)
            ? response.data.categories
            : []
        );
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Buscar produtos (por categoria se selecionada)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await adminService.listProducts(
          selectedCategory || undefined
        );
        setProducts(
          Array.isArray(response.data.products) ? response.data.products : []
        );
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <View className="flex-1 bg-white">
      {/* Top Header */}
      <View className="bg-background p-6 gap-6">
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <View>
            <Text className="text-white text-2xl font-bold">Our Cafe Menu</Text>
            <Text className="text-gray-400">
              Crafted with love, served with passion
            </Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View className="bg-gray-200">
        {loadingCategories ? (
          <ActivityIndicator size="small" color="#503B36" className="p-4" />
        ) : (
          <ScrollView
            horizontal
            className="p-6 gap-4 flex-row"
            showsHorizontalScrollIndicator={false}
          >
            {/* Botão All */}
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              className={`px-4 py-2 mr-3 rounded-full ${
                selectedCategory === null ? "bg-background" : "bg-white"
              }`}
            >
              <Text
                className={`${
                  selectedCategory === null ? "text-white" : "text-gray-700"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
                className={`px-4 py-2 mr-3 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-background"
                    : "bg-white"
                }`}
              >
                <Text
                  className={`${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Product List */}
      <ScrollView className="flex-1 p-6 bg-white">
        {loadingProducts ? (
          <ActivityIndicator size="large" color="#503B36" className="mt-10" />
        ) : products.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No products found
          </Text>
        ) : (
          products.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/menu/[id]",
                  params: { id: item.id },
                })
              }
            >
              <View className="flex-row items-center mb-6 bg-white p-4 border border-gray-200 rounded-xl gap-4 shadow-sm">
                <Image
                  source={{
                    uri: item.image_url || "https://via.placeholder.com/100",
                  }}
                  className="w-20 h-20 rounded-xl mr-4"
                />
                <View className="flex-1 gap-2">
                  <Text className="text-lg font-bold text-background">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 text-sm" numberOfLines={2}>
                    {item.description || "No description available"}
                  </Text>
                  <Text className="text-xs text-gray-400 italic">
                    {item.category?.name || "Uncategorized"}
                  </Text>
                  <Text className="text-background text-xl font-semibold mt-1">
                    $
                    {typeof item.price === "number"
                      ? item.price.toFixed(2)
                      : item.price}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
