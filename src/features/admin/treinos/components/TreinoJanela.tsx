import { BotaoBrilho, Janela } from '@/components/ui'
import { useTemas } from '../../hooks/usePainel'
import { CampoArea } from '../../components/CampoArea'
import { ErroForm } from '../../components/RodapeForm'
import type { Exercicio, ItemTreino, Treino } from '../api/treinos.api'
import { useTreinoForm } from '../hooks/useTreinoForm'
import { t } from '../textos'
import { AdicionarExercicio } from './AdicionarExercicio'
import { BlocoOpcional, CamposTreino } from './CamposTreino'
import { ItensTreino } from './ItensTreino'
import { Rotulos } from './rotulos'

type Props = {
  treino?: Treino
  itensIniciais?: ItemTreino[]
  aoFechar: () => void
  /** Treino novo criado de dentro de um tema já vem com ele. */
  temaId?: string
  /** Treino novo já como aeróbico (botão + Novo aeróbico). */
  categoria?: 'musculacao' | 'aerobico'
}

function Rodape({
  editando,
  ocupado,
  aoFechar,
  gravar,
}: {
  editando: boolean
  ocupado: boolean
  aoFechar: () => void
  gravar: (publicado: boolean, copia?: boolean) => () => void
}) {
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.cancelar}
      </BotaoBrilho>
      {editando && (
        <BotaoBrilho tom="prata" onClick={gravar(false, true)} disabled={ocupado}>
          {t.duplicar}
        </BotaoBrilho>
      )}
      <BotaoBrilho onClick={gravar(false)} disabled={ocupado}>
        {ocupado ? t.salvando : t.salvarRascunho}
      </BotaoBrilho>
      <BotaoBrilho tom="verde" onClick={gravar(true)} disabled={ocupado}>
        {t.publicar}
      </BotaoBrilho>
    </>
  )
}

const novoItem = (e: Exercicio, aerobico: boolean): ItemTreino => ({
  chave: crypto.randomUUID(),
  nome: e.nome,
  exercicio_id: e.id,
  series: aerobico ? 1 : 3,
  repeticoes: aerobico ? '20 min' : '12',
  carga: aerobico ? 'Moderada' : '',
  descanso_segundos: aerobico ? 0 : 60,
  observacao: '',
  series_detalhe: [],
  alternativo_id: null,
  alternativo_nome: '',
  combinado: null,
})

/** Exercícios do treino; no aeróbico, os campos viram blocos, duração e intensidade. */
function ExerciciosDoTreino({
  aerobico,
  itens,
  setItens,
}: {
  aerobico: boolean
  itens: ItemTreino[]
  setItens: (x: ItemTreino[]) => void
}) {
  return (
    <Rotulos.Provider value={aerobico ? t.rotulos.aerobico : t.rotulos.musculacao}>
      <section className="flex flex-col gap-3 sm:col-span-2">
        <h3 className="text-sm font-bold text-verde-escuro">{t.itens.titulo}</h3>
        <ItensTreino itens={itens} mudar={setItens} />
        <AdicionarExercicio
          grupoInicial={aerobico ? 'cardio' : ''}
          aoEscolher={(lista) => setItens([...itens, ...lista.map((e) => novoItem(e, aerobico))])}
        />
      </section>
    </Rotulos.Provider>
  )
}

/** Montar treino: dados, aquecimento, exercícios da biblioteca, alongamento; rascunho, publicar e duplicar. */
export function TreinoJanela({ treino, itensIniciais = [], aoFechar, temaId, categoria }: Props) {
  const temas = useTemas().data ?? []
  const { form, itens, setItens, gravar } = useTreinoForm(
    treino,
    itensIniciais,
    aoFechar,
    temaId,
    categoria,
  )
  const { register, formState } = form
  const aerobico = form.watch('categoria') === 'aerobico'
  return (
    <Janela
      titulo={
        treino ? t.editarTreino : (aerobico ? t.novoAerobico : t.novoTreino).replace('+ ', '')
      }
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <Rodape
          editando={Boolean(treino)}
          ocupado={formState.isSubmitting}
          aoFechar={aoFechar}
          gravar={gravar}
        />
      }
    >
      <form onSubmit={gravar(false)} noValidate className="grid gap-4 sm:grid-cols-2">
        <CamposTreino
          register={register}
          erros={formState.errors}
          temas={temas}
          categoria={aerobico ? 'aerobico' : 'musculacao'}
        />
        <div className="sm:col-span-2">
          <CampoArea
            id="treino-orientacoes"
            rotulo={t.campos.orientacoes}
            rows={3}
            {...register('orientacoes')}
          />
        </div>
        <BlocoOpcional
          id="treino-aquecimento"
          rotulo={t.campos.aquecimento}
          {...register('aquecimento')}
        />
        <ExerciciosDoTreino aerobico={aerobico} itens={itens} setItens={setItens} />
        <BlocoOpcional
          id="treino-alongamento"
          rotulo={t.campos.alongamento}
          {...register('alongamento')}
        />
        <ErroForm mensagem={formState.errors.root?.message} />
      </form>
    </Janela>
  )
}
