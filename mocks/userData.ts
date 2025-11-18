import { User } from "../services/auth.service";

export const mockUser: User = {
  id: "user-123",
  name: "João Silva",
  phone: "+258 84 123 4567",
  email: "joao.silva@example.com",
  birthday: "1990-05-15",
  role: "customer",
  wallet_balance: 2500.00,
  loyalty_points: 850,
  status: "active",
  created_at: "2024-01-15T10:00:00.000Z",
  updated_at: "2025-11-18T08:30:00.000Z",
};

export const mockAuthToken = "mock-jwt-token-12345";
