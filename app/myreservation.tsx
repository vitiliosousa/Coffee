import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { ChevronLeft, Calendar, Clock, Users, X, CheckCircle } from "lucide-react-native";
import { reservationService, Reservation } from "@/services/reservation.service";

export default function MyReservation() {
  const router = useRouter();
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
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
      case 'confirmada':
        return { bg: 'bg-green-200', text: 'text-green-500' };
      case 'pending':
      case 'pendente':
        return { bg: 'bg-yellow-200', text: 'text-yellow-600' };
      case 'cancelled':
      case 'canceled':
      case 'cancelada':
        return { bg: 'bg-red-200', text: 'text-red-500' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-500' };
    }
  };

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
      case 'confirmada':
        return 'Confirmada';
      case 'pending':
      case 'pendente':
        return 'Pendente';
      case 'cancelled':
      case 'canceled':
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const canCancelReservation = (reservation: Reservation) => {
    const status = reservation.status.toLowerCase();
    if (status === 'cancelled' || status === 'canceled') {
      return false;
    }
    
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    return reservationDate >= now;
  };

  const canCheckIn = (reservation: Reservation) => {
    const status = reservation.status.toLowerCase();
    
    // Não permitir check-in se reserva estiver cancelada
    if (status === 'cancelled' || status === 'canceled') {
      return false;
    }

    // Não permitir check-in se já foi feito
    if (reservation.check_in) {
      return false;
    }

    // Verificar se é o dia da reserva
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const isToday = reservationDate.toDateString() === now.toDateString();

    // Verificar se está no horário (até 30 minutos antes)
    const reservationTime = new Date(reservation.start_time);
    const timeDiff = reservationTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return isToday && minutesDiff <= 30 && minutesDiff >= -120;
  };

  const shouldShowCheckInButton = (reservation: Reservation) => {
    const status = reservation.status.toLowerCase();
    
    // Mostrar botão apenas se não estiver cancelada e não tiver feito check-in
    if (status === 'cancelled' || status === 'canceled' || reservation.check_in) {
      return false;
    }

    // Verificar se é o dia da reserva
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const isToday = reservationDate.toDateString() === now.toDateString();

    return isToday;
  };

  const handleCheckIn = (reservation: Reservation) => {
    if (!canCheckIn(reservation)) {
      Alert.alert(
        "Check-in não disponível",
        "O check-in só está disponível a partir de 30 minutos antes do horário agendado e até 2 horas após."
      );
      return;
    }

    Alert.alert(
      "Fazer Check-in",
      `Confirmar check-in para a reserva do dia ${formatDate(reservation.date)} às ${formatTime(reservation.start_time)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Fazer Check-in", 
          style: "default",
          onPress: () => confirmCheckIn(reservation.id)
        }
      ]
    );
  };

  const confirmCheckIn = async (reservationId: string) => {
    setCheckingIn(reservationId);
    try {
      await reservationService.checkIn(reservationId);
      
      Alert.alert("Sucesso", "Check-in realizado com sucesso! Boa estadia!");
      await loadReservations();
      
    } catch (error: any) {
      console.error("Erro ao fazer check-in:", error);
      
      let errorMessage = "Não foi possível realizar o check-in";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setCheckingIn(null);
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (!canCancelReservation(reservation)) {
      Alert.alert(
        "Não é possível cancelar",
        "Esta reserva não pode ser cancelada. Verifique se já não está cancelada ou se a data já passou."
      );
      return;
    }

    Alert.alert(
      "Cancelar Reserva",
      `Tem certeza que deseja cancelar a reserva do dia ${formatDate(reservation.date)} às ${formatTime(reservation.start_time)}?`,
      [
        { text: "Manter Reserva", style: "cancel" },
        { 
          text: "Cancelar Reserva", 
          style: "destructive",
          onPress: () => confirmCancelReservation(reservation.id)
        }
      ]
    );
  };

  const confirmCancelReservation = async (reservationId: string) => {
    setCancelling(reservationId);
    try {
      await reservationService.cancelReservation(reservationId);
      
      Alert.alert("Sucesso", "Reserva cancelada com sucesso!");
      await loadReservations();
      
    } catch (error: any) {
      console.error("Erro ao cancelar reserva:", error);
      
      let errorMessage = "Não foi possível cancelar a reserva";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erro", errorMessage);
    } finally {
      setCancelling(null);
    }
  };

  const renderReservationCard = (reservation: Reservation) => {
    const statusColors = getStatusColor(reservation.status);
    const canCancel = canCancelReservation(reservation);
    const canDoCheckIn = canCheckIn(reservation);
    const showCheckInButton = shouldShowCheckInButton(reservation);
    const isCheckedIn = reservation.check_in;
    
    return (
      <View key={reservation.id} className="bg-background rounded-xl p-6 gap-4 mb-6">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Calendar size={20} color={"#FFFFFF"} />
            <Text className="text-white font-semibold">{formatDate(reservation.date)}</Text>
          </View>
          <View className={`px-3 py-1 ${statusColors.bg} rounded-full`}>
            <Text className={`text-sm font-semibold ${statusColors.text}`}>
              {getStatusText(reservation.status)}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Clock size={20} color={"#FFFFFF"} />
            <Text className="text-white">
              {formatTime(reservation.start_time)}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Users size={20} color={"#FFFFFF"} />
            <Text className="text-white">
              {reservation.guests_count} {reservation.guests_count === 1 ? 'Pessoa' : 'Pessoas'}
            </Text>
          </View>
        </View>

        {reservation.special_requests && (
          <View>
            <Text className="text-white text-sm opacity-80">
              Observações: {reservation.special_requests}
            </Text>
          </View>
        )}

        {/* Status do Check-in */}
        {isCheckedIn && (
          <View className="flex-row items-center gap-2 bg-green-500/20 p-3 rounded-lg">
            <CheckCircle size={18} color="#22c55e" />
            <Text className="text-green-400 font-semibold">
              Check-in realizado
            </Text>
          </View>
        )}
        
        {/* Botões de Ação */}
        <View className="flex-row justify-between items-center mt-2 gap-3">
          {/* Botão Check-in */}
          {showCheckInButton && (
            <TouchableOpacity 
              onPress={() => handleCheckIn(reservation)}
              disabled={checkingIn === reservation.id || !canDoCheckIn}
              className={`flex-1 flex-row gap-2 items-center justify-center px-4 py-3 rounded-xl ${
                checkingIn === reservation.id 
                  ? 'bg-gray-400' 
                  : canDoCheckIn 
                    ? 'bg-green-500' 
                    : 'bg-gray-400'
              }`}
            >
              {checkingIn === reservation.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <CheckCircle 
                    size={18} 
                    color={canDoCheckIn ? "#FFFFFF" : "#999999"} 
                  />
                  <Text className={`font-semibold ${canDoCheckIn ? 'text-white' : 'text-gray-500'}`}>
                    Check-in
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Botão Cancelar */}
          {canCancel && (
            <TouchableOpacity 
              onPress={() => handleCancelReservation(reservation)}
              disabled={cancelling === reservation.id}
              className={`flex-1 flex-row gap-2 items-center justify-center px-4 py-3 rounded-xl ${
                cancelling === reservation.id ? 'bg-gray-400' : 'bg-red-500'
              }`}
            >
              {cancelling === reservation.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <X size={18} color={"#FFFFFF"} />
                  <Text className="text-white font-semibold">Cancelar</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Mensagem quando não há ações disponíveis */}
          {!showCheckInButton && !canCancel && !isCheckedIn && reservation.status.toLowerCase() !== 'cancelled' && reservation.status.toLowerCase() !== 'canceled' && (
            <View className="flex-1 items-center">
              <Text className="text-yellow-300 text-sm text-center">
                Aguardando data da reserva
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-background p-6 gap-6">
          <View className="flex-row gap-4 items-center">
            <Link href={"/home"}>
              <ChevronLeft size={24} color={"#FFFFFF"} />
            </Link>
            <Text className="text-white text-2xl font-bold">Minhas Reservas</Text>
          </View>
        </View>
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#503B36" />
          <Text className="text-lg mt-4 text-gray-600">Carregando reservas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Minhas Reservas</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {reservations.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Calendar size={60} color="#BCA9A1" />
            <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
              Nenhuma reserva encontrada
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Você ainda não possui reservas.{'\n'}Faça sua primeira reserva!
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-gray-600 mb-4 text-center">
              {reservations.length} {reservations.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
            </Text>
            {reservations.map(renderReservationCard)}
          </>
        )}
      </ScrollView>

      <View className="border-t border-gray-200 p-6 bg-white">
        <TouchableOpacity 
          onPress={() => router.push("/reservation")}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">
            Fazer nova reserva
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}