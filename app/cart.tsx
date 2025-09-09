import CalendarPicker from "@/components/CalendarPicker";
import DotsWhite from "@/components/DotsWhite";
import { reservationService } from "@/services/reservation.service";
import { Link, useRouter } from "expo-router";
import { ChevronLeft, Clock, Truck, MapPin, X, Plus, Minus} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";

export default function Cart() {
  // Função auxiliar para formatar o tempo exibido

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
          <Text className="text-white text-2xl font-bold">Carinho</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6 flex-1 bg-[#FFF9EC]">
          <Text className="text-lg font-semibold mb-2">Tipo de Pedido</Text>
          <View className="flex-row gap-2 justify-between">
            <View className="bg-background flex-row gap-4 px-4 py-3 rounded-full">
              <Clock size={20} color={"#FFFFFF"} />
              <Text className="text-white">Dine-In</Text>
            </View>
            <View className="flex-row gap-4 px-4 py-3 rounded-full border">
              <Truck size={20} color={"#000000"} />
              <Text className="">Drive-Thru</Text>
            </View>
            <View className="flex-row gap-4 px-4 py-3 rounded-full border">
              <MapPin size={20} color={"#000000"} />
              <Text>Delivery</Text>
            </View>
          </View>
        </View>

        <View className="bg-[#F0FDF4] p-6">
          <Text className="text-lg font-semibold mb-2">Selecionar Mesa</Text>
          <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
            {[...Array(8).keys()].map((i) => {
              const num = i + 1;
              return (
                <TouchableOpacity
                  key={num}
                  className={`w-[80px] h-12 rounded-lg items-center justify-center border`}
                >
                  <Text className={`font-semibold`}>{num}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text>Selecione a sua mesa preferida</Text>
        </View>
        <View className="m-6 p-4 rounded-xl flex-row border items-center">
            <Image 
            source={require("../assets/images/coffee.jpeg")}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1 p-2 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-xl font-semibold">Iced Americano</Text>
                <X size={20}/>
              </View>
              <Text className="text-lg">Creamy blend of espresso, steamed milk</Text>
              <View className="flex-row justify-between">
                <Text className="text-background text-lg font-semibold">$30.00</Text>
                <View className="flex-row gap-4 items-center justify-center p-2">
                  <View className="border flex-1 items-center rounded-full justify-center p-2">
                    <Minus size={15}/>
                  </View>
                  <Text>1</Text>
                  <View className="border flex-1 items-center rounded-full justify-center p-2">
                    <Plus size={15}/>
                  </View>
                </View>
              </View>
            </View>
        </View>
        <View className="flex-row gap-2">
          <TextInput
            placeholder="Insira o seu email"
            keyboardType="default"
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
          <TouchableOpacity className="bg-background">
            <Text>Apply</Text>
          </TouchableOpacity>
        </View>
        <View className="p-6 m-6 gap-4 bg-zinc-300">
            <View className="flex-row justify-between">
              <Text>Subtotal</Text>
              <Text>$30.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Taxes</Text>
              <Text>$5.53</Text>
            </View>
            <View className="flex-row justify-between">
              <Text>Discount</Text>
              <Text>$0.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xl font-bold">Subtotal</Text>
              <Text className="text-xl font-bold">$30.00</Text>
            </View>
        </View>


      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md">
            <Text className="text-white font-bold text-lg">
              Proceed to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
