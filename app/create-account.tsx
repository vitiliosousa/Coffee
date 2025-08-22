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
import { Coffee } from "lucide-react-native";
import Dots from "@/components/Dots";
import { useState } from "react";
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
    <ScrollView className="flex-1 bg-fundo p-6">
      <View className="items-center">
        <Dots />
      </View>

      <View className="flex-row items-center mt-12">
        <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
          <Coffee size={30} color="#503B36" />
        </View>
        <View className="ml-3">
          <Text className="text-4xl font-bold text-background">Welcome!</Text>
          <Text className="text-gray-600 text-xl">Let’s get you started</Text>
        </View>
      </View>

      <View className="mt-[60px] gap-3">
        <Text className="text-3xl font-bold text-background">
          Create your account
        </Text>
        <Text className="text-gray-600 text-xl">
          Join thousands of coffee lovers
        </Text>
      </View>

      <View className="mt-10 gap-4">
        <View>
          <Text className="text-background mb-2 font-semibold">Full Name</Text>
          <TextInput
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

        <View>
          <Text className="text-background mb-2 font-semibold">
            Phone Number
          </Text>
          <TextInput
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

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
          <TextInput
            placeholder="Create a password"
            secureTextEntry={true}
            autoCapitalize="none"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
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
            <Text className="text-white font-semibold">Create account</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="mt-6 flex items-center">
        <Text className="text-black font-semibold">
          Already have an account?{" "}
          <Link href="/login" className="text-background">
            Log in
          </Link>
        </Text>
      </View>

      <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
        By creating an account, you agree to our{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link className="text-background underline" href="/terms-conditions">
          Privacy Policy
        </Link>
        .
      </Text>
    </ScrollView>
  );
}
