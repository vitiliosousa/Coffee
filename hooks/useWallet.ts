import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Clipboard from 'expo-clipboard';
import { authService, AccountInfoResponse, WalletTransactionsResponse, Transaction } from "@/services/auth.service";
import { adminService, PaymentCode } from "@/services/admin.service";

export function useWallet() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<AccountInfoResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showPaymentIdModal, setShowPaymentIdModal] = useState(false);
  const [paymentCode, setPaymentCode] = useState<PaymentCode | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const account = await authService.getAccountInfo();
      setAccountInfo(account);

      const txResponse: WalletTransactionsResponse = await authService.getWalletTransactions();
      const sortedTx = txResponse.data.items.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTransactions(sortedTx);
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar os dados da carteira");
    } finally {
      setLoading(false);
    }
  };

  const generatePaymentCode = async () => {
    setGeneratingCode(true);
    try {
      const response = await adminService.generatePaymentCode();
      setPaymentCode(response.data);
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível gerar o código de pagamento. Tente novamente."
      );
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyToClipboard = async () => {
    if (paymentCode) {
      await Clipboard.setStringAsync(paymentCode.code);
      Alert.alert("Copiado!", "Código de pagamento copiado para a área de transferência");
    }
  };

  const handleOpenModal = () => {
    setShowPaymentIdModal(true);
    setPaymentCode(null);
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return "Expirado";
    if (diffMins < 60) return `${diffMins} minutos`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}min`;
  };

  return {
    loading,
    accountInfo,
    transactions,
    recentTransactions: transactions.slice(0, 3),
    showPaymentIdModal,
    paymentCode,
    generatingCode,
    fetchData,
    generatePaymentCode,
    copyToClipboard,
    handleOpenModal,
    setShowPaymentIdModal,
    formatExpiryTime,
    router,
  };
}
