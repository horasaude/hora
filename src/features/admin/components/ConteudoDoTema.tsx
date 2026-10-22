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
import { ItensDoTema } from './ItensDoTema'

function Parte({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-[#F0F2F1] pt-4">
      <h3 className="text-base font-bold text-verde-escuro">{titulo}</h3>
      {children}
    </section>
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

/** Tipos de treino e treinos do tema, cada um com a chave de publicar ou tirar do ar. */
function PartesTreino(p: {
  tipos: ItemDoTema[]
  treinos: ItemDoTema[]
  abrir: (j: Janela) => void
}) {
  const { abrir } = p
  return (
    <>
      <Parte titulo={t.tipos}>
        <ItensDoTema
          lista={p.tipos}
          tabela="rotinas"
          abrir={(i) => <span className="font-semibold text-tinta">{i.titulo}</span>}
        />
      </Parte>
      <Parte titulo={t.treinos}>
        <ItensDoTema
          lista={p.treinos}
          tabela="treinos"
          abrir={(i) => (
            <button
              type="button"
              className={nome}
              onClick={() => abrir({ tipo: 'treino', id: i.id })}
            >
              {i.titulo}
            </button>
          )}
        />
        <Criar rotulo={t.novoTreino} aoClicar={() => abrir({ tipo: 'treino' })} />
      </Parte>
    </>
  )
}

/** Dentro do tema: cada profissional cria a sua parte (aulas, cardápio, treinos, desafio e materiais). */
export function ConteudoDoTema(p: { temaId: string; temaPublicado: boolean; aulas: Aula[] }) {
  const q = useQuery({ queryKey: ['do-tema', p.temaId], queryFn: () => listarDoTema(p.temaId) })
  const [janela, setJanela] = useState<Janela>(null)
  const d = q.data ?? { cardapios: [], tipos: [], treinos: [], desafios: [] }
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
        <ItensDoTema
          lista={d.cardapios}
          tabela="cardapios"
          abrir={link('/app/admin/plano/cardapios')}
        />
        <Criar rotulo={t.novoCardapio} para={`/app/admin/plano/cardapios/novo?tema=${p.temaId}`} />
      </Parte>
      <PartesTreino tipos={d.tipos} treinos={d.treinos} abrir={setJanela} />
      <Parte titulo={t.desafio}>
        <ItensDoTema lista={d.desafios} tabela="desafios" abrir={link('/app/admin/desafios')} />
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
