import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { reservationService } from "@/services/reservation.service";

// Função utilitária para obter a data de hoje no formato YYYY-MM-DD
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Função utilitária para obter objeto Date de hoje
export const getTodayDateObject = (): Date => new Date();

export function useReservation() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [specialRequest, setSpecialRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // 🔎 Buscar horários disponíveis
  const fetchAvailability = async () => {
    if (!selectedDate) return;
    try {
      setLoadingAvailability(true);
      const response = await reservationService.listAvailability(selectedDate);
      setAvailability(response.data);
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

  const formatTime = (time: string) => {
    if (time.includes("T")) return time.split("T")[1].slice(0, 5);
    return time.slice(0, 5);
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    const today = getTodayDateObject();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === getTodayDate()) return `Hoje (${date.toLocaleDateString("pt-BR")})`;
    if (dateString === tomorrow.toISOString().split("T")[0])
      return `Amanhã (${date.toLocaleDateString("pt-BR")})`;
    return date.toLocaleDateString("pt-BR");
  };

  const confirmReservation = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Erro", "Por favor selecione a data e o horário.");
      return;
    }

    try {
      setLoading(true);

      let formattedTime = selectedTime;
      if (selectedTime.includes("T")) formattedTime = selectedTime.split("T")[1].slice(0, 5);
      else if (selectedTime.includes(":") && selectedTime.length > 5) formattedTime = selectedTime.slice(0, 5);

      await reservationService.createReservation({
        date: selectedDate,
        start_time: formattedTime,
        guests_count: selectedPeople,
        special_requests: specialRequest || "",
      });

      Alert.alert("Sucesso", "Reserva criada com sucesso!");
      return true;
    } catch (error: any) {
      console.error("Erro ao criar reserva:", error);
      Alert.alert("Erro", error?.message || "Não foi possível criar a reserva.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
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
    fetchAvailability,
    formatTime,
    formatDisplayDate,
    confirmReservation,
  };
}
