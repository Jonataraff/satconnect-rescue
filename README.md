# SatConnect Rescue
> **Sistema de Internet Emergencial via Satélite para Resposta a Desastres**

O **SatConnect Rescue** é uma plataforma multiplataforma (Android, iOS e Web) desenvolvida para auxiliar a Defesa Civil e equipes de resgate em cenários de desastres naturais (como enchentes, ciclones, deslizamentos e incêndios). Quando a infraestrutura de comunicação terrestre falha (torres de celular derrubadas ou sem energia), o SatConnect mapeia as zonas sem sinal ("Dead Zones"), avalia o risco climático local em tempo real via telemetria de API e sugere o posicionamento estratégico de antenas terrestres móveis e satélites (LEO/GEO) para restabelecer a conectividade emergencial.

---

## 👥 Integrantes do Grupo

| Nome Completo | RM |
| --- | --- |
| Jonata Rafael | RM552939 |
| Diogo Julio | RM553837 |
| Larissa | RM552695 |
| Beatriz Silva | RM553455 |

---



### 1. Painel de Telemetria (Home)
- **Risco Climatológico Automatizado**: Calcula o risco meteorológico (BAIXO, MÉDIO, ALTO) combinando velocidade do vento e índice de chuva obtidos na API do OpenWeatherMap.
- **Conectividade em Tempo Real**: Detecta o status de comunicação local das coordenadas GPS (Normal, Instável, Sob Cobertura de Satélite ou Totalmente Isolado).
- **Frota Ativa**: Lista as unidades de órbita terrestres de satélite cobrindo o país atualmente.

### 2. Mapa de Operações (Mapa)
- **Visualização Nativa & Web**: Usa `react-native-maps` no mobile (com círculos de raio de cobertura) e uma integração interativa baseada em OpenStreetMap para a Web (com barra lateral de navegação dinâmica).
- **Zonas de Sombra (Dead Zones)**: Exibe áreas críticas sem sinal celular (círculos vermelhos no mapa) e a quantidade de torres inoperantes.
- **Posições Satelitais Recomendadas**: Exibe onde as antenas LEO/GEO móveis devem ser estacionadas ou direcionadas (círculos azuis).

### 3. Central de Incidentes (Alertas)
- **Filtros Avançados**: Classificação por gravidade do desastre e categorias de busca rápidas.
- **Acesso Offline (AsyncStorage)**: Permite favoritar alertas urgentes para que permaneçam acessíveis na memória local mesmo se o dispositivo perder completamente o sinal de internet.

### 4. Dashboard Operacional (Dashboard)
- **Gráficos de Categoria**: Gráficos de barra interativos dinâmicos de incidentes por categoria de desastre.
- **Métricas Consolidadas**: Painel resumido com:
  - Total de pessoas afetadas
  - Proporção de satélites ativos/inativos
  - Quantidade de torres celulares danificadas/total
  - Barras de progresso com distribuição de riscos.

### 5. Configurações (Configurações)
- **Persistência de Preferências**: Opções completas de notificação, rastreamento de GPS ativo, taxa de atualização e limite de sensibilidade de riscos salvos de forma persistente local no dispositivo através de AsyncStorage.

---

## Estrutura de Pastas do Projeto

