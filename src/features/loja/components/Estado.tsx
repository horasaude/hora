import { BotaoBrilho, Cartao } from '@/components/ui'
import { textos as t } from '../textos'

/** Carregando, erro ou aviso da Loja. */
export function EstadoLoja({
  tipo,
  texto,
  tentar,
}: {
  tipo: 'carregando' | 'erro' | 'aviso'
  texto?: string
  tentar?: () => void
}) {
  if (tipo === 'carregando') return <p className="text-sm text-suave">{t.carregando}</p>
  if (tipo === 'erro')
    return (
      <Cartao className="flex flex-col items-start gap-3 text-sm">
        <p role="alert">{t.erro}</p>
        <BotaoBrilho tom="cinza" onClick={tentar}>
          {t.tentar}
        </BotaoBrilho>
      </Cartao>
    )
  return <Cartao className="py-12 text-center text-sm text-suave">{texto}</Cartao>
}
