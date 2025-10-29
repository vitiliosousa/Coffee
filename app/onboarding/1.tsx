import OnboardingScreen from "@/components/OnboardingScreen";
import { Coffee } from "lucide-react-native";

export default function Onboarding1() {
  return (
    <OnboardingScreen
      icon={Coffee}
      iconBgColor="bg-orange-500"
      iconColor="#FFFFFF"
      title="Bem vindo ao Coffee Buzz"
      description="Descubra as melhores misturas de café e os doces artesanais. A sua experiência perfeita começa aqui."
      nextRoute="/onboarding/2"
      skipRoute="/login"
      activeDotIndex={0}
      totalDots={3}
      buttonBgColor="bg-orange-500"
    />
  );
}
