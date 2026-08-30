import { google } from 'googleapis';

export interface DadosConfirmacao {
  florSlug: string;
  florNome: string;
  limiteMaximo: number;
  nomeConfirmante: string;
  confirmanteECrianca: boolean;
  acompanhantes: Array<{
    nome: string;
    eCrianca: boolean;
  }>;
  observacoes?: string;
}

export async function salvarConfirmacaoNoGoogleSheets(dados: DadosConfirmacao) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Trata quebras de linha na private key do .env
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  // Se as variáveis de ambiente não estiverem configuradas, simula gravação em modo desenvolvimento
  if (!email || !privateKey || !sheetId) {
    console.warn(
      '⚠️ [Google Sheets API] Variáveis de ambiente (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID) não configuradas.'
    );
    console.log('Simulação dos dados gravados:', JSON.stringify(dados, null, 2));
    return {
      sucesso: true,
      modoSimulado: true,
      mensagem: 'Modo simulação ativado (configure as variáveis no .env.local para gravar no Google Sheets real).',
    };
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Cálculo dos totais
    const confirmanteTipo = dados.confirmanteECrianca ? 'Criança' : 'Adulto';
    let totalAdultos = dados.confirmanteECrianca ? 0 : 1;
    let totalCriancas = dados.confirmanteECrianca ? 1 : 0;

    const acompanhantesFormatados = dados.acompanhantes.map((ac) => {
      if (ac.eCrianca) {
        totalCriancas += 1;
        return `${ac.nome.trim()} (Criança)`;
      } else {
        totalAdultos += 1;
        return `${ac.nome.trim()} (Adulto)`;
      }
    });

    const textoAcompanhantes =
      acompanhantesFormatados.length > 0
        ? acompanhantesFormatados.join(', ')
        : 'Nenhum acompanhante';

    const totalGeral = totalAdultos + totalCriancas;
    const dataHoraAtual = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });

    // Linha a ser adicionada na planilha
    const rowValues = [
      dataHoraAtual,                                   // Coluna 1: Data/Hora
      `/${dados.florSlug} (${dados.florNome})`,        // Coluna 2: Página/Flor
      dados.nomeConfirmante.trim(),                    // Coluna 3: Nome do Confirmante
      confirmanteTipo,                                 // Coluna 4: Tipo (Adulto/Criança)
      textoAcompanhantes,                              // Coluna 5: Acompanhantes
      totalAdultos,                                    // Coluna 6: Total Adultos
      totalCriancas,                                   // Coluna 7: Total Crianças
      totalGeral,                                      // Coluna 8: Total Geral
      dados.observacoes?.trim() || '',                 // Coluna 9: Mensagem/Observação
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:I', // Preenche nas primeiras colunas livres
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });

    return { sucesso: true, modoSimulado: false };
  } catch (error: any) {
    console.error('Erro ao gravar no Google Sheets:', error);
    throw new Error(
      error.message || 'Falha ao comunicar com a API do Google Sheets.'
    );
  }
}
