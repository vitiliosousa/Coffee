import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, Calendar, Clock, Users, X } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";

export default function MyReservation() {
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
          <Text className="text-white text-2xl font-bold">My Reservations</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        <View className="flex-1 bg-background rounded-xl p-6 gap-4 mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Calendar size={20} color={"#FFFFFF"} />
              <Text className="text-white ">20/06/2024</Text>
            </View>
            <View className="p-2 bg-green-200 rounded-full">
              <Text className="text-sm text-green-500">Confirmed</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Clock size={20} color={"#FFFFFF"} />
              <Text className="text-white ">18:30</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Users size={20} color={"#FFFFFF"} />
              <Text className="text-white ">4 People</Text>
            </View>
          </View>
          <View className="flex-row justify-end items-center">
            <TouchableOpacity className="flex-row gap-2 items-center bg-red-500 p-4 rounded-xl">
              <X size={20} color={"#FFFFFF"} />
              <Text className="text-white ">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1 bg-background rounded-xl p-6 gap-4 mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Calendar size={20} color={"#FFFFFF"} />
              <Text className="text-white ">20/06/2024</Text>
            </View>
            <View className="p-2 bg-green-200 rounded-full">
              <Text className="text-sm text-green-500">Confirmed</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Clock size={20} color={"#FFFFFF"} />
              <Text className="text-white ">18:30</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              <Users size={20} color={"#FFFFFF"} />
              <Text className="text-white ">4 People</Text>
            </View>
          </View>
          <View className="flex-row justify-end items-center">
            <TouchableOpacity className="flex-row gap-2 items-center bg-red-500 p-4 rounded-xl">
              <X size={20} color={"#FFFFFF"} />
              <Text className="text-white ">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md">
            <Text className="text-white font-bold text-lg">
              Book New Reservation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
