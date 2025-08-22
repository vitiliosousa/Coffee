import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { Coffee, Eye, EyeOff } from "lucide-react-native";
import Dots from "@/components/Dots";
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

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Erro no login", error.message || "Não foi possível logar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-fundo p-6">
      <View className="items-center">
        <Dots />
      </View>

      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Coffee size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">
            Welcome back!
          </Text>
          <Text className="text-gray-600 text-xl">Nice to see you again</Text>
        </View>
      </View>

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Login to your account
        </Text>
        <Text className="text-gray-600 text-xl">
          Access your coffee community
        </Text>
      </View>

      <View className="mt-10 gap-6">
        <View>
          <Text className="text-background mb-2 font-semibold">
            Email Address
          </Text>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

        <View>
          <Text className="text-background mb-2 font-semibold">Password</Text>
          <View className="flex-row items-center border bg-white border-fundoescuro rounded-lg pr-4">
            <TextInput
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              className="flex-1 px-4 py-4 text-lg"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#BCA9A1" />
              ) : (
                <Eye size={20} color="#BCA9A1" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/terms-conditions")}
            className="self-end mt-2"
          >
            <Text className="text-background text-sm">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mt-4 flex items-center bg-background rounded-full py-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Login</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/create-account")}
        className="mt-6 flex items-center"
      >
        <Text className="text-black font-semibold">
          Don't have an account?{" "}
          <Text className="text-background">Create one</Text>
        </Text>
      </TouchableOpacity>

      <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
        By logging in, you agree to our{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Privacy Policy
        </Link>
      </Text>
    </ScrollView>
  );
}
