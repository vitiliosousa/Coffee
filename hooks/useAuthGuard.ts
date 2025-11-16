import { useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { authService } from "@/services/auth.service";
import { useCallback } from "react";

/**
 * Hook para proteger rotas que necessitam de autenticação
 * Redireciona para /login se o usuário não estiver autenticado
 * Verifica autenticação sempre que a tela ganha foco
 */
export function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const authenticated = await authService.isAuthenticated();

      if (!authenticated) {
        // Usuário não autenticado, redirecionar para login
        setIsAuthenticated(false);
        setIsChecking(false);
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setIsAuthenticated(false);
      router.replace("/login");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  // Verificar na montagem inicial
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Verificar sempre que a tela ganhar foco (importante para detectar logout)
  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth])
  );

  return { isChecking, isAuthenticated };
}
