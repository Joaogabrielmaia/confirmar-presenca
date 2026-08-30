'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { obterConfigFlor, MAPA_FLORES } from '@/lib/flores';
import FormularioConfirmacao from '@/components/FormularioConfirmacao';

function ConfirmacaoContent() {
  const searchParams = useSearchParams();
  
  const paramConvite = searchParams.get('convite') || searchParams.get('flor') || searchParams.get('c') || 'margarida';
  
  let florConfig = obterConfigFlor(paramConvite);
  
  if (!florConfig) {
    if (paramConvite === '1') florConfig = MAPA_FLORES.margarida;
    else if (paramConvite === '2') florConfig = MAPA_FLORES.orquidea;
    else if (paramConvite === '3') florConfig = MAPA_FLORES.tulipa;
    else if (paramConvite === '4') florConfig = MAPA_FLORES.lirio;
    else if (paramConvite === '5') florConfig = MAPA_FLORES.girassol;
    else florConfig = MAPA_FLORES.margarida;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/confirmacao');
    }
  }, []);

  return <FormularioConfirmacao flor={florConfig} />;
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#fdfbf7] rounded-3xl p-8 shadow-2xl border-2 border-[#d4af37] text-center max-w-md w-full my-6">
        <div className="w-10 h-10 border-4 border-[#1b365d] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-sans text-[#1b365d]">Carregando convite...</p>
      </div>
    }>
      <ConfirmacaoContent />
    </Suspense>
  );
}
