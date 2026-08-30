# 🌸 Sistema de Confirmação de Presença & Gestão RSVP (Serverless & Static)

Plataforma web de alta performance para gestão de confirmação de presença (RSVP) por categorias de convites familiares, desenvolvida com **Next.js 14**, **TypeScript**, **Tailwind CSS** e banco de dados **Google Sheets** via API Serverless Proxy.

---

## 🛠️ Tech Stack & Arquitetura

- **Frontend & UI:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Design System & Typography:** Google Fonts (Serif, Script, Sans-Serif), Lucide Icons
- **Backend & Database:** Google Apps Script Web App (Serverless API Proxy), Google Sheets
- **Segurança & Criptografia:** Web Crypto API (SHA-256 Hashing), Sanitização XSS & Defesa contra Formula Injection (CWE-1236)
- **Geolocalização:** Google Maps Embed API, Google Maps Navigation & Waze Deep Linking

---

## 🚀 Destaques Técnicos & Engenharia de Software

### 1. Compilação Estática Serverless (Static Export)
- Configurado com `output: 'export'`, gerando um bundle 100% estático otimizado para CDNs de alta velocidade.
- **First Load JS de apenas ~87 KB**, garantindo pontuação máxima de performance no Google Lighthouse e carregamento instantâneo em redes móveis 3G/4G.

### 2. Segurança & Criptografia Client-Side (SHA-256)
- Autenticação do painel administrativo protegida via digest criptográfico **SHA-256** (`crypto.subtle.digest`).
- A senha em texto puro jamais é armazenada ou exposta no bundle JavaScript compilado, impedindo engenharia reversa via devtools.

### 3. Defesa contra Injeção de Fórmulas (CWE-1236) & XSS
- Implementação de sanitização estrita de entradas (`sanitizarTexto`).
- Entradas iniciadas por caracteres reservados de fórmulas (`=`, `+`, `-`, `@`) são automaticamente escapadas com prefixo de texto puro (`'`), prevenindo execução remota de código ou fórmulas maliciosas na planilha backend.

### 4. Arquitetura Proxy "Write-Only" (Banco de Dados Cego)
- O frontend interage com o banco de dados exclusivamente através de uma API proxy Serverless em canal de sentido único.
- A estrutura de dados, o ID da planilha e o histórico de registros permanecem 100% inacessíveis para usuários externos, garantindo privacidade total.

### 5. Engenharia de UX & Persistência Offline-First (`localStorage`)
- **Controle Dinâmico de Limites:** Lógica condicional tátil que se adapta dinamicamente à quantidade máxima de acompanhantes permitida por convite.
- **Persistência Tátil:** Salvamento do recibo de presença no `localStorage` para que o convidado possa reabrir o link a qualquer momento e consultar data, horário e traçar rotas via GPS (Google Maps / Waze).
- **Controle de Fluxo & Trava de Prazos:** Cronômetro de contagem regressiva em tempo real com bloqueio de submissão pós-expiração e prevenção contra navegação acidental pelo botão voltar do navegador.
