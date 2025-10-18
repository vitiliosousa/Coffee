import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Link } from "expo-router";
import { ChevronLeft, User } from "lucide-react-native";
import { authService } from "@/services/auth.service";

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Carregar dados do usuário quando a tela carrega
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await authService.getAccountInfo();
      
      if (response.data?.account) {
        const account = response.data.account;
        setFormData({
          name: account.name || "",
          phone: account.phone || "",
          email: account.email || "",
        });
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível carregar os dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios");
      return;
    }

    setSaving(true);

    try {
      // Aqui você implementaria a chamada para atualizar o perfil
      // const response = await authService.updateProfile(formData);
      
      Alert.alert("Sucesso", "Dados salvos com sucesso!");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível salvar as alterações");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Deletar Conta",
      "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive",
          onPress: confirmDeleteAccount
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      
      // await authService.deleteAccount();
      
      Alert.alert("Conta deletada", "Sua conta foi deletada com sucesso");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível deletar a conta");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#503B36" />
        <Text className="text-lg mt-4 text-gray-600">Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/home"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">Editar Perfil</Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        <View className="flex-1 items-center justify-center">
          <View className="bg-gray-300 rounded-full p-8">
            <User size={60} color="#6b7280" />
          </View>
        </View>

        {/* Full Name */}
        <View className="mt-8">
          <Text className="text-lg font-semibold mb-2 text-background">Nome Completo</Text>
          <TextInput
            placeholder="Insira o seu nome completo"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

        {/* Phone Number */}
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2 text-background">Número de Telefone</Text>
          <TextInput
            placeholder="Insira o seu número de telefone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2 text-background">Email</Text>
          <TextInput
            placeholder="Insira o seu email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="flex-col gap-3">
          {/* Botão de Salvar */}
          <TouchableOpacity
            onPress={handleSaveChanges}
            disabled={saving}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Salvar Alterações</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={deleting}
            className="w-full h-14 rounded-full bg-red-600 items-center justify-center shadow-md"
          >
            {deleting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Apagar Conta</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}