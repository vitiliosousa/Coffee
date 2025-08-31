import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";

export default function Reservation() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");

  // Gerando horários de 30 em 30 minutos entre 09:00 e 20:30
  const times = [];
  for (let h = 9; h <= 20; h++) {
    for (let m of [0, 30]) {
      if (h === 21 && m === 0) break; // até 20:00
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }

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
          <Text className="text-white text-2xl font-bold">
            Table Reservation
          </Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        {/* Select Date */}
        <Text className="text-lg font-semibold mb-2">Select Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          onChangeText={setSelectedDate}
          className="border border-gray-300 rounded-lg p-3 mb-6"
        />

        {/* Available Times */}
        <Text className="text-lg font-semibold mb-2">Available Times</Text>
        <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setSelectedTime(time)}
              className={`px-6 py-3 rounded-xl border ${
                selectedTime === time
                  ? "bg-background border-background"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`${
                  selectedTime === time ? "text-white" : "text-gray-700"
                }`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Number of People */}
        <Text className="text-lg font-semibold mb-2">Number of People</Text>
        <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
          {[...Array(8).keys()].map((i) => {
            const num = i + 1;
            return (
              <TouchableOpacity
                key={num}
                onPress={() => setSelectedPeople(num)}
                className={`w-[80px] h-12 rounded-xl items-center justify-center border ${
                  selectedPeople === num
                    ? "bg-background border-background"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedPeople === num ? "text-white" : "text-gray-700"
                  }`}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Special Requests */}
        <Text className="text-lg font-semibold mb-2">Special Requests (optional)</Text>
        <TextInput
          placeholder="e.g. Birthday, Window seat..."
          value={specialRequest}
          onChangeText={setSpecialRequest}
          className="border border-gray-300 rounded-lg p-3 mb-10 h-24 text-gray-700"
          multiline
        />
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity
            onPress={() => {
              console.log({
                selectedDate,
                selectedTime,
                selectedPeople,
                specialRequest,
              });
              router.push("/home");
            }}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">
              Confirm Reservation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
