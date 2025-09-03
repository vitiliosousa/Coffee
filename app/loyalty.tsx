import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Gift, Star, Calendar, TrendingUp } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { authService } from "@/services/auth.service";

export default function Loyalty() {
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
          <Text className="text-white text-2xl font-bold">Loyalty Program</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1">
        <View className="bg-fundo p-6">
          <View className="flex-1 items-center gap-2 justify-center shadow-xl bg-white rounded-2xl p-6">
            <View className="bg-orange-100 rounded-full p-5">
              <Star size={40} color="#facc15" />
            </View>
            <Text className="text-3xl font-bold text-black mt-4">
              Your Points
            </Text>
            <Text className="text-5xl font-bold text-background">0</Text>
            <Text className="text-lg text-gray-800">Available to redeem</Text>
          </View>
        </View>
        <View className="p-6 flex-1 gap-6">
          <Text className="text-2xl font-bold text-black">
            Active Campaigns
          </Text>
          <View className="bg-fundo border rounded-2xl p-6 flex-1 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold">
                First Purchase of the Week
              </Text>
              <View className="p-2 bg-green-500 rounded-full">
                <Text className="text-white font-semibold">+50 pts</Text>
              </View>
            </View>
            <Text className="text-lg">
              Earn 50 bonus points on your first purchase this week
            </Text>
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#503B36" />
              <Text>Valid: Monday to Sunday</Text>
            </View>
          </View>
          <View className="bg-fundo border rounded-2xl p-6 flex-1 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold">Happy Hour Cashback</Text>
              <View className="p-2 bg-red-500 rounded-full">
                <Text className="text-white font-semibold">+10%</Text>
              </View>
            </View>
            <Text className="text-lg">
              Get 10% cashback on all orders between 3-5 PM
            </Text>
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#503B36" />
              <Text>Valid: Monday to Sunday</Text>
            </View>
          </View>
          <View className="bg-fundo border rounded-2xl p-6 flex-1 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold">Weekend Warrior</Text>
              <View className="p-2 bg-blue-500 rounded-full">
                <Text className="text-white font-semibold">2x</Text>
              </View>
            </View>
            <Text className="text-lg">Double points on weekend orders</Text>
            <View className="flex-row items-center gap-2">
              <Calendar size={15} color="#503B36" />
              <Text>Valid: Monday to Sunday</Text>
            </View>
          </View>
        </View>
        <View className="p-6 flex-1 gap-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-black">
              Points History
            </Text>
            <Text className="text-xl">View All</Text>
          </View>
          <View className="border rounded-2xl p-6 flex-row items-center justify-between gap-2">
            <View className="bg-blue-100 p-4 rounded-full">
              <TrendingUp size={20} color="#3b82f6" />
            </View>
            <View>
              <Text className="text-xl">Cappuccino Purchase</Text>
              <Text className="text-lg">App Order . 2024-01-15</Text>
            </View>
            <Text className="text-green-600 text-xl font-semibold">+15 pts</Text>
          </View>
          <View className="border rounded-2xl p-6 flex-row items-center justify-between gap-2">
            <View className="bg-green-100 p-4 rounded-full">
              <Gift size={20} color="#16a34a" />
            </View>
            <View>
              <Text className="text-xl">First Purchase Bonus</Text>
              <Text className="text-lg">Campaign . 2024-01-14</Text>
            </View>
            <Text className="text-green-600 text-xl font-semibold">+50 pts</Text>
          </View>
          <View className="border rounded-2xl p-6 flex-row items-center justify-between gap-2">
            <View className="bg-violet-100 p-4 rounded-full">
              <TrendingUp size={20} color="#8b5cf6" />
            </View>
            <View>
              <Text className="text-xl">Cappuccino Purchase</Text>
              <Text className="text-lg">Promotion . 2024-01-13</Text>
            </View>
            <Text className="text-green-600 text-xl font-semibold">+25 pts</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
