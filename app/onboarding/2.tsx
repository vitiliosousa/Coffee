import OnboardingScreen from "@/components/OnboardingScreen";
import { Heart } from "lucide-react-native";

export default function Onboarding2() {
  return (
    <OnboardingScreen
      icon={Heart}
      iconBgColor="bg-pink-500"
      iconColor="#FFFFFF"
      title="Personalizado só para si"
      description="Defina as suas preferências e obtenha recomendações personalizadas, ofertas exclusivas em e recompensas que correspondem ao seu gosto."
      nextRoute="/onboarding/3"
      skipRoute="/login"
      activeDotIndex={1}
      totalDots={3}
      buttonBgColor="bg-pink-500"
    />
  );
}

