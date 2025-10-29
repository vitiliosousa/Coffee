import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Camera } from "expo-camera";
import { orderService, Order } from "@/services/order.service";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";

export function useQRScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermissions();
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const account = await authService.getAccountInfo();
      setAvailableBalance(account?.data?.account?.wallet_balance ?? 0);
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
    }
  };

  const processOrderId = async (rawOrderId: string) => {
    setProcessing(true);
    try {
      let orderId = rawOrderId.trim();
      if (orderId.startsWith("orderId:")) orderId = orderId.replace("orderId:", "").trim();

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) {
        Alert.alert("ID Inválido", "O ID do pedido não é um UUID válido");
        setScanned(false);
        setProcessing(false);
        return;
      }

      const paymentCodeResponse = await adminService.generatePaymentCode();
      const paymentCode = paymentCodeResponse?.data?.code;

      if (!paymentCode) {
        Alert.alert("Erro", "Não foi possível gerar o código de pagamento");
        setProcessing(false);
        return;
      }

      const transactionResponse = await orderService.performOrderTransaction(paymentCode, orderId);

      if (transactionResponse?.status === "success") {
        const order = transactionResponse.data?.order;
        const transaction = transactionResponse.data?.transaction;

        setConfirmationMessage(
          `Pedido ${order.id.slice(-8)} pago com sucesso!\n\nValor: ${order.total_amount} MT\nNovo saldo: ${transaction.current_balance} MT`
        );
        setShowConfirmationModal(true);
      } else {
        Alert.alert("Erro", transactionResponse?.message || "Falha ao processar a transação");
        setScanned(false);
      }
    } catch (error: any) {
      console.error("❌ Erro ao processar QR:", error);
      Alert.alert("Erro", error?.message || "Não foi possível processar o QR Code");
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setConfirmationMessage("");
    setShowConfirmationModal(false);
  };

  return {
    hasPermission,
    scanned,
    processing,
    availableBalance,
    showConfirmationModal,
    confirmationMessage,
    setScanned,
    processOrderId,
    resetScanner,
  };
}
