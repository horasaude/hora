import { Link } from 'react-router-dom'
import { Cartao, classeBrilho } from '@/components/ui'
import { useMinhasRespondidas } from '../hooks/useForum'
import { textos as t } from '../textos'

/** Aviso no Início quando a dúvida da aluna recebe resposta das profissionais. */
export function AvisoRespondida() {
  const lista = useMinhasRespondidas()
  const d = lista.data?.[0]
  if (!d) return null
  return (
    <Cartao className="flex flex-col gap-3 border border-[#D5E8DC] sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold text-verde-escuro">{t.aviso.titulo}</p>
        <p className="truncate text-sm text-suave">{d.texto}</p>
      </div>
      <Link to={`/app/forum/${d.id}`} className={`${classeBrilho('verde')} self-start`}>
        {t.aviso.ver}
      </Link>
    </Cartao>
  )
}
