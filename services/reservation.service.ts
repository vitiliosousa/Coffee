import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://162.245.188.169:8045/api/v1";

export interface Reservation {
  id: string;
  date: string;
  start_time: string;
  guests_count: number;
  special_requests?: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await AsyncStorage.getItem("@auth_token");
    if (!token) throw new Error("Token não encontrado");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  }

  // 1️⃣ Criar reserva (sem table_id)
  async createReservation(reservation: {
    date: string;
    start_time: string;
    guests_count: number;
    special_requests?: string;
  }): Promise<ReservationResponse> {
    return this.makeAuthenticatedRequest<ReservationResponse>(
      "/users/reservations",
      {
        method: "POST",
        body: JSON.stringify(reservation),
      }
    );
  }

  // 2️⃣ Listar horários disponíveis (agora recebe a data como query param)
  async listAvailability(date: string): Promise<AvailabilityResponse> {
    return this.makeAuthenticatedRequest<AvailabilityResponse>(
      `/users/availability?date=${date}`,
      { method: "GET" }
    );
  }

  // 3️⃣ Check-in da reserva
  async checkIn(reservationId: string): Promise<ReservationResponse> {
    return this.makeAuthenticatedRequest<ReservationResponse>(
      `/users/reservations/${reservationId}/check-in`,
      { method: "PUT" }
    );
  }

  // 4️⃣ Listar reservas do usuário
  async listReservations(): Promise<ReservationsResponse> {
    return this.makeAuthenticatedRequest<ReservationsResponse>(
      "/users/reservations",
      { method: "GET" }
    );
  }

  // 5️⃣ Cancelar reserva
  async cancelReservation(reservationId: string): Promise<ReservationResponse> {
    return this.makeAuthenticatedRequest<ReservationResponse>(
      `/users/reservations/${reservationId}/status`,
      {
        method: "POST",
        body: JSON.stringify({ status: "canceled" }),
      }
    );
  }
}

export const reservationService = new ReservationService();
