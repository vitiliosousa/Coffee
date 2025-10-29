import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import CalendarPicker from "@/components/CalendarPicker";
import { useReservation } from "@/hooks/useReservation";

export default function Reservation() {
  const router = useRouter();
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedPeople,
    setSelectedPeople,
    specialRequest,
    setSpecialRequest,
    loading,
    availability,
    loadingAvailability,
    formatTime,
    formatDisplayDate,
    confirmReservation,
  } = useReservation();

  const handleConfirm = async () => {
    const success = await confirmReservation();
    if (success) router.push("/myreservation");
  };

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </Link>
          <Text className="text-white text-2xl font-bold">Reserva de Mesa</Text>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView className="flex-1 px-6 py-6">
        {/* Select Date */}
        <Text className="text-lg font-semibold mb-2">Selecione a Data</Text>
        <CalendarPicker
          initialDate={new Date()}
          onDateChange={(date) => setSelectedDate(date.toISOString().split("T")[0])}
        />
        <Text className="mt-2 text-gray-700">
          Data escolhida: {formatDisplayDate(selectedDate)}
        </Text>

        {/* Available Times */}
        <Text className="text-lg font-semibold mt-6 mb-2">Horas disponíveis</Text>
        {loadingAvailability ? (
          <ActivityIndicator size="small" color="#000" />
        ) : availability.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
            {availability.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <TouchableOpacity
                  key={slot.time}
                  onPress={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`w-[80px] h-12 items-center justify-center rounded-lg border ${
                    isSelected
                      ? "bg-background border-background"
                      : slot.available
                      ? "border-gray-300"
                      : "border-gray-300 bg-gray-200"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isSelected
                        ? "text-white"
                        : slot.available
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {formatTime(slot.time)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text className="text-gray-500 mb-6">Nenhum horário encontrado.</Text>
        )}

        {/* Number of People */}
        <Text className="text-lg font-semibold mb-2">Número de Pessoas</Text>
        <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
          {[...Array(8).keys()].map((i) => {
            const num = i + 1;
            return (
              <TouchableOpacity
                key={num}
                onPress={() => setSelectedPeople(num)}
                className={`w-[80px] h-12 rounded-lg items-center justify-center border ${
                  selectedPeople === num ? "bg-background border-background" : "border-gray-300"
                }`}
              >
                <Text className={`font-semibold ${selectedPeople === num ? "text-white" : "text-gray-700"}`}>
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Special Requests */}
        <Text className="text-lg font-semibold mb-2">Pedido Especial (opcional)</Text>
        <TextInput
          placeholder="e.g. Birthday, Window seat..."
          value={specialRequest}
          onChangeText={setSpecialRequest}
          className="border border-gray-300 rounded-lg p-3 mb-10 h-24 text-gray-700"
          multiline
        />
      </ScrollView>

      {/* FOOTER */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Confirmar Reserva</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}
