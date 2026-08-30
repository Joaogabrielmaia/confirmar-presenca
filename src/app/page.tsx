'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MAPA_FLORES } from '@/lib/flores';
import { OrnamentoDivisorDourado } from '@/components/ArranjoFloral';
import { Flower2, ExternalLink, ShieldCheck, Lock, KeyRound, LogOut } from 'lucide-react';

const HASH_SENHA_ADMIN = '2f3b1a647736218c52cd637eebd7b2ce8ff6bd74592c8330a9ba44d09e87bfa9';

async function gerarSha256(texto: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HomePage() {
  const [senhaInput, setSenhaInput] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [validando, setValidando] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setAutenticado(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidando(true);
    setErroSenha(false);

    try {
      const hashDigitado = await gerarSha256(senhaInput);
      if (hashDigitado === HASH_SENHA_ADMIN) {
        setAutenticado(true);
        sessionStorage.setItem('admin_auth', 'true');
      } else {
        setErroSenha(true);
      }
    } catch (err) {
      setErroSenha(true);
    } finally {
      setValidando(false);
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    sessionStorage.removeItem('admin_auth');
    setSenhaInput('');
  };

  const flores = Object.values(MAPA_FLORES);

  if (!autenticado) {
    return (
      <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#d4af37] max-w-md w-full text-center relative z-20 my-6">
        <div className="w-16 h-16 bg-[#f7f3e8] text-[#c5a059] border border-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock size={30} />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#1b365d] mb-1">
          Painel do Organizador
        </h1>
        <p className="text-xs text-[#1b365d]/70 font-sans mb-6">
          Acesso exclusivo para gerenciamento dos links de convite.
        </p>

        {erroSenha && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-sans font-medium">
            Senha incorreta. Tente novamente.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans">
          <input
            type="password"
            required
            placeholder="Digite a senha de acesso..."
            value={senhaInput}
            onChange={(e) => setSenhaInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#cbd8eb] focus:border-[#c5a059] focus:ring-2 focus:ring-[#e5ecf5] outline-none text-[#1b365d] text-center text-base tracking-widest bg-white transition"
          />

          <button
            type="submit"
            disabled={validando}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#1b365d] to-[#2a508b] hover:from-[#152a4a] hover:to-[#1b365d] text-white rounded-xl font-bold text-sm transition shadow-md border border-[#c5a059]/40 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <KeyRound size={18} className="text-[#d4af37]" />
            {validando ? 'Validando...' : 'Acessar Painel'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfbf7] rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-[#d4af37] max-w-2xl w-full text-center relative z-20 my-6">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-[#1b365d]/70 hover:text-[#1b365d] text-xs font-semibold flex items-center gap-1.5 bg-white/80 hover:bg-[#f7f3e8] p-2 rounded-xl border border-[#cbd8eb] transition cursor-pointer"
        title="Sair do Painel"
      >
        <LogOut size={15} className="text-[#c5a059]" />
        Sair
      </button>

      <h1 className="text-5xl sm:text-6xl font-script text-[#1b365d] mb-1 pt-4">
        Nádia
      </h1>
      <div className="mb-2">
        <span className="text-3xl sm:text-4xl font-serif font-bold text-[#c5a059]">
          50
        </span>
        <span className="text-2xl font-script text-[#1b365d] ml-1">
          anos
        </span>
      </div>

      <OrnamentoDivisorDourado />

      <p className="text-[#1b365d]/80 text-sm font-sans max-w-lg mx-auto mb-6">
        Selecione abaixo um dos links de confirmação para copiar ou enviar aos convidados via WhatsApp:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-6 font-sans">
        {flores.map((flor) => {
          const urlConfirmacao = `/confirmacao/${flor.slug}`;
          return (
            <Link
              key={flor.slug}
              href={urlConfirmacao}
              className="p-4 rounded-2xl border border-[#cbd8eb] bg-white/90 hover:bg-[#f7f3e8]/70 hover:border-[#c5a059] transition duration-200 group flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#f7f3e8] text-[#c5a059] rounded-xl border border-[#e7d28d] group-hover:scale-105 transition">
                  <Flower2 size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-[#1b365d] group-hover:text-[#2a508b] transition">
                    Convite {flor.nome}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">{flor.descricao}</p>
                </div>
              </div>
              <ExternalLink size={17} className="text-[#c5a059] group-hover:translate-x-0.5 transition" />
            </Link>
          );
        })}
      </div>

      <div className="bg-[#f4f7fb]/80 rounded-2xl p-4 text-xs text-[#1b365d] border border-[#cbd8eb] flex items-start gap-3 text-left font-sans shadow-xs">
        <ShieldCheck size={22} className="text-[#c5a059] shrink-0 mt-0.5" />
        <div>
          <strong className="block text-[#1b365d] text-sm mb-0.5 font-bold">Como enviar aos convidados:</strong>
          Copie o link da flor desejada e envie no WhatsApp. Exemplo: para quem pode levar até 2 pessoas (Dupla), envie a URL <code>/confirmacao/orquidea</code>.
        </div>
      </div>
    </div>
  );
}
