import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Coffee } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authService } from "@/services/auth.service";

export default function CreateAccount() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    const { name, phone, email, password } = formData;

    if (!name || !phone || !email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name,
        phone,
        email,
        password,
      });

      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-fundo p-6"
      extraScrollHeight={40}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Cabeçalho */}
      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Coffee size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">Bem-vindo!</Text>
          <Text className="text-gray-600 text-xl">Vamos começar</Text>
        </View>
      </View>

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
        <View>
          <Text className="text-background mb-2 font-semibold">Nome Completo</Text>
          <TextInput
            placeholder="Insira o seu nome completo"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            returnKeyType="next"
          />
        </View>

        <View>
          <Text className="text-background mb-2 font-semibold">
            Número de Telefone
          </Text>
          <TextInput
            placeholder="Insira o seu número de telefone"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            returnKeyType="next"
          />
        </View>

        <View>
          <Text className="text-background mb-2 font-semibold">
            Endereço de Email
          </Text>
          <TextInput
            placeholder="Insira o seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            returnKeyType="next"
          />
        </View>

        <View>
          <Text className="text-background mb-2 font-semibold">Password</Text>
          <TextInput
            placeholder="Crie a sua password"
            secureTextEntry
            autoCapitalize="none"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          onPress={handleCreateAccount}
          disabled={loading}
          className="mt-6 flex items-center bg-background rounded-full py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Criar conta</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Login e Termos */}
      <View className="mt-6 flex items-center">
        <Text className="text-black font-semibold">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-background">
            Entrar
          </Link>
        </Text>
      </View>

      <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
        Ao criar uma conta, você concorda com os{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Termos & Condições
        </Link>{" "}
        e{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Políticas de Privacidade
        </Link>
        .
      </Text>
    </KeyboardAwareScrollView>
  );
}
