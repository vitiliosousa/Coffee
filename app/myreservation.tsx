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
import { ChevronLeft, Calendar, Clock, Users, X } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";
import { reservationService } from "@/services/reservation.service";

interface Reservation {
  id: string;
  user_id: string;
  client_name: string;
  client_phone_number: string;
  table_id: string;
  date: string;
  start_time: string;
  end_time: string;
  check_in: boolean;
  guests_count: number;
  special_requests: string;
  status: string;
  created_at: string;
  updated_at: string;
  table: {
    id: string;
    number: string;
    capacity: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export default function MyReservation() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const response = await reservationService.listReservations();
      
      if (response.data && Array.isArray(response.data)) {
        setReservations(response.data);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar as reservas");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bg: 'bg-green-200', text: 'text-green-500' };
      case 'pending':
        return { bg: 'bg-yellow-200', text: 'text-yellow-600' };
      case 'cancelled':
        return { bg: 'bg-red-200', text: 'text-red-500' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-500' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert(
      "Cancelar Reserva",
      "Tem certeza que deseja cancelar esta reserva?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          style: "destructive",
          onPress: () => confirmCancelReservation(reservationId)
        }
      ]
    );
  };

  const confirmCancelReservation = async (reservationId: string) => {
    setCancelling(reservationId);
    try {
      // Aqui você implementaria a chamada para cancelar a reserva
      // await authService.cancelReservation(reservationId);
      
      Alert.alert("Sucesso", "Reserva cancelada com sucesso!");
      loadReservations(); // Recarregar a lista
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível cancelar a reserva");
    } finally {
      setCancelling(null);
    }
  };

  const renderReservationCard = (reservation: Reservation) => {
    const statusColors = getStatusColor(reservation.status);
    
    return (
      <View key={reservation.id} className="bg-background rounded-xl p-6 gap-4 mb-6">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Calendar size={20} color={"#FFFFFF"} />
            <Text className="text-white">{formatDate(reservation.date)}</Text>
          </View>
          <View className={`p-2 ${statusColors.bg} rounded-full`}>
            <Text className={`text-sm ${statusColors.text}`}>
              {getStatusText(reservation.status)}
            </Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Clock size={20} color={"#FFFFFF"} />
            <Text className="text-white">
              {formatTime(reservation.start_time)} - {formatTime(reservation.end_time)}
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
        
        {reservation.status.toLowerCase() !== 'cancelled' && (
          <View className="flex-row justify-end items-center">
            <TouchableOpacity 
              onPress={() => handleCancelReservation(reservation.id)}
              disabled={cancelling === reservation.id}
              className="flex-row gap-2 items-center bg-red-500 p-4 rounded-xl"
            >
              {cancelling === reservation.id ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <X size={20} color={"#FFFFFF"} />
                  <Text className="text-white">Cancelar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
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
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#503B36" />
          <Text className="text-lg mt-4 text-gray-600">Carregando reservas...</Text>
        </View>
      </View>
    );
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
          <Text className="text-white text-2xl font-bold">My Reservations</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        {reservations.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Calendar size={60} color="#BCA9A1" />
            <Text className="text-xl font-semibold text-gray-600 mt-4">
              Nenhuma reserva encontrada
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Você ainda não possui reservas.{'\n'}Faça sua primeira reserva!
            </Text>
          </View>
        ) : (
          reservations.map(renderReservationCard)
        )}
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity 
            onPress={() => router.push("/reservation")}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">
              Book New Reservation
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}