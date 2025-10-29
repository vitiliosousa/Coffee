import { View } from "react-native";

interface DotsProps {
  activeIndex: number;
  totalDots: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function Dots({
  activeIndex,
  totalDots,
  activeColor = "bg-orange-500", // Cor padrão para o dot ativo
  inactiveColor = "bg-gray-300", // Cor padrão para os dots inativos
}: DotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-3">
      {Array.from({ length: totalDots }).map((_, index) => (
        <View
          key={index}
          className={`h-3 rounded-full ${
            index === activeIndex ? `w-10 ${activeColor}` : `w-3 ${inactiveColor}`
          }`}
        />
      ))}
    </View>
  );
}
