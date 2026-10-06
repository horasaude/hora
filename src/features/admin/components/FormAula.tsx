import { useId } from 'react'
import { useForm, useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Campo, Janela } from '@/components/ui'
import { esquemaAula } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { PreviaVideo } from './PreviaVideo'
import { ErroForm, RodapeForm } from './RodapeForm'

const t = textos.aulas
export type EntradaAula = z.input<typeof esquemaAula>
export type DadosAula = z.output<typeof esquemaAula>

const OPCOES = [
  { valor: 'compra', nome: t.naCompra },
  { valor: 'sete', nome: t.seteDias },
  { valor: 'outro', nome: t.outroDia },
] as const

/** Quando a aula libera: na compra, depois de 7 dias ou em outro dia. */
function Liberacao({
  control,
  register,
  erroDia,
}: {
  control: Control<EntradaAula, unknown, DadosAula>
  register: UseFormRegister<EntradaAula>
  erroDia?: string
}) {
  const escolha = useWatch({ control, name: 'liberacao' })
  return (
    <>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">{t.liberacao}</legend>
        {OPCOES.map((o) => (
          <label
            key={o.valor}
            className="flex min-h-12 items-center gap-3 rounded-xl border border-linha px-4 has-checked:border-ora has-checked:bg-salvia-suave"
          >
            <input
              type="radio"
              value={o.valor}
              className="size-4 accent-ora"
              {...register('liberacao')}
            />
            <span className="text-sm">{o.nome}</span>
          </label>
        ))}
      </fieldset>
      {escolha === 'outro' && (
        <Campo
          rotulo={t.campoDia}
          type="number"
          min={1}
          inputMode="numeric"
          erro={erroDia}
          {...register('dia')}
        />
      )}
    </>
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
  titulo: string
  inicial: EntradaAula
  aoSalvar: (d: DadosAula) => Promise<unknown>
  aoCancelar: () => void
}

/** Aula numa janela: título e vídeo com prévia, profissional e duração, texto, material e quando libera. */
export function FormAula({ titulo, inicial, aoSalvar, aoCancelar }: Props) {
  const id = useId()
  const form = useForm<EntradaAula, unknown, DadosAula>({
    resolver: zodResolver(esquemaAula),
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
          <Liberacao control={control} register={register} erroDia={erros.dia?.message} />
        </div>
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
