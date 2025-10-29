import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { ChevronLeft, User } from "lucide-react-native";
import { useProfile } from "@/hooks/useProfile";

export default function Profile() {
  const {
    formData,
    setFormData,
    loading,
    saving,
    deleting,
    handleSaveChanges,
    handleDeleteAccount,
  } = useProfile();

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

        <View className="mt-8">
          <Text className="text-lg font-semibold mb-2 text-background">Nome Completo</Text>
          <TextInput
            placeholder="Insira o seu nome completo"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
          />
        </View>

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
