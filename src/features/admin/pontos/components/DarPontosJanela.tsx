import { useId, useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { CampoBusca } from '../../plano/components/Ferramentas'
import { darPontosAcao, type Regra } from '../api/pontos.api'
import { useAcaoPontos, useAlunasSimples } from '../hooks/usePontos'
import { t } from '../textos'

const r = t.regras
const semAcento = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

function ListaAlunas({
  marcadas,
  alternar,
}: {
  marcadas: Set<string>
  alternar: (id: string) => void
}) {
  const alunas = useAlunasSimples()
  const [busca, setBusca] = useState('')
  const lista = (alunas.data ?? []).filter((a) =>
    semAcento(`${a.nome} ${a.apelido ?? ''}`).includes(semAcento(busca.trim())),
  )
  return (
    <div className="flex flex-col gap-3">
      <CampoBusca valor={busca} aoMudar={setBusca} rotulo={r.buscar} />
      {alunas.isSuccess && lista.length === 0 && (
        <p className="text-[13px] text-suave">{r.semAlunas}</p>
      )}
      <ul className="grid gap-1 sm:grid-cols-2">
        {lista.map((a) => (
          <li key={a.id}>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm hover:bg-[#F8FAF9]">
              <input
                type="checkbox"
                className="size-5 accent-ora"
                checked={marcadas.has(a.id)}
                onChange={() => alternar(a.id)}
              />
              <span className="font-bold text-tinta">{a.nome}</span>
              {a.apelido && <span className="text-suave">{a.apelido}</span>}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Dar os pontos de uma ação própria às alunas que cumpriram. O banco respeita o limite da ação. */
export function DarPontosJanela({ regra, aoFechar }: { regra: Regra; aoFechar: () => void }) {
  const id = useId()
  const dar = useAcaoPontos(darPontosAcao)
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set())
  const [aviso, setAviso] = useState({ texto: '', erro: false })
  const alternar = (a: string) =>
    setMarcadas((m) => {
      const n = new Set(m)
      if (n.has(a)) n.delete(a)
      else n.add(a)
      return n
    })
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (marcadas.size === 0) return setAviso({ texto: r.erroMarcar, erro: true })
    try {
      const n = await dar.mutateAsync({ acao: regra.acao, perfis: [...marcadas] })
      setMarcadas(new Set())
      setAviso({ texto: r.dados(n), erro: false })
    } catch {
      setAviso({ texto: t.erro, erro: true })
    }
  }
  const rodape = (
    <>
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.fechar}
      </BotaoBrilho>
      <BotaoBrilho tom="dourado" type="submit" form={id} disabled={dar.isPending}>
        {dar.isPending ? t.salvando : r.darPontos}
      </BotaoBrilho>
    </>
  )
  return (
    <Janela
      titulo={r.darTitulo(regra.nome)}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={rodape}
    >
      <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-3">
        <p className="text-[13px] text-suave">
          {regra.pontos} pts · {t.limite(regra.limite_tipo, regra.limite_qtd, regra.acao)} ·{' '}
          {r.marcadas(marcadas.size)}
        </p>
        <ListaAlunas marcadas={marcadas} alternar={alternar} />
        {aviso.texto && (
          <p
            role={aviso.erro ? 'alert' : 'status'}
            className={`text-sm font-medium ${aviso.erro ? 'text-terracota-escuro' : 'text-verde-escuro'}`}
          >
            {aviso.texto}
          </p>
        )}
      </form>
    </Janela>
  )
}
