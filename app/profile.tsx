import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, User } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";

export default function Profile() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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
          <Text className="text-white text-2xl font-bold">Edit Profile</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        <View className="flex-1 items-center justify-center">
          <View className="bg-gray-300 rounded-full p-8">
            <User size={60} color="#6b7280" />
          </View>
        </View>

        {/* Full Name */}
        <View className="mt-8">
          <Text className="text-lg font-semibold mb-2">Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            className="border border-gray-300 rounded-lg p-3 mb-6"
          />
        </View>

        {/* Phone Number */}
        <View>
          <Text className="text-lg font-semibold mb-2">Phone No.</Text>
          <TextInput
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            className="border border-gray-300 rounded-lg p-3 mb-6"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View>
          <Text className="text-lg font-semibold mb-2">Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg p-3 mb-6"
            keyboardType="email-address"
          />
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="flex-col gap-3">
          {/* Botão de Salvar */}
          <TouchableOpacity
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full h-14 rounded-full bg-red-600 items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
