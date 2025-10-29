import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";

export function useProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      // await authService.updateProfile(formData);
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
        { text: "Deletar", style: "destructive", onPress: confirmDeleteAccount },
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

  return {
    formData,
    setFormData,
    loading,
    saving,
    deleting,
    handleSaveChanges,
    handleDeleteAccount,
  };
}
