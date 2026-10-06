import { useForm, type FieldValues, type Path, type Resolver } from 'react-hook-form'
import { Botao, Campo } from '@/components/ui'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'

export type CampoDef<E> = {
  nome: Path<E & FieldValues>
  rotulo: string
  tipo?: 'texto' | 'area' | 'datahora' | 'link'
}

type Props<E extends FieldValues, S> = {
  campos: CampoDef<E>[]
  inicial: E
  resolver: Resolver<E, unknown, S>
  aoSalvar: (d: S) => Promise<unknown>
  aoCancelar: () => void
}

/** Formulário simples para live e aviso: lista de campos, salvar e cancelar. */
export function FormAgenda<E extends FieldValues, S>({
  campos,
  inicial,
  resolver,
  aoSalvar,
  aoCancelar,
}: Props<E, S>) {
  const form = useForm<E, unknown, S>({ resolver, defaultValues: inicial as never })
  const erros = form.formState.errors as Record<string, { message?: string } | undefined>
  const enviar = form.handleSubmit(async (d) => {
    try {
      await aoSalvar(d)
    } catch {
      form.setError('root', { message: textos.erroSalvar })
    }
  })
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-2xl bg-white p-4">
      {campos.map((c) =>
        c.tipo === 'area' ? (
          <CampoArea
            key={c.nome}
            rotulo={c.rotulo}
            erro={erros[c.nome]?.message}
            {...form.register(c.nome)}
          />
        ) : (
          <Campo
            key={c.nome}
            rotulo={c.rotulo}
            type={c.tipo === 'datahora' ? 'datetime-local' : 'text'}
            inputMode={c.tipo === 'link' ? 'url' : undefined}
            erro={erros[c.nome]?.message}
            {...form.register(c.nome)}
          />
        ),
      )}
      {erros.root && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erros.root.message}
        </p>
      )}
      <div className="flex gap-2">
        <Botao type="submit" disabled={form.formState.isSubmitting} className="flex-1">
          {form.formState.isSubmitting ? textos.salvando : textos.salvar}
        </Botao>
        <Botao type="button" variante="secundario" onClick={aoCancelar}>
          {textos.cancelar}
        </Botao>
      </div>
    </form>
  )
}
