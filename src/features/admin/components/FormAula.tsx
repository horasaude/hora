import { useId } from 'react'
import { useForm, useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Campo, Janela } from '@/components/ui'
import { esquemaAula, esquemaAulaAte } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { PreviaVideo } from './PreviaVideo'
import { ErroForm, RodapeForm } from './RodapeForm'

const t = textos.aulas
export type EntradaAula = z.input<typeof esquemaAula>
export type DadosAula = z.output<typeof esquemaAula>

/** Dia em que a aula libera: da preparação (1 a 7) ou dentro da etapa do tema. */
function Liberacao({
  register,
  erroDia,
  preparacao,
}: {
  register: UseFormRegister<EntradaAula>
  erroDia?: string
  preparacao: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <Campo
        rotulo={preparacao ? t.campoDiaPreparacao : t.campoDiaEtapa}
        type="number"
        min={1}
        max={preparacao ? 7 : undefined}
        inputMode="numeric"
        erro={erroDia}
        {...register('dia')}
      />
      <span className="text-xs text-suave">{preparacao ? t.ajudaPreparacao : t.ajudaEtapa}</span>
    </div>
  )
}

function Previa({ control }: { control: Control<EntradaAula, unknown, DadosAula> }) {
  return <PreviaVideo link={useWatch({ control, name: 'video_url' }) ?? ''} />
}

/** Profissional e duração (as duas colunas da janela). */
function QuemEQuanto({
  register,
  erro,
}: {
  register: UseFormRegister<EntradaAula>
  erro?: string
}) {
  return (
    <>
      <Campo
        rotulo={t.campoProfissional}
        placeholder={t.exemploProfissional}
        {...register('profissional')}
      />
      <Campo
        rotulo={t.campoDuracao}
        type="number"
        min={1}
        inputMode="numeric"
        erro={erro}
        {...register('duracao')}
      />
    </>
  )
}

type Props = {
  preparacao?: boolean
  titulo: string
  inicial: EntradaAula
  aoSalvar: (d: DadosAula) => Promise<unknown>
  aoCancelar: () => void
}

/** Aula numa janela: título e vídeo com prévia, profissional e duração, texto, material e quando libera. */
export function FormAula({ titulo, inicial, aoSalvar, aoCancelar, preparacao = false }: Props) {
  const id = useId()
  const form = useForm<EntradaAula, unknown, DadosAula>({
    resolver: zodResolver(esquemaAulaAte(preparacao ? 7 : 9999)),
    defaultValues: inicial,
  })
  const { register, control, formState } = form
  const erros = formState.errors
  const enviar = form.handleSubmit(async (d) => {
    try {
      await aoSalvar(d)
    } catch {
      form.setError('root', { message: textos.erroSalvar })
    }
  })
  return (
    <Janela
      titulo={titulo}
      aoFechar={aoCancelar}
      rotuloFechar={textos.fechar}
      rodape={<RodapeForm formId={id} salvando={formState.isSubmitting} aoCancelar={aoCancelar} />}
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        <Campo rotulo={t.campoTitulo} erro={erros.titulo?.message} {...register('titulo')} />
        <Campo
          rotulo={t.campoVideo}
          placeholder={t.exemploVideo}
          inputMode="url"
          erro={erros.video_url?.message}
          {...register('video_url')}
        />
        <div className="sm:col-span-2">
          <Previa control={control} />
        </div>
        <QuemEQuanto register={register} erro={erros.duracao?.message} />
        <div className="sm:col-span-2">
          <CampoArea rotulo={t.campoDescricao} {...register('descricao')} />
        </div>
        <Campo
          rotulo={t.campoMaterial}
          inputMode="url"
          erro={erros.material_url?.message}
          {...register('material_url')}
        />
        <div className="flex flex-col gap-3">
          <Liberacao register={register} erroDia={erros.dia?.message} preparacao={preparacao} />
        </div>
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