```text
satconnect-rescue/
├── App.tsx                    # Ponto de entrada do aplicativo com SafeArea e StatusBar
├── app.json                   # Configurações do Expo SDK 56
├── package.json               # Dependências do projeto (React Native, Expo, Axios, Navigation, Charts)
├── tsconfig.json              # Configurações do compilador TypeScript
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── AlertCard.tsx            # Card de incidentes com botão de favoritar
│   │   ├── ConnectivityIndicator.tsx # Indicador visual de status (online, offline, satellite, degraded)
│   │   ├── RiskBadge.tsx            # Badge colorido com os níveis de risco (Baixo, Médio, Alto)
│   │   └── StatusCard.tsx           # Cards de telemetria climática
│   ├── navigation/            # Navegação do aplicativo
│   │   └── AppNavigator.tsx         # Bottom Tab Navigation (Home, Mapa, Alertas, Dashboard, Configurações)
│   ├── screens/               # Telas do aplicativo (Mobile & Web)
│   │   ├── HomeScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── MapScreen.tsx            # Versão Mobile (react-native-maps)
│   │   ├── MapScreen.web.tsx        # Versão Web (iframe OpenStreetMap + Sidebar interativa)
│   │   └── SettingsScreen.tsx
│   ├── services/              # Integração com APIs e serviços
│   │   ├── connectivityService.ts   # Simulações de infraestrutura e estatísticas reais
│   │   ├── locationService.ts       # Serviços de Geolocalização (expo-location)
│   │   └── weatherService.ts        # Integração com a API do OpenWeatherMap
│   ├── storage/               # Persistência local com AsyncStorage
│   │   ├── favoritesStorage.ts      # Salva, remove e lê alertas favoritos
│   │   └── settingsStorage.ts       # Carrega e atualiza configurações do usuário
│   ├── theme/                 # Paleta de cores global
│   │   └── colors.ts                # Definição visual dark mode premium
│   ├── types/                 # Tipagens globais TypeScript
│   │   └── types.ts                 # Interfaces estruturais de Clima, Alertas, Satélites e Configurações
│   └── utils/                 # Funções auxiliares
│       └── riskCalculator.ts        # Lógica matemática de cálculo de risco por chuva/vento
```

---

## Tecnologias Utilizadas

- **Expo SDK 56** (Ambiente de desenvolvimento React Native acelerado)
- **TypeScript** (Tipagem forte em todo o fluxo de dados)
- **React Navigation (Bottom Tabs)** (Navegação fluida entre as 5 abas da aplicação)
- **AsyncStorage** (Banco de dados local chave-valor para persistência offline)
- **Axios** (Consumo da API climática)
- **React Native Chart Kit** (Visualização gráfica no Dashboard)
- **React Native SVG** (Suporte a renderização vetorial dos gráficos)
- **OpenWeatherMap API** (Dados de chuva, vento e temperatura em tempo real)

---

## Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Gerenciador de pacotes `npm` ou `yarn`

### 1. Clonar o repositório e instalar dependências
Navegue até a pasta do projeto e execute:
```bash
npm install
```

### 2. Configurar a chave da API do OpenWeatherMap
Por motivos de segurança, o GitHub bloqueia a publicação de chaves de API expostas no código. Para que a telemetria climática funcione corretamente no aplicativo, configure sua própria chave de API:

1. Crie uma conta gratuita em [OpenWeatherMap](https://openweathermap.org/api) e obtenha uma chave de API.
2. Crie um arquivo chamado `.env` na raiz do projeto (este arquivo já está configurado no `.gitignore`).
3. Adicione a seguinte linha no arquivo `.env`, substituindo `SUA_CHAVE_AQUI` pela chave que você gerou:
   ```env
   EXPO_PUBLIC_OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
   ```

### 3. Executar na Web (Navegador)
Para rodar a versão otimizada para web usando a sidebar interativa com mapa OpenStreetMap:
```bash
npm run web
```
O aplicativo abrirá automaticamente no seu navegador em `http://localhost:8081` (ou na porta configurada).

### 4. Executar no Mobile (Android ou iOS)
Para testar no seu celular físico através do aplicativo **Expo Go**:
1. Instale o **Expo Go** na Google Play Store ou Apple App Store.
2. Inicie o servidor do Expo:
   ```bash
   npm start
   ```
3. Escaneie o QR Code exibido no terminal utilizando a câmera do seu celular (iOS) ou a ferramenta de escaneamento do próprio app Expo Go (Android).

---

## Verificação de Tipos (TypeScript)
Para assegurar a integridade do código e conformidade com as regras do TypeScript, execute:
```bash
npx tsc --noEmit
```
O projeto compila com **zero warnings ou erros**, assegurando reutilização segura de interfaces e hooks tipados.
