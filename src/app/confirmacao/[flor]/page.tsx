import { MAPA_FLORES, obterConfigFlor } from '@/lib/flores';
import FormularioConfirmacao from '@/components/FormularioConfirmacao';
import { notFound } from 'next/navigation';

interface ConfirmacaoFlorPageProps {
  params: {
    flor: string;
  };
}

export function generateStaticParams() {
  return Object.keys(MAPA_FLORES).map((slug) => ({
    flor: slug,
  }));
}

export default function ConfirmacaoFlorPage({ params }: ConfirmacaoFlorPageProps) {
  const florConfig = obterConfigFlor(params.flor);
  
  if (!florConfig) {
    notFound();
  }

  return <FormularioConfirmacao flor={florConfig} />;
}
