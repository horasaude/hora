import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { classeBrilho } from '@/components/ui'
import type { Aula } from '../api/conteudo.api'
import { listarDoTema, type ItemDoTema } from '../api/doTema.api'
import { doTema as t } from '../textos/doTema'
import { AulasDoTema } from './AulasDoTema'
import { ItensDoTema } from './ItensDoTema'
import { Criar, Janelas, type Janela } from './JanelasDoTema'

/** Cartão de uma parte do tema; Aulas ocupa a largura toda e as outras se encaixam em duas colunas,
 * cada uma crescendo conforme o que tem dentro, sem buraco entre os cartões. */
function Parte({
  titulo,
  largo,
  children,
}: {
  titulo: string
  largo?: boolean
  children: ReactNode
}) {
  return (
    <section
      className={`flex flex-col gap-3 rounded-[18px] border border-[#ECEFED] bg-white p-5 shadow-painel ${largo ? '' : 'mb-5 break-inside-avoid'}`}
    >
      <h2 className="text-[17px] font-bold text-verde-escuro">{titulo}</h2>
      {children}
    </section>
  )
}

const nome = 'text-left font-semibold text-tinta underline-offset-4 hover:underline'

const link = (para: string) => (i: ItemDoTema) => (
  <Link to={`${para}/${i.id}`} className={nome}>
    {i.titulo}
  </Link>
)

/** Partes da nutricionista: cardápios, receitas e materiais, cada uma com adicionar existente ou criar. */
function PartesNutri({
  d,
  abrir,
}: {
  d: Record<'cardapios' | 'receitas' | 'materiais', ItemDoTema[]>
  abrir: (j: Janela) => void
}) {
  return (
    <>
      <Parte titulo={t.cardapios}>
        <ItensDoTema
          lista={d.cardapios}
          tabela="cardapios"
          abrir={link('/app/admin/plano/cardapios')}
        />
        <Criar rotulo={t.maisCardapio} aoClicar={() => abrir({ tipo: 'usarCardapio' })} />
      </Parte>
      <Parte titulo={t.receitas}>
        <ItensDoTema
          lista={d.receitas}
          tabela="receitas"
          abrir={link('/app/admin/plano/receitas')}
        />
        <Criar rotulo={t.maisReceita} aoClicar={() => abrir({ tipo: 'usarReceita' })} />
      </Parte>
      <Parte titulo={t.materiaisNutri}>
        <ItensDoTema
          lista={d.materiais}
          tabela="materiais_nutricao"
          abrir={link('/app/admin/plano/materiais')}
        />
        <Criar rotulo={t.maisMaterial} aoClicar={() => abrir({ tipo: 'usarMaterial' })} />
      </Parte>
    </>
  )
}

const vazio = { cardapios: [], receitas: [], materiais: [], tipos: [], desafios: [] }

/** Dentro do tema, em tela cheia: cada profissional cria a sua parte (aulas, cardápios, receitas,
 * materiais, tipos de treino, desafio e arquivos). */
export function ConteudoDoTema(p: { temaId: string; temaPublicado: boolean; aulas: Aula[] }) {
  const q = useQuery({ queryKey: ['do-tema', p.temaId], queryFn: () => listarDoTema(p.temaId) })
  const [janela, setJanela] = useState<Janela>(null)
  const d = q.data ?? vazio
  return (
    <div className="flex flex-col gap-5">
      <Parte titulo={t.aulas} largo>
        <AulasDoTema aulas={p.aulas} temaId={p.temaId} temaPublicado={p.temaPublicado} />
      </Parte>
      <div className="gap-5 lg:columns-2">
        <Parte titulo={t.tipos}>
          <ItensDoTema
            lista={d.tipos}
            tabela="rotinas"
            abrir={(i) => (
              <button
                type="button"
                className={nome}
                onClick={() => setJanela({ tipo: 'tipo', id: i.id })}
              >
                {i.titulo}
              </button>
            )}
          />
          <Criar rotulo={t.maisTipo} aoClicar={() => setJanela({ tipo: 'usarTipo' })} />
        </Parte>
        <Parte titulo={t.desafio}>
          <ItensDoTema lista={d.desafios} tabela="desafios" abrir={link('/app/admin/desafios')} />
          <Criar rotulo={t.novoDesafio} aoClicar={() => setJanela({ tipo: 'desafio' })} />
        </Parte>
        <PartesNutri d={d} abrir={setJanela} />
        <Parte titulo={t.materiais}>
          <button
            type="button"
            className={`self-start ${classeBrilho('cinza')}`}
            onClick={() => setJanela({ tipo: 'materiais' })}
          >
            {t.editarMateriais}
          </button>
        </Parte>
      </div>
      <Janelas janela={janela} temaId={p.temaId} fechar={() => setJanela(null)} abrir={setJanela} />
    </div>
  )
}
