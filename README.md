# 🌸 Nádia 50 Anos — Sistema Enterprise de Confirmação de Presença (RSVP)

Plataforma Serverless & Static Client-Side para Gestão de Convites por Família, Limites Dinâmicos de Acompanhantes, Cronômetro de Expiração, Localização Interativa via Google Maps/Waze e Persistência Segura Integrada ao Google Sheets.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend & Core:** Next.js (v14.2.35), React (v18), TypeScript, TailwindCSS
- **Design System & Tipografia:** Playfair Display, Great Vibes (Caligráfica), Montserrat, Lucide Icons
- **Segurança & Criptografia:** Web Crypto API (SHA-256 Admin Hashing), Prevenção contra Formula Injection (CWE-1236) e Sanitização XSS
- **Banco de Dados & Serverless Backend:** Google Apps Script Web App (API Proxy Proxy-Cego), Google Sheets (Database em Nuvem)
- **Localização & Geolocalização:** Google Maps Embed API, Google Maps Navigation, Waze Deep Link
- **Hospedagem & Compilação Estática:** Next.js Static Export (`output: 'export'`), Otimizado para **Vercel** e **Render**

---

## ✨ Funcionalidades em Destaque

- 🌺 **Convites Customizados por Flores:** Links dedicados para cada estrutura familiar:
  - 🌼 **Margarida:** Convite Individual (1 pessoa)
  - 🌸 **Orquídea:** Convite para até 2 pessoas
  - 🌷 **Tulipa:** Convite para até 3 pessoas
  - 🌺 **Lírio:** Convite para até 4 pessoas
  - 🌻 **Girassol:** Convite para até 5 pessoas
- 🔐 **Painel do Organizador Protegido por SHA-256:** Acesso exclusivo mediante senha (`8257`) criptografada via hash unidirecional. A senha original nunca é exposta no JavaScript client-side.
- ⏳ **Contagem Regressiva & Encerramento Automático:** Cronômetro em tempo real programado para **30/09/2026 às 23:59:59**. Após o prazo, o formulário é bloqueado automaticamente.
- 🛑 **Proteção de Navegação e Duplicidade:** Interceptação da navegação pelo botão voltar do navegador e impedimento de re-envios pela mesma sessão.
- 🗺️ **Mapa Interativo & Traçado de Rotas 1-Clique:** Tela de confirmação com mapa do **Espaço Beato** integrado ao Google Maps e Waze para uso no dia do evento.
- 📱 **Persistência com localStorage:** O recibo de confirmação fica salvo permanentemente no dispositivo do convidado para consulta de data, horário e localização no dia da festa (18/10/2026).
- 🛡️ **Base de Dados Cega & Blindada:** A comunicação com o Google Sheets ocorre via canal de via única (*Write-Only*). A estrutura da tabela e o ID da planilha permanecem 100% ocultos.

---

## 🌺 URLs de Confirmação (`/confirmacao`)

Todas as confirmações utilizam a rota unificada **`/confirmacao`**:

| Convite | URL Oficial | Limite de Pessoas | Descrição |
| :--- | :--- | :--- | :--- |
| 🌼 **Margarida** | `/confirmacao?convite=margarida` | **1** pessoa | Convite individual |
| 🌸 **Orquídea** | `/confirmacao?convite=orquidea` | até **2** pessoas | Convidado + 1 acompanhante |
| 🌷 **Tulipa** | `/confirmacao?convite=tulipa` | até **3** pessoas | Convidado + até 2 acompanhantes |
| 🌺 **Lírio** | `/confirmacao?convite=lirio` | até **4** pessoas | Convidado + até 3 acompanhantes |
| 🌻 **Girassol** | `/confirmacao?convite=girassol` | até **5** pessoas | Convidado + até 4 acompanhantes |

---

## 🚀 Instalação & Execução Local

### Pré-requisitos
- Node.js v18.0.0 ou superior.
- Git instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/joaogabrielmaia/confirmar-presenca.git
cd confirmar-presenca
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
```env
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzO1ft55IMIyOCwi1oi5yUbaXNpQ-UGEzkqVBP0iWYADgoXDcx_xrmup7jkdu4HSB8wXA/exec
```

### 4. Executar a Aplicação
```bash
# Modo Desenvolvimento
npm run dev

# Compilação Estática para Produção (Gera a pasta /out)
npm run build
```
Acesse a aplicação em: `http://localhost:3000`

---

## 🌐 Deploy na Vercel (Passo a Passo)

1. Suba o código para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "Deploy Nádia 50 Anos"
   git push -u origin main
   ```
2. Acesse a **[Vercel](https://vercel.com/)** e faça login com seu GitHub.
3. Clique em **Add New... > Project** e selecione o repositório `confirmar-presenca`.
4. Em **Environment Variables**, configure:
   - **Key:** `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`
   - **Value:** `https://script.google.com/macros/s/AKfycbzO1ft55IMIyOCwi1oi5yUbaXNpQ-UGEzkqVBP0iWYADgoXDcx_xrmup7jkdu4HSB8wXA/exec`
5. Clique em **Deploy**. O site estará no ar em poucos segundos!

---

## 🗄️ Estrutura do Banco de Dados & Serverless Proxy (Google Sheets)

A integração com a planilha é gerenciada via **Google Apps Script Web App**:

### Mapeamento das Colunas na Planilha
- **Coluna A:** Total Geral de Confirmados (Número)
- **Coluna B:** Nome do Confirmante Principal (Texto)
- **Coluna C:** Lista de Acompanhantes (Texto formatado)
- **Coluna D:** Total de Adultos (Número)
- **Coluna E:** Total de Crianças (Número)
- **Coluna F:** Recado para a Aniversariante (Texto)
- **Coluna G:** Data e Hora do Envio (Timestamp BR)

### Código de Segurança do Google Apps Script
No Google Sheets, navegue até **Extensões > Apps Script** e salve o código:

```javascript
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'erro' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    function limpar(valor, maxLen) {
      if (!valor) return '';
      var str = String(valor).trim().replace(/<[^>]*>?/g, '');
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return str.substring(0, maxLen || 200);
    }

    sheet.appendRow([
      Math.abs(parseInt(data.totalGeral) || 1),
      limpar(data.nomeConfirmante, 80),
      limpar(data.acompanhantes, 300),
      Math.abs(parseInt(data.totalAdultos) || 1),
      Math.abs(parseInt(data.totalCriancas) || 0),
      limpar(data.observacoes, 500),
      limpar(data.dataHora, 50)
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'sucesso' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'erro' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Acesso não autorizado.")
    .setMimeType(ContentService.MimeType.TEXT);
}
```
