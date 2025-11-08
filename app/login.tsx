import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthHeader from "@/components/AuthHeader";
import PasswordInput from "@/components/PasswordInput";
import LoadingButton from "@/components/LoadingButton";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  const { handleLogin, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-fundo"
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      extraScrollHeight={40}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
          <AuthHeader
            title="Bem-vindo de volta!"
            subtitle="Bom ver você de novo"
          />

          <View className="mt-[60px] gap-3">
            <Text className="text-3xl font-bold text-background">
              Entrar na sua conta
            </Text>
            <Text className="text-gray-600 text-xl">
              Acesse a sua comunidade de café
            </Text>
          </View>

          <View className="mt-10 gap-6 flex-1">
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
              />
            </View>

            <View>
              <PasswordInput
                label="Password"
                placeholder="Insira a sua password"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />

              <TouchableOpacity
                onPress={() => router.push("/recover-password")}
                className="self-end mt-2"
              >
                <Text className="text-background text-sm">
                  Esqueceu a password?
                </Text>
              </TouchableOpacity>
            </View>

            <LoadingButton
              title="Entrar"
              isLoading={loading}
              onPress={() =>
                handleLogin({
                  email: formData.email,
                  password: formData.password,
                })
              }
              className="mt-4"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/create-account")}
            className="mt-6 flex items-center"
          >
            <Text className="text-black font-semibold">
              Não possui uma conta?{" "}
              <Text className="text-background">Criar</Text>
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-sm text-center mt-10 mb-6">
            Ao entrar, você concorda com os{" "}
            <Link className="text-background underline" href="/terms-conditions">
              Termos & Condições
            </Link>{" "}
            e as{" "}
            <Link className="text-background underline" href="/privacy-policy">
              Políticas de Privacidade
            </Link>
          </Text>
    </KeyboardAwareScrollView>
  );
}
