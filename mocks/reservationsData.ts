import { Reservation, AvailabilitySlot } from "../services/reservation.service";

export const mockReservations: Reservation[] = [
  {
    id: "res-1",
    date: "2025-11-20",
    start_time: "19:00",
    guests_count: 4,
    special_requests: "Mesa próxima à janela",
    status: "confirmed",
    created_at: "2025-11-18T10:00:00.000Z",
    updated_at: "2025-11-18T10:00:00.000Z",
    check_in: false,
  },
  {
    id: "res-2",
    date: "2025-11-22",
    start_time: "20:30",
    guests_count: 2,
    special_requests: "",
    status: "confirmed",
    created_at: "2025-11-17T14:30:00.000Z",
    updated_at: "2025-11-17T14:30:00.000Z",
    check_in: false,
  },
  {
    id: "res-3",
    date: "2025-11-15",
    start_time: "18:00",
    guests_count: 6,
    special_requests: "Aniversário - decoração especial",
    status: "completed",
    created_at: "2025-11-10T09:00:00.000Z",
    updated_at: "2025-11-15T19:30:00.000Z",
    check_in: true,
  },
  {
    id: "res-4",
    date: "2025-11-12",
    start_time: "21:00",
    guests_count: 2,
    special_requests: "",
    status: "canceled",
    created_at: "2025-11-08T16:45:00.000Z",
    updated_at: "2025-11-11T10:20:00.000Z",
    check_in: false,
  },
];

export const mockAvailabilitySlots: AvailabilitySlot[] = [
  { time: "12:00", available: true },
  { time: "12:30", available: true },
  { time: "13:00", available: false },
  { time: "13:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
  { time: "19:00", available: false },
  { time: "19:30", available: true },
  { time: "20:00", available: true },
  { time: "20:30", available: false },
  { time: "21:00", available: true },
  { time: "21:30", available: true },
  { time: "22:00", available: true },
];

export let reservationsStore: Reservation[] = [...mockReservations];
