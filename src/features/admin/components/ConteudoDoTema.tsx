import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { classeBrilho } from '@/components/ui'
import type { Aula } from '../api/conteudo.api'
import { listarDoTema, type ItemDoTema } from '../api/doTema.api'
import { doTema as t } from '../textos/doTema'
import { EditarTreino } from '../treinos/components/TabelaTreinos'
import { TreinoJanela } from '../treinos/components/TreinoJanela'
import { AulasDoTema } from './AulasDoTema'
import { DesafioForm } from './DesafioForm'
import { MateriaisTemaJanela } from './MateriaisTemaJanela'
import { Situacao } from './Tabela'

function Parte({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-[#F0F2F1] pt-4">
      <h3 className="text-base font-bold text-verde-escuro">{titulo}</h3>
      {children}
    </section>
  )
}

/** Lista de itens do tema: o nome abre o editor (link ou janela) e a etiqueta mostra a situação. */
function Itens({ lista, abrir }: { lista: ItemDoTema[]; abrir: (i: ItemDoTema) => ReactNode }) {
  if (lista.length === 0) return <p className="text-sm text-suave">{t.vazio}</p>
  return (
    <ul className="flex flex-col divide-y divide-linha">
      {lista.map((i) => (
        <li key={i.id} className="flex flex-wrap items-center gap-2 py-2 text-sm">
          <span className="min-w-0 flex-1">{abrir(i)}</span>
          {i.detalhe && <span className="text-xs text-suave">{i.detalhe}</span>}
          <Situacao publicado={i.publicado} />
        </li>
      ))}
    </ul>
  )
}

const nome = 'text-left font-semibold text-tinta underline-offset-4 hover:underline'

type Janela = { tipo: 'treino' | 'desafio' | 'materiais'; id?: string } | null

/** Botão dourado de criar, no fim de cada parte. */
const Criar = ({
  rotulo,
  para,
  aoClicar,
}: {
  rotulo: string
  para?: string
  aoClicar?: () => void
}) =>
  para ? (
    <Link to={para} className={`self-start ${classeBrilho('dourado')}`}>
      {rotulo}
    </Link>
  ) : (
    <button type="button" className={`self-start ${classeBrilho('dourado')}`} onClick={aoClicar}>
      {rotulo}
    </button>
  )

function Janelas({
  janela,
  temaId,
  fechar,
}: {
  janela: Janela
  temaId: string
  fechar: () => void
}) {
  if (janela?.tipo === 'treino')
    return janela.id ? (
      <EditarTreino id={janela.id} aoFechar={fechar} />
    ) : (
      <TreinoJanela temaId={temaId} aoFechar={fechar} />
    )
  if (janela?.tipo === 'desafio') return <DesafioForm temaId={temaId} aoFechar={fechar} />
  if (janela?.tipo === 'materiais') return <MateriaisTemaJanela tema={temaId} aoFechar={fechar} />
  return null
}

/** Dentro do tema: cada profissional cria a sua parte (aulas, cardápio, treinos, desafio e materiais). */
export function ConteudoDoTema(p: { temaId: string; temaPublicado: boolean; aulas: Aula[] }) {
  const q = useQuery({ queryKey: ['do-tema', p.temaId], queryFn: () => listarDoTema(p.temaId) })
  const [janela, setJanela] = useState<Janela>(null)
  const d = q.data ?? { cardapios: [], treinos: [], desafios: [] }
  const link = (para: string) => (i: ItemDoTema) => (
    <Link to={`${para}/${i.id}`} className={nome}>
      {i.titulo}
    </Link>
  )
  return (
    <>
      <Parte titulo={t.aulas}>
        <AulasDoTema aulas={p.aulas} temaId={p.temaId} temaPublicado={p.temaPublicado} />
      </Parte>
      <Parte titulo={t.cardapios}>
        <Itens lista={d.cardapios} abrir={link('/app/admin/plano/cardapios')} />
        <Criar rotulo={t.novoCardapio} para={`/app/admin/plano/cardapios/novo?tema=${p.temaId}`} />
      </Parte>
      <Parte titulo={t.treinos}>
        <Itens
          lista={d.treinos}
          abrir={(i) => (
            <button
              type="button"
              className={nome}
              onClick={() => setJanela({ tipo: 'treino', id: i.id })}
            >
              {i.titulo}
            </button>
          )}
        />
        <Criar rotulo={t.novoTreino} aoClicar={() => setJanela({ tipo: 'treino' })} />
      </Parte>
      <Parte titulo={t.desafio}>
        <Itens lista={d.desafios} abrir={link('/app/admin/desafios')} />
        <Criar rotulo={t.novoDesafio} aoClicar={() => setJanela({ tipo: 'desafio' })} />
      </Parte>
      <Parte titulo={t.materiais}>
        <button
          type="button"
          className={`self-start ${classeBrilho('cinza')}`}
          onClick={() => setJanela({ tipo: 'materiais' })}
        >
          {t.editarMateriais}
        </button>
      </Parte>
      <Janelas janela={janela} temaId={p.temaId} fechar={() => setJanela(null)} />
    </>
  )
}
