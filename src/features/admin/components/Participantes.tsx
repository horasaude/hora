import { BarraProgresso } from '@/components/ui'
import { useParticipantes } from '../hooks/useModulos'
import { textos } from '../textos'

const t = textos.desafios

/** Participantes do desafio com o progresso de cada uma (dias cumpridos sobre a meta) em barra dourada. */
export function Participantes({ desafio }: { desafio: string }) {
  const lista = useParticipantes(desafio)
  return (
    <section className="flex flex-col gap-3 border-t border-[#F0F2F1] pt-4">
      <h3 className="text-base font-bold text-verde-escuro">
        {t.participantes}{' '}
        {lista.data && <span className="font-normal text-suave">({lista.data.length})</span>}
      </h3>
      {lista.data?.length === 0 && <p className="text-[13px] text-suave">{t.semParticipantes}</p>}
      <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
        {lista.data?.map((p) => (
          <li key={p.perfil_id} className="flex flex-col gap-1">
            <p className="text-[13px] font-bold text-tinta">
              {p.nome}
              {p.apelido && <span className="font-normal text-suave"> · {p.apelido}</span>}
            </p>
            <BarraProgresso
              pct={(Math.min(p.dias, p.meta) / p.meta) * 100}
              legenda={t.progressoAluna(p.dias, p.meta)}
              rotulo={p.nome}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
