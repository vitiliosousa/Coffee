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
import { ChevronLeft, Minus, Plus, Square } from "lucide-react-native";
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
        setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
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
        const response = await adminService.listProducts(selectedCategory || undefined);
        setProducts(Array.isArray(response.data.products) ? response.data.products : []);
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
          <Link href={"/menu"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
            <Text className="text-white text-2xl font-bold">Detail</Text>
        </View>
      </View>
      <ScrollView className="flex-1 p-6 bg-white">
            <View className="flex-1 items-center justify-center mt-10">
                <Image source={{uri:"https://www.royalcupcoffee.com/sites/default/files/images/blog/AdobeStock_159183621update.jpg"}} className="h-72 w-72 rounded-full" />
            </View>
            <View className="flex-1 items-center justify-center mt-10 gap-3">
                <Text className="text-4xl font-bold">Classico Espresso</Text>
                <Text className="text-xl text-gray-500">Rich espresso with velvety foam</Text>
                <Text className="text-4xl font-bold text-background">$4.50</Text>
            </View>
            <Text className="text-2xl font-bold mt-10 mb-10">Size Options</Text>
            <View className="flex-row justify-between gap-2">
                <View className="flex-1 items-center justify-center gap-2 p-3 border-2 border-gray-300 bg-background text-white rounded-xl">
                    <Square size={40} strokeWidth={1}/>
                    <Text className="text-lg">short</Text>
                    <Text className="text-lg">250 ml</Text>
                </View>
                <View className="flex-1 items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-xl">
                    <Square size={40} strokeWidth={1}/>
                    <Text className="text-lg">Tall</Text>
                    <Text className="text-lg">354 ml</Text>
                </View>
                <View className="flex-1 items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-xl">
                    <Square size={40} strokeWidth={1}/>
                    <Text className=" text-lg">Grande</Text>
                    <Text className=" text-lg">473 ml</Text>
                </View>
                <View className="flex-1 items-center justify-center gap-2 p-3 border-2 border-gray-300 rounded-xl">
                    <Square size={40}  strokeWidth={1}/>
                    <Text className="text-lg">Venti</Text>
                    <Text className="text-lg">591 ml</Text>
                </View>
            </View>
            <Text className="text-2xl font-bold mt-10 mb-10">Choice of Espresso</Text>
            <View className="flex-1 gap-2">
                <Text>Select any one</Text>
                <View className="border border-gray-300 flex-row justify-between items-center p-4 rounded-xl mt-3">
                    <Text className="text-lg">Extra Short</Text>
                    <Text className="font-bold text-lg text-background">$2.25</Text>
                </View>
                <View className="border border-gray-300 flex-row justify-between items-center p-4 rounded-xl mt-3">
                    <Text className="text-lg">Extra Short</Text>
                    <Text className="text-lg">$2.25</Text>
                </View>
            </View>
            <View className="flex-row justify-center items-center mt-10 mb-10 gap-4">
                <View className="border border-background rounded-full p-5">
                    <Minus size={20} color="#503B36" />
                </View>
                <Text className="text-3xl">1</Text>
                <View className="border border-background rounded-full p-5">
                    <Plus size={20} color="#503B36" />
                </View>
            </View>
      </ScrollView>
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
