import { BotaoBrilho } from '@/components/ui'
import { formatarData } from '@/lib/datas'
import { useAvisosNovos } from '../hooks/useAvisos'
import { textos } from '../textos'

const t = textos

/** Início: avisos publicados pela equipe que ela ainda não viu, com Entendi para fechar. */
export function AvisosNovos() {
  const { avisos, fechar } = useAvisosNovos()
  if (avisos.length === 0) return null
  return (
    <ul className="flex flex-col gap-3">
      {avisos.slice(0, 3).map((a) => (
        <li
          key={a.id}
          className="flex flex-col gap-2 rounded-[22px] border-l-4 border-dourado bg-[#FFF6E5] p-4 shadow-cartao lg:p-5"
        >
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#B07A12] uppercase">
            {t.etiqueta} · {formatarData(new Date(a.publicar_em))}
          </p>
          <h2 className="text-base font-bold text-verde-escuro">{a.titulo}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line text-tinta">{a.texto}</p>
          <BotaoBrilho tom="dourado" className="self-end" onClick={() => fechar(a.id)}>
            {t.entendi}
          </BotaoBrilho>
        </li>
      ))}
    </ul>
  )
}
