import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { LucideIcon, ChevronRight } from "lucide-react-native";
import Dots from "./Dots";

interface OnboardingScreenProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  nextRoute: string;
  skipRoute: string;
  activeDotIndex: number;
  totalDots: number;
  buttonBgColor: string;
}

export default function OnboardingScreen({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  nextRoute,
  skipRoute,
  activeDotIndex,
  totalDots,
  buttonBgColor,
}: OnboardingScreenProps) {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white p-6">
      {/* Header */}
      <View className="flex-row items-center">
        <View className="flex-1" />
        <View className="flex-1 items-end">
          <Link href={skipRoute} className="text-gray-400">
            Pular
          </Link>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center gap-6">
        <View className={`flex rounded-3xl items-center justify-center p-10 ${iconBgColor}`}>
          <Icon color={iconColor} size={90} />
        </View>
        <Text className="text-4xl font-bold text-center mb-3">
          {title}
        </Text>
        <Text className="text-center text-xl text-gray-600 px-4">
          {description}
        </Text>
        <View className="flex-row gap-3 mt-8">
          <Dots activeIndex={activeDotIndex} totalDots={totalDots} />
        </View>
      </View>

      {/* Navigation Button */}
      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={() => router.replace(nextRoute)}
          className={`w-14 h-14 rounded-full items-center justify-center ${buttonBgColor}`}
        >
          <ChevronRight size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
