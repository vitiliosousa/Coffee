import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthHeader from "@/components/AuthHeader";
import FormInput from "@/components/FormInput";
import PasswordInput from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { useRegister } from "@/hooks/useRegister";
import { authService } from "@/services/auth.service";

export default function CreateAccount() {
  const router = useRouter();
  const { handleRegister, loading } = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  // Redirecionar para home se já estiver logado
  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const isAuthenticated = await authService.isAuthenticated();
      if (isAuthenticated) {
        router.replace("/home");
      }
    };
    checkIfLoggedIn();
  }, [router]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-fundo p-6"
      extraScrollHeight={40}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Cabeçalho */}
      <AuthHeader title="Bem-vindo!" subtitle="Vamos começar" />

      {/* Introdução */}
      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Crie sua conta
        </Text>
        <Text className="text-gray-600 text-xl">
          Junte-se aos milhares de amantes do café
        </Text>
      </View>

      {/* Formulário */}
      <View className="mt-10 gap-4">
        <FormInput
          label="Nome Completo"
          placeholder="Insira o seu nome completo"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          returnKeyType="next"
        />

        <FormInput
          label="Número de Telefone"
          placeholder="Insira o seu número de telefone"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          returnKeyType="next"
        />

        <FormInput
          label="Endereço de Email"
          placeholder="Insira o seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          returnKeyType="next"
        />

        <PasswordInput
          label="Password"
          placeholder="Crie a sua password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          returnKeyType="done"
        />

        <LoadingButton
          title="Criar conta"
          isLoading={loading}
          onPress={() => handleRegister(formData)}
          className="mt-6"
        />
      </View>

      {/* Login e Termos */}
      <TouchableOpacity
        onPress={() => router.replace("/login")}
        className="mt-6 flex items-center"
      >
        <Text className="text-black font-semibold">
          Já possui uma conta?{" "}
          <Text className="text-background">Entrar</Text>
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
        Ao criar uma conta, você concorda com os{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Termos & Condições
        </Link>{" "}
        e{" "}
        <Link className="text-background underline" href="/privacy-policy">
          Políticas de Privacidade
        </Link>
        .
      </Text>
    </KeyboardAwareScrollView>
  );
}
