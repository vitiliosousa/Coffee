import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { reservationService, Reservation } from "@/services/reservation.service";

export function useMyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const response = await reservationService.listReservations();

      if (response.data && Array.isArray(response.data.reservations)) {
        setReservations(response.data.reservations);
      } else if (Array.isArray(response.data)) {
        setReservations(response.data);
      } else {
        console.warn("Estrutura de resposta inesperada:", response);
        setReservations([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar reservas:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar as reservas");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "confirmed":
      case "confirmada":
        return { bg: "bg-green-200", text: "text-green-500" };
      case "pending":
      case "pendente":
        return { bg: "bg-yellow-200", text: "text-yellow-600" };
      case "cancelled":
      case "canceled":
      case "cancelada":
        return { bg: "bg-red-200", text: "text-red-500" };
      default:
        return { bg: "bg-gray-200", text: "text-gray-500" };
    }
  };

  const getStatusText = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "confirmed":
      case "confirmada":
        return "Confirmada";
      case "pending":
      case "pendente":
        return "Pendente";
      case "cancelled":
      case "canceled":
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  const canCancelReservation = (r: Reservation) => {
    const status = r.status.toLowerCase();
    if (status === "cancelled" || status === "canceled") return false;
    const date = new Date(r.date);
    return date >= new Date();
  };

  const canCheckIn = (r: Reservation) => {
    const s = r.status.toLowerCase();
    if (s === "cancelled" || s === "canceled" || r.check_in) return false;

    const date = new Date(r.date);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const time = new Date(r.start_time);
    const diff = (time.getTime() - now.getTime()) / (1000 * 60);
    return isToday && diff <= 120 && diff >= -120;
  };

  const shouldShowCheckInButton = (r: Reservation) => {
    const s = r.status.toLowerCase();
    if (s === "cancelled" || s === "canceled" || r.check_in) return false;
    const d = new Date(r.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isReservationDateInFuture = (r: Reservation) => {
    const d = new Date(r.date);
    const now = new Date();
    d.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return d > now;
  };

  const handleCheckIn = (r: Reservation) => {
    if (!canCheckIn(r)) {
      Alert.alert(
        "Check-in não disponível",
        "O check-in só está disponível a partir de 30 minutos antes e até 2 horas após o horário agendado."
      );
      return;
    }

    Alert.alert(
      "Fazer Check-in",
      `Confirmar check-in para ${formatDate(r.date)} às ${formatTime(r.start_time)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Fazer Check-in", onPress: () => confirmCheckIn(r.id) },
      ]
    );
  };

  const confirmCheckIn = async (id: string) => {
    setCheckingIn(id);
    try {
      await reservationService.checkIn(id);
      Alert.alert("Sucesso", "Check-in realizado com sucesso!");
      await loadReservations();
    } catch (error: any) {
      console.error("Erro ao fazer check-in:", error);
      Alert.alert("Erro", error.message || "Não foi possível realizar o check-in");
    } finally {
      setCheckingIn(null);
    }
  };

  const handleCancelReservation = (r: Reservation) => {
    if (!canCancelReservation(r)) {
      Alert.alert(
        "Não é possível cancelar",
        "Verifique se a reserva já não foi cancelada ou se a data já passou."
      );
      return;
    }

    Alert.alert(
      "Cancelar Reserva",
      `Cancelar reserva de ${formatDate(r.date)} às ${formatTime(r.start_time)}?`,
      [
        { text: "Manter", style: "cancel" },
        { text: "Cancelar", style: "destructive", onPress: () => confirmCancelReservation(r.id) },
      ]
    );
  };

  const confirmCancelReservation = async (id: string) => {
    setCancelling(id);
    try {
      await reservationService.cancelReservation(id);
      Alert.alert("Sucesso", "Reserva cancelada com sucesso!");
      await loadReservations();
    } catch (error: any) {
      console.error("Erro ao cancelar reserva:", error);
      Alert.alert("Erro", error.message || "Não foi possível cancelar a reserva");
    } finally {
      setCancelling(null);
    }
  };

  return {
    reservations,
    loading,
    cancelling,
    checkingIn,
    formatDate,
    formatTime,
    getStatusColor,
    getStatusText,
    canCancelReservation,
    canCheckIn,
    shouldShowCheckInButton,
    isReservationDateInFuture,
    handleCheckIn,
    handleCancelReservation,
  };
}
