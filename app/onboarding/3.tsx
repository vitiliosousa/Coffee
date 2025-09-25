import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { ChevronRight, Smartphone } from "lucide-react-native";

export default function Onboarding3() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-6">
      <View className="flex-row items-center">
        <View className="flex-1" />
        <View className="flex-1 items-end">
          <Link href="/login" className="text-gray-400">
            Pular
          </Link>
        </View>
      </View>
      <View className="flex-1 items-center justify-center gap-6">
        <View className="flex rounded-3xl items-center justify-center bg-blue-500 p-10">
          <Smartphone color={"#FFFFFF"} size={90} />
        </View>
        <Text className="text-4xl font-bold text-center mb-3">
          Encomende com facilidade
        </Text>
        <Text className="text-center text-xl text-gray-600 px-4">
          Navegue pelo nosso menu, personalize as suas bebidas e faça os seus
          pedidos sem esforço. Evite a fila e desfrute do seu café.
        </Text>
        <View className="flex-row gap-3 mt-8">
          <View className="w-3 h-3 rounded-full bg-gray-300" />
          <View className="w-3 h-3 rounded-full bg-gray-300" />
          <View className="w-10 h-3 rounded-full bg-blue-500" />
        </View>
      </View>
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center"
        >
          <ChevronRight size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
