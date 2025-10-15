import { ChevronLeft } from "lucide-react-native";
import { Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Coffee } from "lucide-react-native";

export default function Notifications() {
  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Notificações</Text>
        </View>
      </View>
      <ScrollView className="flex-1 p-6">
        <View className="border-1 border-gray-200 rounded-lg p-4 mb-4 flex-row justify-between items-center">
          <View className="bg-blue-300 rounded-full p-2">
            <Coffee size={32} color={"#3b82f6"} />
          </View>
          <View className="flex-1 mb-4 space-y-2">
            <Text className="text-lg font-bold">
              Seu pedido está a caminho!
            </Text>
            <Text className="text-gray-600">
              O pedido #1234 está a caminho e deve chegar em 30 minutos.
            </Text>
            <Text className="text-xs">20m</Text>
          </View>
        </View>
        <View className="border-gray-600 rounded-lg p-4 mb-4 flex-row justify-between items-center">
          <View className="bg-blue-300 rounded-full p-2">
            <Coffee size={32} color={"#3b82f6"} />
          </View>
          <View className="flex-1 mx-4">
            <Text className="text-lg font-bold">
              Seu pedido está a caminho!
            </Text>
            <Text className="text-gray-600">
              O pedido #1234 está a caminho e deve chegar em 30 minutos.
            </Text>
            <Text className="text-xs">20m</Text>
          </View>
        </View>
        <View className="border-1 border-gray-200 rounded-lg p-4 mb-4 flex-row justify-between items-center">
          <View className="bg-blue-300 rounded-full p-2">
            <Coffee size={32} color={"#3b82f6"} />
          </View>
          <View className="flex-1 mx-4">
            <Text className="text-lg font-bold">
              Seu pedido está a caminho!
            </Text>
            <Text className="text-gray-600">
              O pedido #1234 está a caminho e deve chegar em 30 minutos.
            </Text>
            <Text className="text-xs">20m</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
