import { useForm, useWatch, type FieldValues, type Resolver } from 'react-hook-form'
import { Botao } from '@/components/ui'
import { textos } from '../textos'
import { CampoDoForm, type CampoDef } from './CampoDoForm'

export type { CampoDef }

type Props<E extends FieldValues, S> = {
  campos: CampoDef<E>[]
  inicial: E
  resolver: Resolver<E, unknown, S>
  aoSalvar: (d: S) => Promise<unknown>
  aoCancelar: () => void
}

/** Salvar e cancelar, no rodapé do formulário. */
function Botoes({ salvando, aoCancelar }: { salvando: boolean; aoCancelar: () => void }) {
  return (
    <div className="flex gap-2">
      <Botao type="submit" disabled={salvando} className="flex-1 rounded-xl text-sm">
        {salvando ? textos.salvando : textos.salvar}
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
  )
}

/** Formulário genérico do painel (live, aviso, cardápio, desafio): lista de campos, salvar e cancelar. */
export function FormAgenda<E extends FieldValues, S>({
  campos,
  inicial,
  resolver,
  aoSalvar,
  aoCancelar,
}: Props<E, S>) {
  const form = useForm<E, unknown, S>({ resolver, defaultValues: inicial as never })
  const erros = form.formState.errors as Record<string, { message?: string } | undefined>
  const valores = useWatch({ control: form.control }) as E
  const visiveis = campos.filter((c) => !c.quando || c.quando(valores))
  const enviar = form.handleSubmit(async (d) => {
    try {
      await aoSalvar(d)
    } catch {
      form.setError('root', { message: textos.erroSalvar })
    }
  })
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      {visiveis.map((c) => (
        <CampoDoForm
          key={c.nome}
          campo={c}
          register={form.register}
          erro={erros[c.nome]?.message}
        />
      ))}
      {erros.root && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erros.root.message}
        </p>
      )}
      <Botoes salvando={form.formState.isSubmitting} aoCancelar={aoCancelar} />
    </form>
  )
}
