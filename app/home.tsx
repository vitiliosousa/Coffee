import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter, Link } from "expo-router";
import {
  Calendar,
  Car,
  Coffee,
  ArrowRight,
  Wallet,
  User,
  Menu,
  Star,
  Bell,
} from "lucide-react-native";
import Dots from "@/components/Dots";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-fundo">
      {/* HEADER FIXO */}
      <View className="bg-fundo px-6 pt-6 pb-4">
        <View className="flex-row items-center">
          <View className="flex-1" />
          <View className="flex-1 items-center">
            <View className="items-center">
              <Dots />
            </View>
          </View>
          <View className="flex-1 items-end">
            <Link href="/create-account" className="text-gray-400">
              <Bell size={20} color="#503B36" />
            </Link>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-6 w-full">
          {/* Esquerda */}
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-background rounded-full items-center justify-center">
              <Coffee size={30} color="#FFFFFF" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-600 text-xl">Good Morning ☀️</Text>
              <Text className="text-3xl font-bold text-background">
                Coffee Lover
              </Text>
            </View>
          </View>

          {/* Direita */}
          <View className="flex-row gap-4">
            <Link href="/wallet">
              <Wallet size={20} color="#503B36" />
            </Link>
            <User size={20} color="#503B36" />
          </View>
        </View>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-[40px] gap-5 mb-5">
          <Text className="text-2xl font-bold text-background">
            What would you like to do?
          </Text>
        </View>

        {/* Cards */}
        <View className="flex flex-col gap-5">
          <TouchableOpacity
            onPress={() => router.push("/reservation")}
            className="flex-row gap-4 bg-white p-5 rounded-2xl"
          >
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Calendar size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Book a table
              </Text>
              <Text className="text-gray-400">
                Reserve your perfect spot for a cozy coffee experience
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-4 bg-white p-5 rounded-2xl">
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Car size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Drive-Thru Order
              </Text>
              <Text className="text-gray-400">
                Quick pickup, no waiting in line
              </Text>
            </View>
          </View>

          {/* Menus */}
          <View className="flex-row gap-4 items-center justify-center">
            <TouchableOpacity
            onPress={() => router.push("/menu")}
             className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4">
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Menu />
              </View>
              <Text className="text-background text-lg font-bold">
                Full Menu
              </Text>
            </TouchableOpacity>
            <View className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4">
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Star />
              </View>
              <Text className="text-background text-lg font-bold">Rewards</Text>
            </View>
          </View>

          {/* Special */}
          <View className="bg-background p-8 rounded-2xl gap-4">
            <Text className="text-white font-bold text-2xl">
              ☕ Today's Special
            </Text>
            <Text className="text-gray-300 text-xl">
              Buy any large coffee + get a free croissant 🥐
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="h-14 w-32 justify-center items-center rounded-xl bg-white"
            >
              <Text className="text-background font-bold text-lg">
                View Offer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Favourites */}
        <View className="flex-row justify-between items-center mt-12 mb-6">
          <Text className="text-xl font-bold text-background">
            🔥 Customer Favourites
          </Text>
          <View className="flex-row items-center gap-2">
            <Link href={"/home"}>See all</Link>
            <ArrowRight size={20} color="#503B36" />
          </View>
        </View>

        <View className="flex gap-5 mb-10">
          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-20 h-20 rounded-xl"
            />
            <View>
              <Text className="text-background font-bold text-xl">
                Signature Cappucino
              </Text>
              <Text className="text-gray-400 text-lg">
                Rich espresso with velvety foam
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">$4.50</Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>

          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coldbrew.jpg")}
              className="w-20 h-20 rounded-xl"
            />
            <View>
              <Text className="text-background font-bold text-xl">
                Cold Brew Special
              </Text>
              <Text className="text-gray-400 text-lg">
                Smooth 12-hour cold brew
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">$4.50</Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="flex-row justify-between items-center bg-white p-6 border-t border-gray-300 absolute bottom-0 left-0 right-0">
        <View className="p-4 bg-fundoescuro rounded-full">
          <Coffee size={20} color="#503B36" />
        </View>
        <View className="p-4">
          <Calendar size={20} color="#503B36" />
        </View>
        <View className="bg-background rounded-2xl px-8 py-4 flex-row items-center justify-center gap-2">
          <Menu size={20} color="#FFFFFF" />
          <Text className="text-white text-xl font-bold text-center">
            Order
          </Text>
        </View>
        <View className="p-4">
          <Star size={20} color="#503B36" />
        </View>
        <View className="p-4">
          <User size={20} color="#503B36" />
        </View>
      </View>
    </View>
  );
}
