import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://162.245.188.169:8045/api/v1';
const isWeb = Platform.OS === 'web';

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
  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
      if (isWeb) {
        headers['Accept'] = 'application/json';
        headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      const requestOptions: RequestInit = {
        ...options,
        headers,
        mode: isWeb ? 'cors' : undefined,
        credentials: isWeb ? 'omit' : undefined,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw { status: 'error', message: data.message || 'Erro na requisição', errors: data.errors } as ApiError;
      }
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      if (error instanceof TypeError) {
        throw {
          status: 'error',
          message: isWeb
            ? 'Erro de CORS ou conexão. Tente no dispositivo móvel ou configure um proxy.'
            : 'Erro de conexão. Verifique sua internet.',
        } as ApiError;
      }
      throw error;
    }
  }

  private async makeAuthenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    if (!token) {
      throw { status: 'error', message: 'Token de autenticação não encontrado. Faça login novamente.' } as ApiError;
    }

    const authenticatedOptions: RequestInit = {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    };

    return this.makeRequest<T>(endpoint, authenticatedOptions);
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const registerPayload = {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      birthday: userData.birthday || new Date().toISOString(),
      password: userData.password,
    };

    const response = await this.makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerPayload),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
      await this.saveUser(response.data.user);
    }
    return response;
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (response.data?.token) {
      await this.saveToken(response.data.token);
      await this.saveUser(response.data.user);
    }
    return response;
  }

  async getAccountInfo(): Promise<AccountInfoResponse> {
    const response = await this.makeAuthenticatedRequest<AccountInfoResponse>('/users/account-info', { method: 'GET' });
    if (response.data?.account) {
      const updatedUser: User = {
        id: response.data.account.id,
        name: response.data.account.name,
        phone: response.data.account.phone,
        email: response.data.account.email,
        birthday: '',
        role: response.data.account.role,
        wallet_balance: response.data.account.wallet_balance,
        loyalty_points: response.data.account.loyalty_points,
        status: response.data.account.status,
        created_at: response.data.account.created_at,
        updated_at: response.data.account.updated_at,
      };
      await this.saveUser(updatedUser);
    }
    return response;
  }

  async walletTopUp(data: { user_id: string; amount: number; phone: string; description?: string; method?: 'mpesa' | 'card' }): Promise<WalletTopUpResponse> {
    const body = { user_id: data.user_id, type: 'topup', method: data.method || 'mpesa', amount: data.amount, phone: data.phone, description: data.description };
    return this.makeAuthenticatedRequest<WalletTopUpResponse>('/users/wallet/top-up', { method: 'POST', body: JSON.stringify(body) });
  }

  // Listar todas as transações
  async getWalletTransactions(): Promise<WalletTransactionsResponse> {
    return this.makeAuthenticatedRequest<WalletTransactionsResponse>('/users/wallet/transactions', { method: 'GET' });
  }

  // ✅ Novo: filtrar transações
  async filterWalletTransactions(filters: TransactionFilter): Promise<WalletTransactionsResponse> {
    return this.makeAuthenticatedRequest<WalletTransactionsResponse>('/users/wallet/transactions/filters', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async requestOTP(): Promise<{ status: string; message: string }> {
    return this.makeAuthenticatedRequest<{ status: string; message: string }>('/users/request-otp', { method: 'POST' });
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
  }

  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem('@auth_token', token);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('@auth_token');
  }

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem('@user_data', JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('@user_data');
    return userData ? JSON.parse(userData) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: isWeb ? 'cors' : undefined });
      return response.ok;
    } catch {
      return false;
    }
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

class AdminService {
  private async makeAuthenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await AsyncStorage.getItem('@auth_token'); // ou outro método de pegar token
    if (!token) throw new Error('Token não encontrado');

    const headers = {
      'Content-Type': 'application/json',
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

  // ✅ Listar Categorias
  async listCategories(): Promise<CategoriesResponse> {
    return this.makeAuthenticatedRequest<CategoriesResponse>('/admin/categories', { method: 'GET' });
  }

  // ✅ Listar Produtos
  async listProducts(): Promise<ProductsResponse> {
    return this.makeAuthenticatedRequest<ProductsResponse>('/admin/products', { method: 'GET' });
  }
}

export const adminService = new AdminService();


export const authService = new AuthService();
