import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
export default function TermsConditions() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <Link href={"/create-account"}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </Link>
          <Text className="text-white text-2xl font-bold">
            Termos e Condições
          </Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView className="flex-1 px-6 py-6">
        <Text className="text-xl text-gray-700 leading-6">
          Bem-vindo ao Coffee Buzz! Ao acessar ou usar nosso aplicativo, você
          concorda em cumprir e ficar vinculado aos seguintes Termos e Condições.
          Por favor, leia-os com atenção.{"\n\n"}
          <Text className="font-bold">1. Aceitação dos Termos{"\n"}</Text>
          Ao criar uma conta ou fazer um pedido através do Coffee Buzz, você
          reconhece que leu, entendeu e concorda com estes Termos. Se você não
          concordar, por favor, não use o aplicativo.{"\n\n"}
          <Text className="font-bold">2. Elegibilidade{"\n"}</Text>
          Você deve ter pelo menos 16 anos de idade para usar o Coffee Buzz. Ao usar o
          aplicativo, você declara e garante que atende a este requisito.{"\n\n"}
          <Text className="font-bold">3. Pedidos & Pagamento{"\n"}</Text>
          Todos os preços são listados em Meticais (MZN) e incluem impostos
          aplicáveis, a menos que indicado o contrário. Os pedidos estão sujeitos a
          aceitação e disponibilidade. Reservamo-nos o direito de recusar ou cancelar
          qualquer pedido. Os pagamentos podem ser feitos através de saldo da carteira,
          M-Pesa, cartão bancário ou outros métodos exibidos no checkout.{"\n\n"}
          <Text className="font-bold">4. Pontos de Fidelidade{"\n"}</Text>
          Os pontos ganhos através de compras e promoções não têm valor em dinheiro e
          não são transferíveis. O Coffee Buzz pode modificar ou descontinuar o
          programa de fidelidade a qualquer momento.{"\n\n"}
          <Text className="font-bold">5. Conduta do Usuário{"\n"}</Text>
          Você concorda em não usar mal o aplicativo, criar contas fraudulentas ou se
          envolver em qualquer atividade que possa prejudicar o Coffee Buzz ou seus
          usuários.{"\n\n"}
          <Text className="font-bold">6. Limitação de Responsabilidade{"\n"}</Text>
          O Coffee Buzz não será responsável por quaisquer danos indiretos, incidentais
          ou consequentes decorrentes do uso do aplicativo.{"\n\n"}
          <Text className="font-bold">7. Alterações dos Termos{"\n"}</Text>
          Podemos atualizar estes Termos periodicamente. O uso contínuo do Coffee
          Buzz constitui aceitação de quaisquer alterações.{"\n\n"}
          Última atualização: 27 de Outubro de 2025. Para dúvidas, entre em contato com{" "}
          <Text className="text-brown-600">support@coffeebuzz.com</Text>.
        </Text>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white">
        <View className="items-end">
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
          >
            <Text className="text-white font-bold text-lg">Aceitar e Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}