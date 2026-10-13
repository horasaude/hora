import { EtiquetaBrilho } from '@/components/ui'
import { t } from '../textos'

/** Status do treino ou modelo: visível em verde, rascunho em terracota. */
export function StatusTreino({ publicado }: { publicado: boolean }) {
  return publicado ? (
    <EtiquetaBrilho tom="verde">{t.visivel}</EtiquetaBrilho>
  ) : (
    <EtiquetaBrilho tom="coral">{t.rascunho}</EtiquetaBrilho>
  )
}
