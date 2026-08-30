'use client';

import React, { useState, useEffect } from 'react';
import { FlorConfig } from '@/lib/flores';
import { OrnamentoDivisorDourado } from './ArranjoFloral';
import { User, Plus, Trash2, Heart, CheckCircle2, Sparkles, Baby, Users, Clock, Lock, ShieldAlert, Calendar, MapPin, Navigation, ExternalLink } from 'lucide-react';

interface FormularioConfirmacaoProps {
  flor: FlorConfig;
}

interface AcompanhanteState {
  id: string;
  nome: string;
  eCrianca: boolean;
}

const DATA_LIMITE = new Date(2026, 8, 30, 23, 59, 59);

const NOME_LOCAL = 'Espaço Beato';
const ENDERECO_OFICIAL = 'Rua Cravinas, 11 - Jardim Alterosa 2ª seção - Betim/MG';
const QUERY_MAPS = 'Espaço Beato, Rua Cravinas, 11, Jardim Alterosa 2a seção, Betim - MG';

const LINK_GOOGLE_MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(QUERY_MAPS)}`;
const LINK_WAZE = `https://waze.com/ul?q=${encodeURIComponent(QUERY_MAPS)}&navigate=yes`;
const URL_EMBED_MAPS = `https://maps.google.com/maps?q=${encodeURIComponent(QUERY_MAPS)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

function sanitizarTexto(texto: string, maxLength: number = 100): string {
  if (!texto) return '';
  let limpo = texto.trim().replace(/<[^>]*>?/gm, '');
  if (/^[=+\-@\t\r]/.test(limpo)) {
    limpo = "'" + limpo;
  }
  return limpo.substring(0, maxLength);
}

export default function FormularioConfirmacao({ flor }: FormularioConfirmacaoProps) {
  const [nomeConfirmante, setNomeConfirmante] = useState('');
  const [acompanhantes, setAcompanhantes] = useState<AcompanhanteState[]>([]);
  const [observacoes, setObservacoes] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroMsg, setErroMsg] = useState<string | null>(null);

  const [tempoRestante, setTempoRestante] = useState<{ dias: number; horas: number; minutos: number; segundos: number } | null>(null);
  const [prazoEncerrado, setPrazoEncerrado] = useState(false);

  const totalPessoas = 1 + acompanhantes.length;
  const vagasRestantes = flor.limiteMaximo - totalPessoas;

  useEffect(() => {
    const calcularTempo = () => {
      const agora = new Date();
      const diferenca = DATA_LIMITE.getTime() - agora.getTime();

      if (diferenca <= 0) {
        setPrazoEncerrado(true);
        setTempoRestante(null);
      } else {
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
        const minutos = Math.floor((diferenca / 1000 / 60) % 60);
        const segundos = Math.floor((diferenca / 1000) % 60);
        setTempoRestante({ dias, horas, minutos, segundos });
      }
    };

    calcularTempo();
    const interval = setInterval(calcularTempo, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const chaveSessao = `rsvp_confirmado_${flor.slug}`;
    const salvo = localStorage.getItem(chaveSessao) || sessionStorage.getItem(chaveSessao);
    if (salvo) {
      try {
        const dados = JSON.parse(salvo);
        setNomeConfirmante(dados.nomeConfirmante);
        setAcompanhantes(dados.acompanhantes || []);
        setSucesso(true);
      } catch (e) {
        // ignora parse erro
      }
    }
  }, [flor.slug]);

  useEffect(() => {
    if (sucesso) {
      window.history.pushState(null, '', window.location.href);
      const prevenirVoltar = () => {
        window.history.pushState(null, '', window.location.href);
      };
      window.addEventListener('popstate', prevenirVoltar);
      return () => {
        window.removeEventListener('popstate', prevenirVoltar);
      };
    }
  }, [sucesso]);

  const adicionarAcompanhante = () => {
    if (vagasRestantes > 0) {
      setAcompanhantes((prev) => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 9), nome: '', eCrianca: false },
      ]);
    }
  };

  const removerAcompanhante = (id: string) => {
    setAcompanhantes((prev) => prev.filter((item) => item.id !== id));
  };

  const atualizarAcompanhante = (id: string, campo: 'nome' | 'eCrianca', valor: any) => {
    setAcompanhantes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(null);

    if (prazoEncerrado) {
      setErroMsg('O prazo de confirmação de presença se encerrou no dia 30/09 às 23:59.');
      return;
    }

    const nomeSanitizado = sanitizarTexto(nomeConfirmante, 80);

    if (!nomeSanitizado) {
      setErroMsg('Por favor, informe seu nome completo.');
      return;
    }

    const acompanhantesInvalidos = acompanhantes.some((ac) => !sanitizarTexto(ac.nome, 80));
    if (acompanhantesInvalidos) {
      setErroMsg('Por favor, preencha o nome de todos os acompanhantes ou remova os campos em branco.');
      return;
    }

    if (totalPessoas > flor.limiteMaximo) {
      setErroMsg(`A confirmação excedeu o limite máximo de ${flor.limiteMaximo} pessoa(s).`);
      return;
    }

    setCarregando(true);

    try {
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

      let totalAdultos = 1;
      let totalCriancas = 0;

      const acompanhantesFormatados = acompanhantes.map((ac) => {
        const nomeAcSanitizado = sanitizarTexto(ac.nome, 80);
        if (ac.eCrianca) {
          totalCriancas += 1;
          return `${nomeAcSanitizado} (Criança)`;
        } else {
          totalAdultos += 1;
          return `${nomeAcSanitizado} (Adulto)`;
        }
      });

      const payload = {
        totalGeral: totalAdultos + totalCriancas,
        nomeConfirmante: nomeSanitizado,
        acompanhantes: acompanhantesFormatados.length > 0 ? acompanhantesFormatados.join(', ') : 'Nenhum',
        totalAdultos,
        totalCriancas,
        observacoes: sanitizarTexto(observacoes, 500),
        dataHora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      };

      if (scriptUrl) {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });
      }

      const dadosSalvos = JSON.stringify({ nomeConfirmante: nomeSanitizado, acompanhantes, dataHora: payload.dataHora });
      localStorage.setItem(`rsvp_confirmado_${flor.slug}`, dadosSalvos);
      sessionStorage.setItem(`rsvp_confirmado_${flor.slug}`, dadosSalvos);

      setSucesso(true);
    } catch (err: any) {
      console.error('Erro ao enviar presença:', err);
      setErroMsg(err.message || 'Erro inesperado ao enviar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (prazoEncerrado) {
    return (
      <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#d4af37] text-center max-w-lg w-full relative z-20 my-4">
        <div className="w-16 h-16 bg-[#f7f3e8] text-[#c5a059] border border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#1b365d] mb-2">
          Confirmações Encerradas
        </h2>
        <p className="text-[#1b365d]/80 text-sm leading-relaxed mb-6 font-sans">
          O prazo para confirmação de presença no aniversário de <strong>Nádia (50 Anos)</strong> se encerrou no dia <strong>30/09 às 23:59</strong>.
        </p>
        <OrnamentoDivisorDourado />
        <div className="p-4 bg-[#f4f7fb] border border-[#cbd8eb] rounded-2xl text-xs text-[#1b365d]">
          Agradecemos de coração pelo carinho de todos os convidados!
        </div>
      </div>
    );
  }

  if (sucesso) {
    const adultosCount = 1 + acompanhantes.filter((a) => !a.eCrianca).length;
    const criancasCount = acompanhantes.filter((a) => a.eCrianca).length;

    return (
      <div className="bg-[#fdfbf7] rounded-3xl p-5 sm:p-9 shadow-2xl border-2 border-[#d4af37] text-center max-w-lg w-full relative z-20 my-4 transition-all duration-300">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#eef5fc] text-[#1b365d] border border-[#8ca5c9] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm animate-bounce">
          <CheckCircle2 size={32} className="text-[#2a508b]" />
        </div>

        <span className="block text-[11px] sm:text-xs uppercase tracking-widest text-[#c5a059] font-bold mb-0.5">
          Presença Confirmada
        </span>
        <h2 className="text-4xl sm:text-5xl font-script text-[#1b365d] mb-1">
          Nádia 50 Anos
        </h2>

        <OrnamentoDivisorDourado />

        <p className="text-[#1b365d] mb-4 text-sm sm:text-base font-sans leading-relaxed px-2">
          Muito obrigado, <strong className="text-[#1b365d] font-bold">{nomeConfirmante}</strong>! Sua presença está confirmada com carinho.
        </p>

        <div className="bg-[#f7f3e8] rounded-2xl p-3.5 mb-4 border border-[#e7d28d] text-center text-xs text-[#755416] font-sans shadow-2xs">
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-bold text-[#1b365d]">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} className="text-[#c5a059]" />
              18/10/2026 (Domingo)
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#c5a059]" />
              12h00
            </span>
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl p-4 sm:p-5 mb-5 text-left border border-[#cbd8eb] shadow-2xs">
          <div className="flex items-center gap-2 text-[#1b365d] font-bold text-xs sm:text-sm mb-3 pb-2 border-b border-[#cbd8eb]">
            <Users size={17} className="text-[#c5a059]" />
            <span>Resumo da Sua Confirmação:</span>
          </div>
          <ul className="text-[#1b365d] text-xs sm:text-sm space-y-2 font-sans">
            <li className="flex items-center gap-2">
              <User size={15} className="text-[#c5a059] shrink-0" />
              <span><strong>Convidado:</strong> {nomeConfirmante}</span>
            </li>
            {acompanhantes.map((ac, idx) => (
              <li key={idx} className="flex items-center gap-2 pl-3 text-xs text-[#1b365d]/90">
                • <span><strong>Acompanhante {idx + 1}:</strong> {ac.nome} ({ac.eCrianca ? 'Criança' : 'Adulto'})</span>
              </li>
            ))}
          </ul>
          <div className="mt-3.5 pt-3 border-t border-[#cbd8eb] flex justify-between text-[11px] sm:text-xs text-[#1b365d] font-semibold">
            <span>Total Confirmado: <strong>{totalPessoas} pessoa(s)</strong></span>
            <span>({adultosCount} Adulto(s), {criancasCount} Criança(s))</span>
          </div>
        </div>

        <div className="bg-white/95 rounded-2xl p-4 border border-[#cbd8eb] text-left mb-5 shadow-2xs">
          <div className="flex items-center gap-2 text-[#1b365d] font-bold text-xs sm:text-sm mb-1">
            <MapPin size={17} className="text-[#c5a059] shrink-0" />
            <span>Local do Evento: {NOME_LOCAL}</span>
          </div>
          <p className="text-xs text-[#1b365d]/80 mb-3 font-sans leading-snug">
            {ENDERECO_OFICIAL}
          </p>

          <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-[#cbd8eb] mb-3 relative bg-gray-100">
            <iframe
              title="Mapa do Espaço Beato"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={URL_EMBED_MAPS}
            ></iframe>
          </div>

          <div className="grid grid-cols-2 gap-2.5 font-sans">
            <a
              href={LINK_GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 bg-[#1b365d] hover:bg-[#2a508b] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs min-h-[44px]"
            >
              <Navigation size={15} className="text-[#d4af37]" />
              Abrir no Google Maps
            </a>
            <a
              href={LINK_WAZE}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-3 bg-[#f7f3e8] hover:bg-[#eae3d2] text-[#1b365d] border border-[#c5a059] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs min-h-[44px]"
            >
              <ExternalLink size={15} className="text-[#c5a059]" />
              Abrir no Waze
            </a>
          </div>
        </div>

        <div className="p-3 bg-[#f9f5ea] border border-[#e7d28d] rounded-xl text-xs text-[#755416] font-sans">
          Guarde este link! No dia do aniversário (18/10), você pode reabri-lo para consultar o endereço e colocar a rota no GPS!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] rounded-3xl p-4 sm:p-8 shadow-2xl border-2 border-[#d4af37] max-w-xl w-full relative z-20 my-3 sm:my-6">
      <p className="text-center text-xs sm:text-sm text-[#1b365d]/85 font-serif italic mb-0.5">
        &ldquo;Você faz parte da minha história e da minha alegria.&rdquo;
      </p>
      <p className="text-center text-[10px] sm:text-xs text-[#c5a059] uppercase tracking-widest font-semibold mb-1 sm:mb-2">
        Venha celebrar comigo este novo ciclo!
      </p>

      <div className="text-center mb-0.5">
        <h1 className="text-5xl sm:text-6xl font-script text-[#1b365d]">
          Nádia
        </h1>
      </div>

      <div className="text-center mb-1">
        <span className="text-3xl sm:text-4xl font-serif font-bold text-[#c5a059]">
          50
        </span>
        <span className="text-2xl font-script text-[#1b365d] ml-1">
          anos
        </span>
      </div>

      <OrnamentoDivisorDourado />

      <div className="bg-white/90 rounded-2xl p-3.5 sm:p-4.5 mb-5 border border-[#cbd8eb] text-center text-xs text-[#1b365d] space-y-2 font-sans shadow-2xs">
        <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-[#1b365d]">
          <span className="flex items-center gap-1.5">
            <Calendar size={15} className="text-[#c5a059]" />
            18/10/2026 (Dom)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} className="text-[#c5a059]" />
            12h00
          </span>
        </div>
        <div className="flex items-start justify-center gap-1.5 text-xs text-[#1b365d] font-medium pt-1.5 border-t border-[#cbd8eb]/70 leading-snug">
          <MapPin size={15} className="text-[#c5a059] shrink-0 mt-0.5" />
          <span>
            <strong className="font-bold">{NOME_LOCAL}</strong> • {ENDERECO_OFICIAL}
          </span>
        </div>
      </div>

      {flor.limiteMaximo > 1 && (
        <div className="text-center mb-5">
          <p className="text-[11px] sm:text-xs text-[#1b365d]/70 font-sans">
            Se for levar menos pessoas, preencha somente quem irá com você.
          </p>
        </div>
      )}

      {tempoRestante && (
        <div className="mb-5 p-3 bg-[#f7f3e8]/90 border border-[#e7d28d] rounded-2xl text-center shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#755416] font-semibold mb-1">
            <Clock size={14} className="text-[#c5a059] animate-pulse" />
            <span>Prazo limite para confirmar: 30/09 às 23:59</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center max-w-xs mx-auto mt-1.5">
            <div className="bg-white p-1.5 rounded-xl border border-[#e7d28d]">
              <span className="block font-bold text-[#1b365d] text-sm sm:text-base leading-none">{tempoRestante.dias}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500">Dias</span>
            </div>
            <div className="bg-white p-1.5 rounded-xl border border-[#e7d28d]">
              <span className="block font-bold text-[#1b365d] text-sm sm:text-base leading-none">{tempoRestante.horas}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500">Horas</span>
            </div>
            <div className="bg-white p-1.5 rounded-xl border border-[#e7d28d]">
              <span className="block font-bold text-[#1b365d] text-sm sm:text-base leading-none">{tempoRestante.minutos}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500">Min</span>
            </div>
            <div className="bg-white p-1.5 rounded-xl border border-[#e7d28d]">
              <span className="block font-bold text-[#1b365d] text-sm sm:text-base leading-none">{tempoRestante.segundos}</span>
              <span className="text-[9px] sm:text-[10px] text-gray-500">Seg</span>
            </div>
          </div>
        </div>
      )}

      {erroMsg && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl flex items-center gap-2 font-sans">
          <ShieldAlert size={18} className="shrink-0 text-red-500" />
          <span>{erroMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-[#cbd8eb] space-y-2 shadow-2xs">
          <label className="block text-xs sm:text-sm font-semibold text-[#1b365d]">
            <span className="flex items-center gap-2">
              <User size={16} className="text-[#c5a059]" />
              Seu Nome Completo <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            required
            placeholder="Digite seu nome..."
            value={nomeConfirmante}
            onChange={(e) => setNomeConfirmante(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#cbd8eb] focus:border-[#c5a059] focus:ring-2 focus:ring-[#e5ecf5] outline-none text-[#1b365d] bg-white text-sm sm:text-base min-h-[48px] transition"
          />
        </div>

        {flor.limiteMaximo > 1 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-[#1b365d] uppercase tracking-wider flex items-center gap-1.5">
                <Users size={15} className="text-[#c5a059]" />
                Acompanhantes ({acompanhantes.length} de no máximo {flor.limiteMaximo - 1})
              </h3>
              {vagasRestantes > 0 && (
                <span className="text-[11px] sm:text-xs text-[#c5a059] font-bold">
                  {vagasRestantes} vaga(s) restante(s)
                </span>
              )}
            </div>

            {acompanhantes.map((ac, index) => (
              <div
                key={ac.id}
                className="p-3.5 sm:p-4 bg-white/90 rounded-2xl border border-[#cbd8eb] space-y-2.5 relative group transition hover:border-[#c5a059] shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1b365d]">
                    Acompanhante {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removerAcompanhante(ac.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    title="Remover acompanhante"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder={`Nome do acompanhante ${index + 1}`}
                  value={ac.nome}
                  onChange={(e) => atualizarAcompanhante(ac.id, 'nome', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#cbd8eb] focus:border-[#c5a059] focus:ring-2 focus:ring-[#e5ecf5] outline-none text-[#1b365d] bg-white text-sm min-h-[44px]"
                />

                <label className="flex items-center gap-2 text-sm text-[#1b365d]/80 cursor-pointer select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={ac.eCrianca}
                    onChange={(e) => atualizarAcompanhante(ac.id, 'eCrianca', e.target.checked)}
                    className="w-4 h-4 text-[#1b365d] rounded border-[#cbd8eb] focus:ring-[#c5a059] cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    <Baby size={15} className="text-[#c5a059]" />
                    Esta pessoa é criança
                  </span>
                </label>
              </div>
            ))}

            {vagasRestantes > 0 && (
              <button
                type="button"
                onClick={adicionarAcompanhante}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-[#c5a059] text-[#1b365d] font-bold text-xs hover:bg-[#f7f3e8]/60 transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Plus size={16} className="text-[#c5a059]" />
                Adicionar Acompanhante
              </button>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#1b365d]/80 uppercase tracking-wider flex items-center gap-1 px-1">
            <Heart size={14} className="text-[#c5a059]" />
            Recado para a Aniversariante (Opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Deixe uma mensagem especial para celebrar com a Nádia..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-[#cbd8eb] focus:border-[#c5a059] focus:ring-2 focus:ring-[#e5ecf5] outline-none text-[#1b365d] text-sm bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#1b365d] to-[#2a508b] hover:from-[#152a4a] hover:to-[#1b365d] text-white rounded-2xl font-bold text-base shadow-lg shadow-navy-900/20 border border-[#c5a059]/40 hover:shadow-xl transition duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer min-h-[54px]"
        >
          {carregando ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Confirmando presença...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#d4af37]" />
              Confirmar Presença ({totalPessoas} {totalPessoas === 1 ? 'Pessoa' : 'Pessoas'})
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#1b365d]/80 font-serif italic mt-5">
        &ldquo;Conto com você para tornar este dia ainda mais especial!&rdquo;
      </p>
    </div>
  );
}
