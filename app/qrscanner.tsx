import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Search, XCircle } from "lucide-react-native";
import { CameraView } from "expo-camera";
import { useQRScanner } from "@/hooks/useQRScanner";

export default function QRScanner() {
  const router = useRouter();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualOrderId, setManualOrderId] = useState("");

  const {
    hasPermission,
    scanned,
    processing,
    availableBalance,
    showConfirmationModal,
    confirmationMessage,
    setScanned,
    processOrderId,
    resetScanner,
  } = useQRScanner();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    await processOrderId(data);
  };

  const handleManualSearch = async () => {
    if (!manualOrderId.trim()) {
      Alert.alert("Campo vazio", "Por favor, insira o ID do pedido");
      return;
    }
    setShowManualInput(false);
    setScanned(true);
    await processOrderId(manualOrderId.trim());
    setManualOrderId("");
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
        <View className="bg-background p-6 flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Escanear QR Code</Text>
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
      <View className="bg-background p-6 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Escanear QR Code</Text>
        </View>
        <TouchableOpacity onPress={() => setShowManualInput(true)}>
          <Search size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Camera */}
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={scanned || showConfirmationModal ? undefined : handleBarCodeScanned}
        >
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 border-4 border-white rounded-3xl" />
            <View className="absolute top-20 bg-white/90 p-3 rounded-xl mx-6">
              <Text className="text-center text-sm text-gray-700">
                O QR Code deve conter o ID do pedido
              </Text>
            </View>
            <View className="absolute bottom-20 bg-white/90 p-4 rounded-xl mx-6">
              <Text className="text-center text-lg font-semibold">
                {processing
                  ? "Processando..."
                  : scanned
                  ? "QR Code lido! Aguarde..."
                  : "Aponte para o QR Code do pedido"}
              </Text>
              <Text className="text-center text-gray-600 mt-2">
                Saldo disponível: {availableBalance.toFixed(2)} MT
              </Text>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Modal manual */}
      <Modal visible={showManualInput} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <Text className="text-xl font-bold mb-4">Buscar Pedido</Text>
            <Text className="text-gray-600 mb-4">Insira o ID do pedido manualmente</Text>
            <TextInput
              value={manualOrderId}
              onChangeText={setManualOrderId}
              placeholder="0698574d-5373-4a34-9dbb..."
              className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowManualInput(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg"
              >
                <Text className="text-center font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleManualSearch}
                className="flex-1 py-3 bg-background rounded-lg"
              >
                <Text className="text-white text-center font-semibold">Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal confirmação */}
      <Modal visible={showConfirmationModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white rounded-2xl w-full max-w-sm p-6">
            <Text className="text-xl font-bold mb-4">Pagamento Concluído</Text>
            <Text className="text-gray-700 mb-6">{confirmationMessage}</Text>
            <TouchableOpacity
              onPress={() => {
                resetScanner();
                router.back();
              }}
              className="bg-background py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
