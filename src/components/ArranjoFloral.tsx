import React from 'react';
import Image from 'next/image';

export function ArranjoFundoPagina() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <div className="absolute -top-4 -left-4 w-[240px] h-[280px] sm:w-[360px] sm:h-[420px] md:w-[480px] md:h-[560px] lg:w-[600px] lg:h-[680px] opacity-95">
        <div className="relative w-full h-full scale-105 transform origin-top-left">
          <Image
            src="/flores-topo-esquerdo.png"
            alt="Decoração Floral Nádia 50 Anos - Topo Esquerdo"
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 500px, 640px"
            className="object-contain object-top-left"
            priority
          />
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 w-[240px] h-[280px] sm:w-[360px] sm:h-[420px] md:w-[480px] md:h-[560px] lg:w-[600px] lg:h-[680px] opacity-95">
        <div className="relative w-full h-full scale-105 transform origin-bottom-right">
          <Image
            src="/flores-baixo-direito.png"
            alt="Decoração Floral Nádia 50 Anos - Rodapé Direito"
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 500px, 640px"
            className="object-contain object-bottom-right"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export function OrnamentoDivisorDourado() {
  return (
    <div className="flex items-center justify-center gap-2 my-3 sm:my-4 opacity-85">
      <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent to-[#c5a059]"></div>
      <div className="w-1.5 h-1.5 rotate-45 border border-[#c5a059] bg-white"></div>
      <div className="text-[#c5a059] text-xs font-script">♥</div>
      <div className="w-1.5 h-1.5 rotate-45 border border-[#c5a059] bg-white"></div>
      <div className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent to-[#c5a059]"></div>
    </div>
  );
}
