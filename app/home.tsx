import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useRouter, Link, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Car,
  Coffee,
  ArrowRight,
  Wallet,
  User,
  Menu,
  Star,
  Bell,
} from "lucide-react-native";
import Dots from "@/components/Dots";
import { authService, AccountInfoResponse } from "@/services/auth.service";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [accountInfo, setAccountInfo] = useState<
    AccountInfoResponse["data"]["account"] | null
  >(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await authService.getAccountInfo();
        setAccountInfo(response.data.account);

        // Verifica se veio de um login (parâmetro fromLogin = true)
        // E se a conta não está verificada
        if (
          response.data.account.status !== "active" &&
          params.fromLogin === "true"
        ) {
          setShowVerificationModal(true);

          // Remove o parâmetro da URL para não mostrar novamente
          router.replace("/home");
        }
      } catch (error: any) {
        console.error("Erro ao buscar info da conta:", error.message);
        Alert.alert(
          "Erro",
          "Não foi possível carregar as informações da conta"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [params.fromLogin]);

  const handleVerifyNow = () => {
    setShowVerificationModal(false);
    router.push("/verify-otp");
  };

  const handleContinueWithoutVerification = () => {
    setShowVerificationModal(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-fundo">
        <Text className="text-background text-xl">Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-fundo">
      <Modal visible={showVerificationModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-6">
          <View className="bg-white p-6 rounded-xl w-full">
            <Text className="text-xl font-bold mb-4">Conta não verificada</Text>
            <Text className="mb-6">
              Sua conta ainda não está verificada. Você pode verificar agora
              para acessar todas as funcionalidades.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-300 px-4 py-2 rounded-xl mr-2 text-center flex-1 items-center justify-center"
                onPress={handleContinueWithoutVerification}
              >
                <Text>Continuar sem verificação</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-background px-4 py-2 rounded-xl flex-1 ml-2 items-center justify-center"
                onPress={handleVerifyNow}
              >
                <Text className="text-white font-bold">Verificar agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="bg-fundo px-6 pt-6 pb-4">
        <View className="flex-row items-center">
          <View className="flex-1" />
          <View className="flex-1 items-center">
            <View className="items-center">
              <Dots />
            </View>
          </View>
          <View className="flex-1 items-end">
            <Link href="/create-account" className="text-gray-400">
              <Bell size={20} color="#503B36" />
            </Link>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-6 w-full">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-background rounded-full items-center justify-center">
              <Coffee size={30} color="#FFFFFF" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-600 text-xl">Bom Dia ☀️</Text>
              <Text className="text-3xl font-bold text-background">
                {accountInfo?.name || "Amante de Café"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Link href="/wallet">
              <Wallet size={20} color="#503B36" />
            </Link>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-[40px] gap-5 mb-5">
          <Text className="text-2xl font-bold text-background">
            O que você gostaria de fazer?
          </Text>
        </View>

        <View className="flex flex-col gap-5">
          <TouchableOpacity
            onPress={() => router.push("/reservation")}
            className="flex-row gap-4 bg-white p-5 rounded-2xl"
          >
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Calendar size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Reservar uma mesa
              </Text>
              <Text className="text-gray-400">
                Reserve seu lugar perfeito para uma experiência aconchegante de
                café
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/menu")}
            className="flex-row gap-4 bg-white p-5 rounded-2xl"
          >
            <View className="bg-background rounded-xl p-5 items-center justify-center">
              <Car size={20} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-background font-bold text-2xl">
                Pedido no Drive-Thru
              </Text>
              <Text className="text-gray-400">
                Retirada rápida, sem esperar na fila
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-4 items-center justify-center">
            <TouchableOpacity
              onPress={() => router.push("/menu")}
              className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4"
            >
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Menu />
              </View>
              <Text className="text-background text-lg font-bold">
                Menu Completo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/loyalty")}
              className="bg-white flex-1 rounded-2xl p-5 items-center justify-center gap-4"
            >
              <View className="p-5 bg-fundoescuro rounded-xl items-center justify-center">
                <Star />
              </View>
              <Text className="text-background text-lg font-bold">
                Recompensas
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-background p-8 rounded-2xl gap-4">
            <Text className="text-white font-bold text-2xl">
              ☕ Especial do Dia
            </Text>
            <Text className="text-gray-300 text-xl">
              Compre qualquer café grande + ganhe um croissant grátis 🥐
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/promotions")}
              className="h-14 w-32 justify-center items-center rounded-xl bg-white"
            >
              <Text className="text-background font-bold text-lg">
                Ver Oferta
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-12 mb-6">
          <Text className="text-xl font-bold text-background">
            🔥 Favoritos dos Clientes
          </Text>
          <View className="flex-row items-center gap-2">
            <Link href={"/menu"}>Ver todos</Link>
            <ArrowRight size={20} color="#503B36" />
          </View>
        </View>

        <View className="flex gap-5 mb-10">
          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coffee.jpeg")}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1">
              <Text className="text-background font-bold text-xl">
                Cappuccino Signature
              </Text>
              <Text className="text-gray-400 text-lg">
                Espresso rico com espuma aveludada
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">
                  R$ 4,50
                </Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>

          <View className="p-5 bg-white flex-row gap-5 rounded-2xl items-center">
            <Image
              source={require("../assets/images/coldbrew.jpg")}
              className="w-20 h-20 rounded-xl"
            />
            <View className="flex-1">
              <Text className="text-background font-bold text-xl">
                Cold Brew Especial
              </Text>
              <Text className="text-gray-400 text-lg">
                Cold brew suave de 12 horas
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-background font-bold text-lg">
                  R$ 4,50
                </Text>
                <Text className="text-background text-lg">4.9</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row justify-between items-center bg-white p-6 border-t border-gray-300 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => router.push("/myreservation")}
          className="p-4"
        >
          <Coffee size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/reservation")}
          className="p-4"
        >
          <Calendar size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/menu")}
          className="bg-background rounded-2xl px-8 py-4 flex-row items-center justify-center gap-2"
        >
          <Text className="text-white text-xl font-bold text-center">
            Pedir
          </Text>
          <Menu size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/loyalty")}
          className="p-4"
        >
          <Star size={20} color="#503B36" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="p-4"
        >
          <User size={20} color="#503B36" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
