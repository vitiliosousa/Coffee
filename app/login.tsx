import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Coffee, Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { authService } from "@/services/auth.service";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 Evita comportamento problemático do teclado no web
  const dismissKeyboard = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      Alert.alert("Sucesso", `Bem-vindo, ${response.data.user.name}!`);
      router.replace("/home?fromLogin=true");
    } catch (error: any) {
      Alert.alert("Erro no login", error.message || "Não foi possível logar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-fundo"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          >
            {/* Header */}
            <View className="flex-row items-center mt-12">
              <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
                <Coffee size={30} color="#503B36" />
              </View>
              <View className="ml-3">
                <Text className="text-4xl font-bold text-background">
                  Bem-vindo de volta!
                </Text>
                <Text className="text-gray-600 text-xl">
                  Bom ver você de novo
                </Text>
              </View>
            </View>

            {/* Texto de introdução */}
            <View className="mt-[60px] gap-3">
              <Text className="text-3xl font-bold text-background">
                Entrar na sua conta
              </Text>
              <Text className="text-gray-600 text-xl">
                Acesse a sua comunidade de café
              </Text>
            </View>

            {/* Inputs */}
            <View className="mt-10 gap-6 flex-1">
              {/* Email */}
              <View>
                <Text className="text-background mb-2 font-semibold">
                  Endereço de Email
                </Text>
                <TextInput
                  placeholder="Insira o seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
                  onFocus={dismissKeyboard}
                />
              </View>

              {/* Password */}
              <View>
                <Text className="text-background mb-2 font-semibold">
                  Password
                </Text>
                <View className="flex-row items-center border bg-white border-fundoescuro rounded-lg pr-4">
                  <TextInput
                    placeholder="Insira a sua password"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={formData.password}
                    onChangeText={(text) =>
                      setFormData({ ...formData, password: text })
                    }
                    className="flex-1 px-4 py-4 text-lg"
                    onFocus={dismissKeyboard}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#BCA9A1" />
                    ) : (
                      <Eye size={20} color="#BCA9A1" />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => router.push("/recover-password")}
                  className="self-end mt-2"
                >
                  <Text className="text-background text-sm">
                    Esqueceu a password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Botão de login */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className="mt-4 flex items-center bg-background rounded-full py-4"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Entrar</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Criar conta */}
            <TouchableOpacity
              onPress={() => router.push("/create-account")}
              className="mt-6 flex items-center"
            >
              <Text className="text-black font-semibold">
                Não possui uma conta?{" "}
                <Text className="text-background">Criar</Text>
              </Text>
            </TouchableOpacity>

            {/* Termos */}
            <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
              Ao entrar, você concorda com os{" "}
              <Link
                className="text-background underline"
                href="/terms-conditions"
              >
                Termos & Condições
              </Link>{" "}
              e as{" "}
              <Link
                className="text-background underline"
                href="/terms-conditions"
              >
                Políticas de Privacidade
              </Link>
            </Text>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
