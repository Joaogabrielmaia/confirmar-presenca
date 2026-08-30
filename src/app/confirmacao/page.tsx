import { MAPA_FLORES } from '@/lib/flores';
import FormularioConfirmacao from '@/components/FormularioConfirmacao';

export default function ConfirmacaoBasePage() {
  return <FormularioConfirmacao flor={MAPA_FLORES.margarida} />;
}
