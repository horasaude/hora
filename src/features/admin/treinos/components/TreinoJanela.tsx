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

type Props = { treino?: Treino; itensIniciais?: ItemTreino[]; aoFechar: () => void }

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

const novoItem = (e: Exercicio): ItemTreino => ({
  chave: crypto.randomUUID(),
  nome: e.nome,
  exercicio_id: e.id,
  series: 3,
  repeticoes: '12',
  carga: '',
  descanso_segundos: 60,
  observacao: '',
  series_detalhe: [],
  alternativo_id: null,
  alternativo_nome: '',
})

/** Montar treino: dados, aquecimento, exercícios da biblioteca, alongamento; rascunho, publicar e duplicar. */
export function TreinoJanela({ treino, itensIniciais = [], aoFechar }: Props) {
  const temas = useTemas().data ?? []
  const { form, itens, setItens, gravar } = useTreinoForm(treino, itensIniciais, aoFechar)
  const { register, formState } = form
  return (
    <Janela
      titulo={treino ? t.editarTreino : t.novoTreino.replace('+ ', '')}
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
        <CamposTreino register={register} erros={formState.errors} temas={temas} />
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
        <section className="flex flex-col gap-3 sm:col-span-2">
          <h3 className="text-sm font-bold text-verde-escuro">{t.itens.titulo}</h3>
          <ItensTreino itens={itens} mudar={setItens} />
          <AdicionarExercicio
            aoEscolher={(lista) => setItens([...itens, ...lista.map(novoItem)])}
          />
        </section>
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
