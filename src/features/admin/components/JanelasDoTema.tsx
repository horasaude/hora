// Janelas e botões de criar das partes do tema no painel (ConteudoDoTema).
import { Link } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { doTema as t } from '../textos/doTema'
import { EditarTreino } from '../treinos/components/TabelaTreinos'
import { TreinoJanela } from '../treinos/components/TreinoJanela'
import { AdicionarCardapio, AdicionarTreino } from './AdicionarExistente'
import { DesafioForm } from './DesafioForm'
import { MateriaisTemaJanela } from './MateriaisTemaJanela'

export type Janela = {
  tipo: 'treino' | 'desafio' | 'materiais' | 'usarCardapio' | 'usarTreino'
  id?: string
} | null

/** Botão dourado de criar, no fim de cada parte. */
export const Criar = ({
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

export function Janelas({
  janela,
  temaId,
  fechar,
  abrir,
}: {
  janela: Janela
  temaId: string
  fechar: () => void
  abrir: (j: Janela) => void
}) {
  if (janela?.tipo === 'treino')
    return janela.id ? (
      <EditarTreino id={janela.id} aoFechar={fechar} />
    ) : (
      <TreinoJanela temaId={temaId} aoFechar={fechar} />
    )
  if (janela?.tipo === 'usarCardapio')
    return (
      <AdicionarCardapio
        temaId={temaId}
        aoFechar={fechar}
        criar={
          <Criar rotulo={t.novoCardapio} para={`/app/admin/plano/cardapios/novo?tema=${temaId}`} />
        }
      />
    )
  if (janela?.tipo === 'usarTreino')
    return (
      <AdicionarTreino
        temaId={temaId}
        aoFechar={fechar}
        criar={<Criar rotulo={t.novoTreino} aoClicar={() => abrir({ tipo: 'treino' })} />}
      />
    )
  if (janela?.tipo === 'desafio') return <DesafioForm temaId={temaId} aoFechar={fechar} />
  if (janela?.tipo === 'materiais') return <MateriaisTemaJanela tema={temaId} aoFechar={fechar} />
  return null
}
