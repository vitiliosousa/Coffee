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
        <View className="border-1 border-gray-200 rounded-lg p-4 mb-4 flex-row justify-between items-center gap-4">
          <View className="bg-blue-300 rounded-full p-3">
            <Coffee size={32} color={"#3b82f6"} />
          </View>
          <View className="flex-1 mb-4 space-y-2 gap-2">
            <Text className="text-lg font-bold">
              Bem vindo!
            </Text>
            <Text className="text-gray-600">
              Esperamos que esteja a desfrutar da experiencia.
            </Text>
            <Text className="text-xs">20m</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
