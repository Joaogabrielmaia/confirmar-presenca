# 🌸 EventoRSVP - Sistema de Confirmação de Presença

Plataforma web de confirmação de presença (RSVP) desenvolvida em Next.js com React, TypeScript e TailwindCSS, integrada ao Google Sheets e à API do Google Maps. O sistema permite a gestão individualizada de convites por categorias de flores, limites de acompanhantes por família, cronômetro de prazo limite e navegação para o local da festa.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js (v14.2.35), React (v18), TypeScript, TailwindCSS
- **Ícones & Design**: Lucide Icons, Google Fonts (`Playfair Display`, `Great Vibes`, `Montserrat`)
- **Banco de Dados**: Google Sheets via Google Apps Script Web App (API Serverless)
- **Geolocalização**: Google Maps Embed API, Google Maps Navigation & Waze Deep Linking
- **Arquitetura**: Jamstack / Client-Side Static Export (`output: 'export'`)

---

## 🚀 Instalação & Execução Local

### Pré-requisitos
- Node.js `v18.0.0` ou superior.
- Git instalado.

### 1. Clonar o Repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd confirmar-presenca
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar o Projeto

#### Modo de Desenvolvimento
```bash
npm run dev
```

#### Modo de Produção
```bash
npm run build
```

Acesse a aplicação em: `http://localhost:3000`

---

## 📌 Funcionalidades Principais

- 🌺 **5 Opções de Convites por Flores**: Sistema flexível que adapta o formulário conforme o limite de pessoas definido para cada família:
  - **Margarida**: Convite individual (1 pessoa)
  - **Orquídea**: Convite para até 2 pessoas
  - **Tulipa**: Convite para até 3 pessoas
  - **Lírio**: Convite para até 4 pessoas
  - **Girassol**: Convite para até 5 pessoas
- ⏳ **Prazo Limite & Bloqueio Automático**: Cronômetro de contagem regressiva em tempo real com trava do formulário após a data limite configurada.
- 🗄️ **Integração com Google Sheets**: Atendimento ao requisito da cliente para registrar as confirmações diretamente em uma planilha do Google Sheets de forma simples e acessível.
- 🗺️ **Localização Interativa via Maps & Waze**: Tela pós-confirmação com mapa do evento embutido e botões de navegação direta via Google Maps e Waze para orientação dos convidados no dia da festa.
- 🔐 **Painel do Organizador**: Área administrativa protegida por senha com hash criptográfico SHA-256 para consulta dos links de confirmação.
