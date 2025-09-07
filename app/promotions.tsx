import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Calendar } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { authService } from "@/services/auth.service";

export default function Promotions() {
  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Promoções</Text>
        </View>
      </View>
      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 p-6">
        <View className="flex-1 bg-fundoescuro rounded-xl">
          <View className="flex-row gap-2">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-40 h-40 rounded-xl"
            />
            <View className="flex-1 p-4 gap-2">
              <Text className="text-xl font-semibold">
                Summer Chill - 20% Off Iced Drinks
              </Text>
              <Text>
                Beat the heat with 20% off all iced coffees and frappés.
              </Text>
              <View className="flex-row gap-1">
                <Calendar size={18} color="#503B36" />
                <Text>Valid until 2025-07-31</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="flex-1 bg-background items-center justify-center p-4 rounded-b-xl">
            <Text className="text-white">Avail Offer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 bg-fundoescuro rounded-xl mt-6">
          <View className="flex-row gap-2">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-40 h-40 rounded-xl"
            />
            <View className="flex-1 p-4 gap-2">
              <Text className="text-xl font-semibold">Snack Attack Combo</Text>
              <Text>Buy any coffee and get a muffin for half price.</Text>
              <View className="flex-row gap-1">
                <Calendar size={18} color="#503B36" />
                <Text>Valid until 2025-07-31</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="flex-1 bg-background items-center justify-center p-4 rounded-b-xl">
            <Text className="text-white">Avail Offer</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 bg-fundoescuro rounded-xl mt-6">
          <View className="flex-row gap-2">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-40 h-40 rounded-xl"
            />
            <View className="flex-1 p-4 gap-2">
              <Text className="text-xl font-semibold">
                Double Points Weekend
              </Text>
              <Text>Earn 2x loyalty points on purchases made this weekend</Text>
              <View className="flex-row gap-1">
                <Calendar size={18} color="#503B36" />
                <Text>Valid until 2025-07-31</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="flex-1 bg-background items-center justify-center p-4 rounded-b-xl">
            <Text className="text-white">Avail Offer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
