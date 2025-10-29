import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AuthHeader from "@/components/AuthHeader";
import FormInput from "@/components/FormInput";
import LoadingButton from "@/components/LoadingButton";
import { useRecoverPassword } from "@/hooks/useRecoverPassword";

export default function RecoverPassword() {
  const router = useRouter();
  const { email, setEmail, loading, handleRecover } = useRecoverPassword();

  return (
    <ScrollView className="flex-1 bg-fundo p-6">
      <AuthHeader title="Recuperar Password" subtitle="Vamos te ajudar" />

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Esqueceu a sua password?
        </Text>
        <Text className="text-gray-600 text-xl">
          Insira o seu email para receber um código de verificação.
        </Text>
      </View>

      <View className="mt-10 gap-6">
        <FormInput
          label="Endereço de Email"
          placeholder="Insira o seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <LoadingButton
          title="Enviar Código"
          isLoading={loading}
          onPress={handleRecover}
          className="mt-4"
        />
      </View>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        className="mt-6 flex items-center"
      >
        <Text className="text-black font-semibold">
          Lembrou a sua password?{" "}
          <Text className="text-background">Entrar</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
