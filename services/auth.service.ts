import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUser, mockAuthToken } from "../mocks/userData";
import { mockTransactions, transactionsStore } from "../mocks/transactionsData";

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  birthday?: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  role: string;
  wallet_balance: number;
  loyalty_points: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface AccountInfoResponse {
  status: string;
  message: string;
  data: {
    account: {
      id: string;
      name: string;
      phone: string;
      email: string;
      role: string;
      wallet_balance: number;
      loyalty_points: number;
      status: string;
      created_at: string;
      updated_at: string;
    };
    messages: string[];
  };
}

export interface WalletTopUpResponse {
  status: string;
  message: string;
  data: {
    transaction_id: string;
    amount: number;
    method: string;
    type: string;
    status: string;
    created_at: string;
  };
}

export interface Transaction {
  id: string;
  user_id: string;
  phone: string;
  type: string;
  amount: string;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user: Partial<User>;
}

export interface WalletTransactionsResponse {
  status: string;
  message: string;
  data: {
    items: Transaction[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface ApiError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export interface TransactionFilter {
  user_id?: string;
  type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  page?: number;
  limit?: number;
}

class AuthService {
  // Simula delay de rede para parecer mais realista
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await this.delay();

    const newUser: User = {
      ...mockUser,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      birthday: userData.birthday || new Date().toISOString(),
    };

    const response: AuthResponse = {
      status: "success",
      message: "Usuário registrado com sucesso",
      data: {
        token: mockAuthToken,
        user: newUser,
      },
    };

    await this.saveToken(response.data.token);
    await this.saveUser(response.data.user);

    return response;
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    await this.delay();

    const response: AuthResponse = {
      status: "success",
      message: "Login realizado com sucesso",
      data: {
        token: mockAuthToken,
        user: mockUser,
      },
    };

    await this.saveToken(response.data.token);
    await this.saveUser(response.data.user);

    return response;
  }

  async getAccountInfo(): Promise<AccountInfoResponse> {
    await this.delay();

    const storedUser = await this.getUser();
    const currentUser = storedUser || mockUser;

    const response: AccountInfoResponse = {
      status: "success",
      message: "Informações da conta obtidas com sucesso",
      data: {
        account: {
          id: currentUser.id,
          name: currentUser.name,
          phone: currentUser.phone,
          email: currentUser.email,
          role: currentUser.role,
          wallet_balance: currentUser.wallet_balance,
          loyalty_points: currentUser.loyalty_points,
          status: currentUser.status,
          created_at: currentUser.created_at,
          updated_at: currentUser.updated_at,
        },
        messages: ["Bem-vindo de volta!", "Aproveite nossas promoções!"],
      },
    };

    await this.saveUser(currentUser);
    return response;
  }

  async walletTopUp(data: {
    user_id: string;
    amount: number;
    phone: string;
    description?: string;
    method?: "mpesa" | "card";
  }): Promise<WalletTopUpResponse> {
    await this.delay(1000);

    const currentUser = await this.getUser();
    if (currentUser) {
      currentUser.wallet_balance += data.amount;
      await this.saveUser(currentUser);
    }

    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      user_id: data.user_id,
      phone: data.phone,
      type: "topup",
      amount: data.amount.toString(),
      status: "completed",
      description: data.description || `Recarga via ${data.method === "card" ? "Cartão" : "M-Pesa"}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: currentUser?.id || data.user_id,
        name: currentUser?.name || "Usuário",
        email: currentUser?.email || "",
        phone: data.phone,
      },
    };

    transactionsStore.unshift(newTransaction);

    return {
      status: "success",
      message: "Recarga realizada com sucesso",
      data: {
        transaction_id: newTransaction.id,
        amount: data.amount,
        method: data.method || "mpesa",
        type: "topup",
        status: "completed",
        created_at: newTransaction.created_at,
      },
    };
  }

  // Listar todas as transações
  async getWalletTransactions(): Promise<WalletTransactionsResponse> {
    await this.delay();

    return {
      status: "success",
      message: "Transações obtidas com sucesso",
      data: {
        items: transactionsStore,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: transactionsStore.length,
          items_per_page: 50,
          has_next: false,
          has_prev: false,
        },
      },
    };
  }

  // ✅ Novo: filtrar transações
  async filterWalletTransactions(
    filters: TransactionFilter
  ): Promise<WalletTransactionsResponse> {
    await this.delay();

    let filteredTransactions = [...transactionsStore];

    if (filters.type) {
      filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
    }

    if (filters.status) {
      filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
    }

    if (filters.date_from) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.created_at) >= new Date(filters.date_from!)
      );
    }

    if (filters.date_to) {
      filteredTransactions = filteredTransactions.filter(
        t => new Date(t.created_at) <= new Date(filters.date_to!)
      );
    }

    if (filters.min_amount) {
      filteredTransactions = filteredTransactions.filter(
        t => parseFloat(t.amount) >= filters.min_amount!
      );
    }

    if (filters.max_amount) {
      filteredTransactions = filteredTransactions.filter(
        t => parseFloat(t.amount) <= filters.max_amount!
      );
    }

    return {
      status: "success",
      message: "Transações filtradas com sucesso",
      data: {
        items: filteredTransactions,
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: filteredTransactions.length,
          items_per_page: 50,
          has_next: false,
          has_prev: false,
        },
      },
    };
  }

  async requestOTP(): Promise<{ status: string; message: string }> {
    await this.delay();
    return {
      status: "success",
      message: "OTP enviado com sucesso para seu email/telefone",
    };
  }

  async verifyOTP(otp: string): Promise<{ status: string; message: string }> {
    await this.delay();

    if (otp === "123456" || otp.length === 6) {
      return {
        status: "success",
        message: "OTP verificado com sucesso",
      };
    }

    throw {
      status: "error",
      message: "OTP inválido",
    };
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(["@auth_token", "@user_data"]);
  }

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem("@auth_token", token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("@auth_token");
  }

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem("@user_data", JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem("@user_data");
    return userData ? JSON.parse(userData) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async testConnection(): Promise<boolean> {
    await this.delay(200);
    return true;
  }
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  display_order?: number;
  is_available?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  status: string;
  message: string;
  data: Category[];
}

export interface ProductsResponse {
  status: string;
  message: string;
  data: Product[];
}
export const authService = new AuthService();
