import AsyncStorage from "@react-native-async-storage/async-storage";
import { reservationsStore, mockAvailabilitySlots } from "../mocks/reservationsData";
import { authService } from "./auth.service";

export interface Reservation {
  id: string;
  date: string;
  start_time: string;
  guests_count: number;
  special_requests?: string;
  status: string;
  created_at: string;
  updated_at: string;
  check_in?: boolean; // Adicionado campo check_in
}

export interface AvailabilitySlot {
  time: string;     
  available: boolean;
}

export interface ReservationResponse {
  status: string;
  message: string;
  data: {
    reservation: Reservation;
  };
}

export interface ReservationsResponse {
  status: string;
  message: string;
  data: {
    reservations: Reservation[];
  };
}

export interface AvailabilityResponse {
  status: string;
  message: string;
  data: AvailabilitySlot[];
}

class ReservationService {
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 1️⃣ Criar reserva
  async createReservation(reservation: {
    date: string;
    start_time: string;
    guests_count: number;
    special_requests?: string;
  }): Promise<ReservationResponse> {
    await this.delay(800);

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      date: reservation.date,
      start_time: reservation.start_time,
      guests_count: reservation.guests_count,
      special_requests: reservation.special_requests || "",
      status: "confirmed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      check_in: false,
    };

    reservationsStore.unshift(newReservation);

    return {
      status: "success",
      message: "Reserva criada com sucesso",
      data: {
        reservation: newReservation,
      },
    };
  }

  // 2️⃣ Listar horários disponíveis
  async listAvailability(date: string): Promise<AvailabilityResponse> {
    await this.delay();

    return {
      status: "success",
      message: "Horários disponíveis obtidos com sucesso",
      data: mockAvailabilitySlots,
    };
  }

  // 3️⃣ Check-in da reserva
  async checkIn(reservationId: string): Promise<ReservationResponse> {
    await this.delay();

    const reservation = reservationsStore.find(r => r.id === reservationId);

    if (!reservation) {
      throw {
        status: "error",
        message: "Reserva não encontrada",
      };
    }

    reservation.check_in = true;
    reservation.status = "completed";
    reservation.updated_at = new Date().toISOString();

    return {
      status: "success",
      message: "Check-in realizado com sucesso",
      data: {
        reservation,
      },
    };
  }

  // 4️⃣ Listar reservas do usuário
  async listReservations(): Promise<ReservationsResponse> {
    await this.delay();

    return {
      status: "success",
      message: "Reservas obtidas com sucesso",
      data: {
        reservations: reservationsStore,
      },
    };
  }

  // 5️⃣ Cancelar reserva
  async cancelReservation(reservationId: string): Promise<ReservationResponse> {
    await this.delay();

    const reservation = reservationsStore.find(r => r.id === reservationId);

    if (!reservation) {
      throw {
        status: "error",
        message: "Reserva não encontrada",
      };
    }

    reservation.status = "canceled";
    reservation.updated_at = new Date().toISOString();

    return {
      status: "success",
      message: "Reserva cancelada com sucesso",
      data: {
        reservation,
      },
    };
  }
}

export const reservationService = new ReservationService();