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
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: confirmLogout },
      ]
    );
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível fazer logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    saving,
    loggingOut,
    handleSaveChanges,
    handleLogout,
  };
}
