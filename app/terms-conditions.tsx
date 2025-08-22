import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import DotsWhite from "@/components/DotsWhite";

export default function TermsConditions() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="items-center">
          <DotsWhite />
        </View>
        <View className="flex-row gap-4 items-center">
          <Link href={"/create-account"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">
            Terms and Conditions
          </Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-xl text-gray-700 leading-6">
          Welcome to Coffee Buzz! By accessing or using our application, you
          agree to comply with and be bound by the following Terms and
          Conditions. Please read them carefully.{"\n\n"}
          <Text className="font-bold">1. Acceptance of Terms{"\n"}</Text>
          By creating an account or placing an order through Coffee Buzz, you
          acknowledge that you have read, understood, and agree to these Terms.
          If you do not agree, please do not use the app.{"\n\n"}
          <Text className="font-bold">2. Eligibility{"\n"}</Text>
          You must be at least 16 years old to use Coffee Buzz. By using the
          app, you represent and warrant that you meet this requirement.{"\n\n"}
          <Text className="font-bold">3. Orders & Payment{"\n"}</Text>
          All prices are listed in Meticais (MZN) and include applicable taxes
          unless stated otherwise. Orders are subject to acceptance and
          availability. We reserve the right to refuse or cancel any order.
          Payments can be made through wallet balance, M-Pesa, bank card, or
          other methods displayed at checkout.{"\n\n"}
          <Text className="font-bold">4. Loyalty Points{"\n"}</Text>
          Points earned through purchases and promotions have no cash value and
          are non-transferable. Coffee Buzz may modify or discontinue the
          loyalty program at any time.{"\n\n"}
          <Text className="font-bold">5. User Conduct{"\n"}</Text>
          You agree not to misuse the app, create fraudulent accounts, or engage
          in any activity that could harm Coffee Buzz or its users.{"\n\n"}
          <Text className="font-bold">6. Limitation of Liability{"\n"}</Text>
          Coffee Buzz shall not be liable for any indirect, incidental, or
          consequential damages arising from your use of the app.{"\n\n"}
          <Text className="font-bold">7. Changes to Terms{"\n"}</Text>
          We may update these Terms from time to time. Continued use of Coffee
          Buzz constitutes acceptance of any changes.{"\n\n"}
          Last updated: 19 July 2025. For questions, contact{" "}
          <Text className="text-brown-600">support@coffeebuzz.com</Text>.
        </Text>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Accept & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
