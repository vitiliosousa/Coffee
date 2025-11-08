import { Stack } from "expo-router";
import "./global.css";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right", "bottom"]}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </CartProvider>
  );
}
