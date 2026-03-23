# PhiloMessaging - Frontend 🛡️
## O PhiloMessaging é a interface de uma plataforma de comunicação ultra-segura, focada em privacidade e performance. Este frontend foi construído seguindo os mais altos padrões de engenharia de software, garantindo uma experiência Real-time e Multi-idioma.

# 🏗️ Arquitetura do Projeto
## O projeto utiliza a estratégia de Feature-Based Architecture (Arquitetura baseada em funcionalidades). Diferente da estrutura clássica por "tipo de arquivo", aqui organizamos o código pelo que ele faz.

# Estrutura de Pastas

### src/
### ├── assets/             # Recursos estáticos (estilos globais, grids)
### ├── components/         # Componentes UI Genéricos (Buttons, Modals, Inputs)
### ├── features/           # Núcleo da aplicação (Onde a mágica acontece)
### │   ├── auth/           # Login, Registro e Contexto de Identidade
### │   ├── chat/           # Shell Principal, Feed de Conversas, SignalR
### │   └── contacts/       # Gestão de Contatos, Busca por Telefone (LibPhoneNumber)
### ├── hooks/              # Hooks globais utilitários
### ├── i18n/               # Configurações de Internacionalização (i18next)
### └── services/           # Configuração base de API (Axios Interceptors)

## Por que essa arquitetura?
### Isolamento: Alterações na feature de contacts não quebram o chat.

### Escalabilidade: Facilita o trabalho em equipe, onde cada dev pode focar em uma feature completa (do Hook ao Componente).

### Barrel Exports: Uso intensivo de arquivos index.ts para expor apenas o necessário de cada feature.

# 🛠️ Tech Stack & Skills
## Este projeto demonstra proficiência nas seguintes tecnologias:

## React 18 & TypeScript: Tipagem estrita em todo o fluxo de dados.

## Vite: Tooling de próxima geração para um HMR (Hot Module Replacement) instantâneo.

## Tailwind CSS: Estilização baseada em utilitários com foco em Design System Dark.

## SignalR (Client): Integração para mensagens e notificações em tempo real.

## i18next: Sistema robusto de tradução dinâmica (PT/EN).

## React Phone Number Input: Validação de identidades globais seguindo o padrão E.164.

## 🔄 Fluxos Principais (Flows)
## 1. Identidade Global (Add Contact)
## Diferente de sistemas legados, o PhiloMessaging utiliza o Telefone Internacional como chave primária de busca.
## Fluxo: O usuário digita o número no Front -> O sistema faz o parse (DDI + Número) -> O Backend valida a existência na rede Philo -> Vínculo é criado via ID indexado no MySQL.

## 2. Handshake de Autenticação
## Persistência de estado via AuthContext.

## Proteção de rotas com AppContent condicional.

## Interceptors de API para injeção automática de Bearer Tokens.

## 🚀 Como Executar
## Pré-requisitos
## Node.js (v18+)

## Gerenciador de pacotes (NPM ou PNPM)

## Instalação
## Clone o repositório:

```
git clone https://github.com/seu-usuario/PhiloMessaging.FrontEnd.git
```
## Instale as dependências:

```
npm install
```

## Configure o .env:

## Snippet de código
## VITE_API_URL=https://localhost:61799/api/v1
## Inicie o servidor de desenvolvimento:

```
npm run dev
```
## Acesse a aplicação em http://localhost:5173.

# 🛡️ Padrões de Código (Seniority Standards)
## Clean Code: Funções curtas, nomes semânticos e responsabilidade única.

## No Unused Vars: Configuração estrita de TS e ESLint para garantir zero código morto no build.
## UI/UX Consistente: Uso de Lucide React para iconografia e React Toastify para feedback de operações assíncronas.

## Autor
## Rodrigo Furlaneti Senior Solutions Analyst Especialista em Ecossistemas .NET e Arquiteturas Multi-Cloud.