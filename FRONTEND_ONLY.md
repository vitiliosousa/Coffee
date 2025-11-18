# Brewhouse Loyalty Mobile - Frontend Only

## Resumo das Alterações

Este documento descreve as alterações realizadas para transformar o aplicativo Brewhouse Loyalty Mobile em uma versão **frontend-only**, removendo todas as integrações com a API e substituindo por dados mockados.

## Alterações Realizadas

### 1. Criação de Dados Mockados

Todos os dados mockados foram criados na pasta `/mocks`:

#### 1.1. **userData.ts**
- Mock do usuário autenticado
- Token de autenticação mockado
- Dados: nome, email, telefone, saldo da carteira (2.500,00 MT), pontos de fidelidade (850)

#### 1.2. **productsData.ts**
- 5 categorias: Cervejas, Petiscos, Hambúrgueres, Bebidas, Sobremesas
- 15 produtos com imagens, preços e descrições
- Produtos incluem: IPA Artesanal, Pilsen Premium, Asas de Frango, Brewhouse Burger, etc.

#### 1.3. **ordersData.ts**
- 3 pedidos de exemplo com diferentes status (pronto, preparando, concluído)
- Pedidos incluem itens detalhados, valores, endereços, mesas, etc.
- Store mutável para adicionar novos pedidos durante a execução

#### 1.4. **reservationsData.ts**
- 4 reservas de exemplo (confirmadas, concluídas, canceladas)
- Horários disponíveis mockados (12:00 às 22:00)
- Store mutável para adicionar novas reservas

#### 1.5. **transactionsData.ts**
- 10 transações de exemplo (recargas, pagamentos, reembolsos, bônus)
- Histórico completo de movimentações da carteira
- Store mutável para adicionar novas transações

#### 1.6. **campaignsData.ts**
- 4 campanhas ativas (Happy Hour, Combos, Fidelidade, Sexta do Petisco)
- Histórico de fidelidade com 8 registros
- Estatísticas de uso do programa de fidelidade

---

### 2. Serviços Mockados

Todos os 4 serviços foram modificados para usar dados mockados:

#### 2.1. **auth.service.ts**
**Removido:**
- Todas as chamadas HTTP via `fetch()` para a API
- Métodos `makeRequest()` e `makeAuthenticatedRequest()`
- URL base da API

**Adicionado:**
- Método `delay()` para simular latência de rede (500ms)
- Login/registro instantâneo com dados mockados
- Retorno de saldo e pontos de fidelidade atualizados
- Filtragem local de transações
- Validação de OTP mockada (aceita qualquer código de 6 dígitos)

**Funcionalidades mantidas:**
- Autenticação com AsyncStorage
- Gerenciamento de token
- Gerenciamento de dados do usuário
- Recarga de carteira (atualiza saldo localmente)
- Listagem e filtragem de transações

#### 2.2. **admin.service.ts**
**Removido:**
- Todas as chamadas HTTP via `fetch()`
- Método `makeAuthenticatedRequest()`

**Adicionado:**
- Retorno de categorias e produtos mockados
- Busca local por produtos
- Filtro de produtos por categoria
- Campanhas ativas com validação de datas
- Geração de código de pagamento aleatório
- Histórico de fidelidade mockado

**Funcionalidades mantidas:**
- Listagem de categorias
- Listagem de produtos (com filtro opcional)
- Busca de produtos
- Detalhes de produto por ID
- Campanhas ativas
- Pedidos em andamento
- Histórico de fidelidade

#### 2.3. **order.service.ts**
**Removido:**
- Todas as chamadas HTTP
- Método `makeAuthenticatedRequest()`
- Logs de debug HTTP

**Adicionado:**
- Criação local de pedidos
- Atualização de saldo ao pagar pedidos via QR
- Validação de saldo antes de pagamento
- Acúmulo de pontos de fidelidade (10% do valor)
- Pedidos armazenados no `ordersStore`

**Funcionalidades mantidas:**
- Criação de pedidos (drive-thru, delivery)
- Busca de pedido por ID
- Transação via código de pagamento

#### 2.4. **reservation.service.ts**
**Removido:**
- Todas as chamadas HTTP
- Método `makeAuthenticatedRequest()`

**Adicionado:**
- Criação local de reservas
- Check-in de reservas (atualiza status)
- Cancelamento de reservas
- Horários disponíveis mockados

