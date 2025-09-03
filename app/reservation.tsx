import CalendarPicker from "@/components/CalendarPicker";
import DotsWhite from "@/components/DotsWhite";
import { reservationService } from "@/services/reservation.service";
import { Link, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Reservation() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // 🔎 Buscar horários disponíveis no backend
  const fetchAvailability = async () => {
    if (!selectedDate) return;
    try {
      setLoadingAvailability(true);
      const response = await reservationService.listAvailability(selectedDate); // passa a data
      setAvailability(response.data); // mantém todos os horários
    } catch (error: any) {
      console.error("Erro ao carregar disponibilidade:", error);
      Alert.alert("Erro", "Não foi possível carregar horários disponíveis.");
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate, selectedPeople]);

  const handleConfirmReservation = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erro", "Por favor selecione a data e o horário.");
      return;
    }

    try {
      setLoading(true);
      
      // Garantir que o start_time seja enviado apenas no formato HH:MM
      let formattedTime = selectedTime;
      
      // Se selectedTime contém formato ISO (com T), extrair apenas HH:MM
      if (selectedTime.includes("T")) {
        formattedTime = selectedTime.split("T")[1].slice(0, 5);
      }
      // Se já está no formato HH:MM:SS, pegar apenas HH:MM
      else if (selectedTime.includes(":") && selectedTime.length > 5) {
        formattedTime = selectedTime.slice(0, 5);
      }

      await reservationService.createReservation({
        date: selectedDate, // já está no formato YYYY-MM-DD
        start_time: formattedTime, // formato HH:MM
        guests_count: selectedPeople, // número inteiro
        special_requests: specialRequest || "", // string vazia se não preenchido
      });

      Alert.alert("Sucesso", "Reserva criada com sucesso!");
      router.push("/myreservation");
    } catch (error: any) {
      console.error("Erro ao criar reserva:", error);
      Alert.alert("Erro", error?.message || "Não foi possível criar a reserva.");
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para formatar o tempo exibido
  const formatDisplayTime = (time: string) => {
    if (time.includes("T")) {
      return time.split("T")[1].slice(0, 5); // HH:MM do formato ISO
    }
    return time.slice(0, 5); // HH:MM se já estiver em formato de hora
  };

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
          <Text className="text-white text-2xl font-bold">Table Reservation</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        {/* Select Date */}
        <Text className="text-lg font-semibold mb-2">Select Date</Text>
        <CalendarPicker
          onDateChange={(date) =>
            setSelectedDate(date.toISOString().split("T")[0])
          }
        />
        <Text className="mt-2 text-gray-700">Data escolhida: {selectedDate}</Text>

        {/* Available Times */}
        <Text className="text-lg font-semibold mt-6 mb-2">Available Times</Text>
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
                    {formatDisplayTime(slot.time)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text className="text-gray-500 mb-6">Nenhum horário encontrado.</Text>
        )}

        {/* Number of People */}
        <Text className="text-lg font-semibold mb-2">Number of People</Text>
        <View className="flex-row flex-wrap gap-2 mb-6 justify-between">
          {[...Array(8).keys()].map((i) => {
            const num = i + 1;
            return (
              <TouchableOpacity
                key={num}
                onPress={() => setSelectedPeople(num)}
                className={`w-[80px] h-12 rounded-lg items-center justify-center border ${
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
        <Text className="text-lg font-semibold mb-2">
          Special Requests (optional)
        </Text>
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
            onPress={handleConfirmReservation}
            disabled={loading}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Confirm Reservation
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}