import { useForm, useWatch, type Control, type UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Botao, Campo } from '@/components/ui'
import { esquemaAula } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { PreviaVideo } from './PreviaVideo'

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

type Props = {
  inicial: EntradaAula
  aoSalvar: (d: DadosAula) => Promise<unknown>
  aoCancelar: () => void
}

/** Aula: título, descrição, vídeo com prévia, material e quando libera. */
export function FormAula({ inicial, aoSalvar, aoCancelar }: Props) {
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
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <Campo rotulo={t.campoTitulo} erro={erros.titulo?.message} {...register('titulo')} />
      <Campo
        rotulo={t.campoVideo}
        placeholder={t.exemploVideo}
        inputMode="url"
        erro={erros.video_url?.message}
        {...register('video_url')}
      />
      <Previa control={control} />
      <CampoArea rotulo={t.campoDescricao} {...register('descricao')} />
      <Campo
        rotulo={t.campoMaterial}
        inputMode="url"
        erro={erros.material_url?.message}
        {...register('material_url')}
      />
      <Liberacao control={control} register={register} erroDia={erros.dia?.message} />
      {erros.root && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erros.root.message}
        </p>
      )}
      <div className="flex gap-2">
        <Botao
          type="submit"
          disabled={formState.isSubmitting}
          className="flex-1 rounded-xl text-sm"
        >
          {formState.isSubmitting ? textos.salvando : textos.salvar}
        </Botao>
        <Botao
          type="button"
          variante="secundario"
          className="rounded-xl text-sm"
          onClick={aoCancelar}
        >
          {textos.cancelar}
        </Botao>
      </div>
    </form>
  )
}