**Funcionalidades mantidas:**
- Criar reserva
- Listar reservas do usuário
- Check-in de reserva
- Cancelamento de reserva
- Consultar horários disponíveis

---

### 3. Correções de TypeScript

Foram corrigidos os seguintes erros:

1. **app/payment.tsx**: Ajustado tipo de retorno do `createOrder()` para incluir `data.order`
2. **components/OnboardingScreen.tsx**: Adicionado cast `as any` para rotas do expo-router
3. **components/OtpInput.tsx**: Alterado tipo de evento de `NativeSyntheticEvent<NativeTouchEvent>` para `any`
4. **services/order.service.ts**: Adicionado cast para resolver incompatibilidade entre `Order` e `UserOrder`

---

## Como Funciona Agora

### Autenticação
- Qualquer email/senha são aceitos no login
- Registro sempre funciona
- Token mockado é salvo no AsyncStorage
- OTP sempre válido (qualquer código de 6 dígitos)

### Produtos e Categorias
- 15 produtos mockados em 5 categorias
- Busca funciona localmente por nome/descrição
- Filtro por categoria funciona

### Pedidos
- Pedidos são criados localmente e salvos no `ordersStore`
- Pagamento deduz do saldo mockado da carteira
- Pontos de fidelidade são acumulados (10% do valor)
- Histórico de pedidos mostra os 3 pedidos iniciais + novos criados

### Reservas
- Reservas são criadas localmente
- Check-in e cancelamento funcionam
- Horários disponíveis são fixos (mockados)

### Carteira
- Saldo inicial: 2.500,00 MT
- Recargas atualizam o saldo localmente
- Transações são adicionadas ao `transactionsStore`
- Histórico mostra todas as transações (10 iniciais + novas)

### Fidelidade
- Pontos iniciais: 850
- Acumula 10% do valor de cada pedido
- Histórico mockado com 8 registros
- Estatísticas fixas

---

## Navegação

Toda a navegação entre telas permanece funcional:
- Login → Home
- Menu → Detalhes do Produto → Carrinho → Pagamento → Confirmação
- Reservas → Minhas Reservas
- Carteira → Adicionar Dinheiro → Histórico
- QR Scanner → Pagamento
- E todas as outras telas

---

## Dados Persistentes vs. Voláteis

### Persistente (AsyncStorage):
- Token de autenticação
- Dados do usuário (incluindo saldo e pontos atualizados)
- Itens do carrinho

### Volátil (memória):
- Pedidos criados durante a sessão
- Reservas criadas durante a sessão
- Transações criadas durante a sessão
- *Estes dados são perdidos ao reiniciar o app*

---

## Executar o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

---

## Estrutura de Pastas

```
brewhouse-loyalty-mobile/
├── mocks/                      # Dados mockados
│   ├── userData.ts
│   ├── productsData.ts
│   ├── ordersData.ts
│   ├── reservationsData.ts
│   ├── transactionsData.ts
│   └── campaignsData.ts
├── services/                   # Serviços (agora mockados)
│   ├── auth.service.ts
│   ├── admin.service.ts
│   ├── order.service.ts
│   └── reservation.service.ts
├── app/                        # Telas do aplicativo
├── components/                 # Componentes reutilizáveis
├── contexts/                   # Contextos (CartContext)
└── hooks/                      # Custom hooks
```

---

## Observações Importantes

1. **Sem conexão com API**: Nenhuma requisição HTTP é feita
2. **Dados realistas**: Todos os dados mockados são realistas e completos
3. **Funcionalidades preservadas**: Toda a navegação e UX funcionam normalmente
4. **Simulação de latência**: Delays de 500ms simulam chamadas de rede
5. **Validações locais**: Saldo insuficiente, pedidos duplicados, etc. são validados localmente
6. **TypeScript válido**: Nenhum erro de compilação

---

## Próximos Passos (se necessário)

Para reconectar à API futuramente:
1. Restaurar as URLs base nos serviços
2. Restaurar os métodos `makeRequest()` e `makeAuthenticatedRequest()`
3. Remover imports dos mocks
4. Remover chamadas ao método `delay()`

---

**Data da conversão**: 18 de Novembro de 2025
**Versão**: Frontend-Only v1.0
