import { redirect } from 'next/navigation';
import { MAPA_FLORES } from '@/lib/flores';

interface FlorPageProps {
  params: {
    flor: string;
  };
}

export function generateStaticParams() {
  return Object.keys(MAPA_FLORES).map((slug) => ({
    flor: slug,
  }));
}

export default function FlorPage({ params }: FlorPageProps) {
  // Redireciona a antiga rota /[flor] para a nova rota padrão /confirmacao?convite=[flor]
  redirect(`/confirmacao?convite=${params.flor}`);
}
