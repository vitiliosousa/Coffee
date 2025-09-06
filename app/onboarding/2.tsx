import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { ChevronRight, Heart } from "lucide-react-native";
import Dots from "@/components/Dots";

export default function Onboarding2() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-row items-center">
        <View className="flex-1" />
        <View className="flex-1 items-center">
          <View className="items-center">
            <Dots />
          </View>
        </View>
        <View className="flex-1 items-end">
          <Link href="/login" className="text-gray-400">
            Pular
          </Link>
        </View>
      </View>
      <View className="flex-1 items-center justify-center gap-6">
        <View className="flex rounded-3xl items-center justify-center bg-pink-500 p-10">
          <Heart color={"#FFFFFF"} size={90} />
        </View>
        <Text className="text-4xl font-bold text-center mb-3">
          Personalizado só para si
        </Text>
        <Text className="text-center text-xl text-gray-600 px-4">
          Defina as suas preferências e obtenha recomendações personalizadas,
          ofertas exclusivas em e recompensas que correspondem ao seu gosto.
        </Text>
        <View className="flex-row gap-3 mt-8">
          <View className="w-3 h-3 rounded-full bg-gray-300" />
          <View className="w-10 h-3 rounded-full bg-pink-500" />
          <View className="w-3 h-3 rounded-full bg-gray-300" />
        </View>
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={() => router.push("/onboarding/3")}
          className="w-14 h-14 rounded-full bg-pink-500 items-center justify-center"
        >
          <ChevronRight size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
