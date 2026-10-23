// Janelas e botões de criar das partes do tema no painel (ConteudoDoTema).
import { Link } from 'react-router-dom'
import { classeBrilho } from '@/components/ui'
import { doTema as t } from '../textos/doTema'
import { MaterialForm } from '../plano/components/MaterialForm'
import { RotinaJanela } from '../treinos/components/RotinaJanela'
import { useRotinas } from '../treinos/hooks/useTreinosPainel'
import {
  AdicionarCardapio,
  AdicionarMaterial,
  AdicionarReceita,
  AdicionarTipo,
} from './AdicionarExistente'
import { DesafioForm } from './DesafioForm'
import { MateriaisTemaJanela } from './MateriaisTemaJanela'

export type Janela = {
  tipo:
    | 'tipo'
    | 'material'
    | 'desafio'
    | 'materiais'
    | 'usarCardapio'
    | 'usarTipo'
    | 'usarReceita'
    | 'usarMaterial'
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

/** Tipo de treino do tema: o que já existe abre para editar; sem id, um novo neste tema. */
function TipoJanela({ id, temaId, fechar }: { id?: string; temaId: string; fechar: () => void }) {
  const rotinas = useRotinas()
  if (!id) return <RotinaJanela temaId={temaId} aoFechar={fechar} />
  const r = rotinas.data?.find((x) => x.id === id)
  return r ? <RotinaJanela rotina={r} aoFechar={fechar} /> : null
}

type Props = { janela: Janela; temaId: string; fechar: () => void; abrir: (j: Janela) => void }

/** Escolher um que já existe, com o botão de criar novo no rodapé. */
function Escolhas({ janela, temaId, fechar, abrir }: Props) {
  const base = { temaId, aoFechar: fechar }
  if (janela?.tipo === 'usarCardapio')
    return (
      <AdicionarCardapio
        {...base}
        criar={
          <Criar rotulo={t.novoCardapio} para={`/app/admin/plano/cardapios/novo?tema=${temaId}`} />
        }
      />
    )
  if (janela?.tipo === 'usarTipo')
    return (
      <AdicionarTipo
        {...base}
        criar={<Criar rotulo={t.novoTipo} aoClicar={() => abrir({ tipo: 'tipo' })} />}
      />
    )
  if (janela?.tipo === 'usarReceita')
    return (
      <AdicionarReceita
        {...base}
        criar={
          <Criar rotulo={t.novaReceita} para={`/app/admin/plano/receitas/nova?tema=${temaId}`} />
        }
      />
    )
  if (janela?.tipo === 'usarMaterial')
    return (
      <AdicionarMaterial
        {...base}
        criar={<Criar rotulo={t.novoMaterial} aoClicar={() => abrir({ tipo: 'material' })} />}
      />
    )
  return null
}

export function Janelas(p: Props) {
  const { janela, temaId, fechar } = p
  if (janela?.tipo === 'tipo') return <TipoJanela id={janela.id} temaId={temaId} fechar={fechar} />
  if (janela?.tipo === 'material') return <MaterialForm temaId={temaId} aoFechar={fechar} />
  if (janela?.tipo === 'desafio') return <DesafioForm temaId={temaId} aoFechar={fechar} />
  if (janela?.tipo === 'materiais') return <MateriaisTemaJanela tema={temaId} aoFechar={fechar} />
  return <Escolhas {...p} />
}
