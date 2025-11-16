import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* HEADER FIXO */}
      <View className="bg-background p-6 gap-6">
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color={"#FFFFFF"} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">
            Política de Privacidade
          </Text>
        </View>
      </View>

      {/* CONTEÚDO SCROLLÁVEL */}
      <ScrollView
        className="flex-1 px-6 py-6"
        contentContainerStyle={{ paddingBottom: 120 }} // <-- espaço extra no fim
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl text-gray-700 leading-6">
          A sua privacidade é importante para nós. Esta Política de Privacidade
          explica como o Coffee Buzz coleta, utiliza, armazena e protege as suas
          informações pessoais quando você utiliza o nosso aplicativo.{"\n\n"}

          <Text className="font-bold">1. Coleta de Informações{"\n"}</Text>
          Podemos coletar informações pessoais como nome, e-mail, número de
          telefone, endereço e dados de pagamento quando você cria uma conta,
          realiza um pedido ou entra em contato conosco. Também coletamos
          informações automaticamente, como o tipo de dispositivo, sistema
          operacional e endereço IP.{"\n\n"}

          <Text className="font-bold">2. Uso das Informações{"\n"}</Text>
          As informações coletadas são utilizadas para processar pedidos,
          oferecer suporte, melhorar a experiência do usuário, enviar
          notificações sobre promoções e atualizar nossos serviços.{"\n\n"}

          <Text className="font-bold">3. Compartilhamento de Dados{"\n"}</Text>
          O Coffee Buzz não vende, aluga nem comercializa informações pessoais.
          No entanto, podemos compartilhar dados com parceiros de pagamento,
          entregadores e prestadores de serviços que auxiliam na operação do
          aplicativo — sempre com o compromisso de confidencialidade e
          segurança.{"\n\n"}

          <Text className="font-bold">4. Segurança das Informações{"\n"}</Text>
          Utilizamos medidas técnicas e administrativas adequadas para proteger
          seus dados contra acesso não autorizado, perda ou uso indevido.
          Contudo, nenhum método de transmissão eletrônica é 100% seguro, e não
          podemos garantir segurança absoluta.{"\n\n"}

          <Text className="font-bold">5. Seus Direitos{"\n"}</Text>
          Você pode solicitar a exclusão da sua conta ou a atualização de seus
          dados pessoais a qualquer momento, entrando em contato através do
          nosso suporte.{"\n\n"}

          <Text className="font-bold">6. Cookies e Tecnologias Semelhantes{"\n"}</Text>
          O aplicativo pode utilizar cookies e ferramentas analíticas para
          melhorar o desempenho e personalizar sua experiência de uso.{"\n\n"}

          <Text className="font-bold">7. Alterações nesta Política{"\n"}</Text>
          Podemos atualizar esta Política de Privacidade periodicamente. As
          alterações entram em vigor imediatamente após a publicação.{"\n\n"}

          Última atualização: 27 de Outubro de 2025. Para dúvidas, entre em
          contato com{" "}
          <Text className="text-brown-600">privacy@coffeebuzz.com</Text>.
        </Text>
      </ScrollView>

      {/* FOOTER FIXO */}
      <View className="border-t border-gray-200 p-6 bg-white absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full h-14 rounded-full bg-background items-center justify-center shadow-md"
        >
          <Text className="text-white font-bold text-lg">Aceitar e Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
