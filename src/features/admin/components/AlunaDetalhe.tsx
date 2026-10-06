import type { StatusAluna } from '@/domain/painel'
import { formatarData, quandoFoi } from '@/lib/datas'
import type { AlunaPainel } from '../api/modulos.api'
import { textos } from '../textos'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { Etiqueta } from './Tabela'

const t = textos.alunas
const TOM = { em_dia: 'verde', atencao: 'ocre', sumiu: 'rosa', sem_acesso: 'neutro' } as const

export function EtiquetaAluna({ status }: { status: StatusAluna }) {
  return <Etiqueta tom={TOM[status]}>{t.status[status]}</Etiqueta>
}

const data = (iso: string | null) => (iso ? formatarData(new Date(iso)) : '-')

/** Cartão da aluna (só leitura): dados do acesso e progresso nas aulas liberadas. */
export function AlunaDetalhe({
  aluna: a,
  status,
  agora,
}: {
  aluna: AlunaPainel
  status: StatusAluna
  agora: Date
}) {
  const pct = a.aulas_liberadas ? Math.round((a.aulas_concluidas / a.aulas_liberadas) * 100) : 0
  return (
    <CartaoDetalhe titulo={a.nome || a.apelido || '-'}>
      <Dados
        itens={[
          [t.dadoApelido, a.apelido ?? '-'],
          [t.dadoInicio, data(a.acesso_inicio_em)],
          [t.dadoFim, data(a.acesso_fim_em)],
          [t.dadoDia, a.dia ? t.diaN(a.dia) : '-'],
          [
            t.dadoUltimo,
            a.ultimo_acesso_em ? quandoFoi(new Date(a.ultimo_acesso_em), agora) : t.nunca,
          ],
          [t.dadoStatus, <EtiquetaAluna key="s" status={status} />],
        ]}
      />
      <section className="flex flex-col gap-2 border-t border-linha pt-5">
        <h3 className="text-sm font-semibold text-suave">{t.progresso}</h3>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.progresso}
          className="h-3 overflow-hidden rounded-full bg-linha"
        >
          <div className="h-full rounded-full bg-salvia" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-sm text-tinta">{t.aulas(a.aulas_concluidas, a.aulas_liberadas)}</p>
      </section>
    </CartaoDetalhe>
  )
}
