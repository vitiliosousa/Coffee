import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, QrCode, CheckCircle, XCircle } from "lucide-react-native";
import { CameraView, Camera } from "expo-camera";
import { orderService, Order } from "@/services/order.service";
import { authService } from "@/services/auth.service";

export default function QRScanner() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

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

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setProcessing(true);

    try {
      // O QR Code pode conter prefixo "orderId:" - remover se existir
      let orderId = data.trim();
      
      console.log("===== QR CODE DEBUG =====");
      console.log("1. Valor bruto escaneado:", data);
      console.log("2. Após trim:", orderId);
      
      // Remover prefixo se existir
      if (orderId.startsWith("orderId:")) {
        orderId = orderId.replace("orderId:", "").trim();
        console.log("3. Após remover prefixo:", orderId);
      }
      
      console.log("4. OrderID final a ser enviado:", orderId);
      console.log("5. Comprimento do OrderID:", orderId.length);

      // Validar se é um UUID válido
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(orderId)) {
        console.log("6. ERRO: UUID inválido");
        Alert.alert("QR Code Inválido", "O QR Code não contém um ID de pedido válido");
        setScanned(false);
        setProcessing(false);
        return;
      }
      
      console.log("6. UUID válido - Buscando pedido...");

      // Buscar detalhes do pedido
      const orderResponse = await orderService.getOrderById(orderId);
      
      console.log("7. Resposta da API:", JSON.stringify(orderResponse, null, 2));
      
      if (orderResponse.success && orderResponse.data) {
        const order = orderResponse.data;
        console.log("8. Pedido encontrado:", order.id);
        setOrderDetails(order);
        setShowOrderModal(true);
      } else {
        console.log("8. ERRO: Pedido não encontrado na resposta");
        Alert.alert("Erro", "Não foi possível encontrar o pedido");
        setScanned(false);
      }
    } catch (error: any) {
      console.error("===== ERRO AO PROCESSAR QR CODE =====");
      console.error("Erro completo:", error);
      console.error("Mensagem:", error.message);
      console.error("Stack:", error.stack);
      
      let errorMessage = "QR Code inválido ou pedido não encontrado";
      if (error.message) {
        if (error.message.includes("record not found")) {
          errorMessage = `Pedido não encontrado no sistema.\n\nVerifique:\n• O pedido foi criado?\n• O ID está correto?\n• O pedido não foi cancelado?`;
        } else if (error.message.includes("network")) {
          errorMessage = "Erro de conexão. Verifique sua internet.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert("Erro ao Processar QR Code", errorMessage, [
        { text: "Tentar Novamente", onPress: handleRescan },
        { text: "Voltar", style: "cancel" }
      ]);
      setScanned(false);
    } finally {
      setProcessing(false);
      console.log("===== FIM DO PROCESSAMENTO =====");
    }
  };

  const handlePayment = async () => {
    if (!orderDetails) return;

    if (availableBalance < orderDetails.total_amount) {
      Alert.alert(
        "Saldo Insuficiente",
        `Você precisa de $${orderDetails.total_amount.toFixed(2)} mas tem apenas $${availableBalance.toFixed(2)}`
      );
      return;
    }

    setProcessing(true);

    try {
      const response = await orderService.performOrderTransaction(orderDetails.id);

      if (response.success) {
        Alert.alert(
          "Pagamento Realizado!",
          `Pedido pago com sucesso. Valor: $${orderDetails.total_amount.toFixed(2)}`,
          [
            {
              text: "OK",
              onPress: () => {
                setShowOrderModal(false);
                router.push("/wallet");
              },
            },
          ]
        );
      } else {
        Alert.alert("Erro", response.message || "Falha ao processar pagamento");
      }
    } catch (error: any) {
      console.error("Erro ao realizar pagamento:", error);
      Alert.alert("Erro", error.message || "Não foi possível processar o pagamento");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelScan = () => {
    setScanned(false);
    setShowOrderModal(false);
    setOrderDetails(null);
  };

  const handleRescan = () => {
    setScanned(false);
    setOrderDetails(null);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#503B36" />
        <Text className="mt-2">Solicitando permissão da câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-background p-6">
          <View className="flex-row gap-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold">Escanear QR Code</Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <XCircle size={64} color="#ef4444" />
          <Text className="text-xl font-bold mt-4 text-center">
            Permissão de Câmera Negada
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Por favor, habilite a permissão da câmera nas configurações do aplicativo.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-background p-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Escanear QR Code</Text>
        </View>
      </View>

      {/* Camera View */}
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View className="flex-1 items-center justify-center">
            {/* Overlay de scanner */}
            <View className="w-64 h-64 border-4 border-white rounded-3xl" />
            
            <View className="absolute top-20 bg-white/90 p-3 rounded-xl mx-6">
              <Text className="text-center text-sm text-gray-700">
                💡 Dica: O QR Code deve conter o ID do pedido
              </Text>
            </View>

            <View className="absolute bottom-20 bg-white/90 p-4 rounded-xl mx-6">
              <Text className="text-center text-lg font-semibold">
                {processing 
                  ? "Processando..." 
                  : scanned 
                    ? "QR Code lido! Aguarde..." 
                    : "Aponte para o QR Code do pedido"
                }
              </Text>
              <Text className="text-center text-gray-600 mt-2">
                Saldo disponível: ${availableBalance.toFixed(2)}
              </Text>
              {scanned && !processing && !showOrderModal && (
                <TouchableOpacity 
                  onPress={handleRescan}
                  className="mt-3 bg-background py-2 px-4 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">
                    Tentar Novamente
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CameraView>
      </View>

      {/* Modal de Confirmação do Pedido */}
      <Modal
        visible={showOrderModal}
        transparent
        animationType="slide"
        onRequestClose={handleCancelScan}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-4">
              <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
              <QrCode size={48} color="#503B36" />
              <Text className="text-2xl font-bold mt-4">Confirmar Pagamento</Text>
            </View>

            {orderDetails && (
              <ScrollView className="max-h-96">
                <View className="bg-gray-50 rounded-xl p-4 mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Pedido ID:</Text>
                    <Text className="font-semibold">#{orderDetails.id.slice(-8)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Tipo:</Text>
                    <Text className="font-semibold capitalize">{orderDetails.type}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Status:</Text>
                    <Text className="font-semibold capitalize">{orderDetails.status}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Itens:</Text>
                    <Text className="font-semibold">{orderDetails.order_items?.length || 0}</Text>
                  </View>
                  <View className="border-t border-gray-300 my-2" />
                  <View className="flex-row justify-between">
                    <Text className="text-xl font-bold">Total:</Text>
                    <Text className="text-xl font-bold text-background">
                      ${orderDetails.total_amount.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View className="bg-blue-50 rounded-xl p-4 mb-4">
                  <Text className="font-semibold mb-2">Seu Saldo:</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    ${availableBalance.toFixed(2)}
                  </Text>
                  {availableBalance < orderDetails.total_amount && (
                    <Text className="text-red-600 mt-2">
                      ⚠️ Saldo insuficiente para este pedido
                    </Text>
                  )}
                </View>
              </ScrollView>
            )}

            <View className="gap-3 mt-4">
              <TouchableOpacity
                onPress={handlePayment}
                disabled={!!(processing || (orderDetails && availableBalance < orderDetails.total_amount))}
                className={`w-full h-14 rounded-full items-center justify-center ${
                  processing || (orderDetails && availableBalance < orderDetails.total_amount)
                    ? "bg-gray-400"
                    : "bg-background"
                }`}
              >
                <Text className="text-white font-bold text-lg">
                  {processing ? "Processando..." : "Confirmar Pagamento"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelScan}
                disabled={processing}
                className="w-full h-14 rounded-full items-center justify-center border-2 border-gray-300"
              >
                <Text className="text-gray-700 font-bold text-lg">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}