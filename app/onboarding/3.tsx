import OnboardingScreen from "@/components/OnboardingScreen";
import { Smartphone } from "lucide-react-native";

export default function Onboarding3() {
  return (
    <OnboardingScreen
      icon={Smartphone}
      iconBgColor="bg-blue-500"
      iconColor="#FFFFFF"
      title="Encomende com facilidade"
      description="Navegue pelo nosso menu, personalize as suas bebidas e faça os seus pedidos sem esforço. Evite a fila e desfrute do seu café."
      nextRoute="/login" // Última tela de onboarding vai para o login
      skipRoute="/login"
      activeDotIndex={2}
      totalDots={3}
      buttonBgColor="bg-blue-500"
    />
  );
}

