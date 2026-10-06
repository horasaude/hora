import { useId } from 'react'
import { useForm, useWatch, type FieldValues, type Resolver } from 'react-hook-form'
import { Janela } from '@/components/ui'
import { textos } from '../textos'
import { CampoDoForm, type CampoDef } from './CampoDoForm'
import { ErroForm, RodapeForm } from './RodapeForm'

export type { CampoDef }

type Props<E extends FieldValues, S> = {
  titulo: string
  campos: CampoDef<E>[]
  inicial: E
  resolver: Resolver<E, unknown, S>
  aoSalvar: (d: S) => Promise<unknown>
  aoCancelar: () => void
}

const inteira = <E,>(c: CampoDef<E>) =>
  (c.largura ?? (c.tipo === 'area' ? 'inteira' : 'meia')) === 'inteira'

/** Formulário genérico do painel numa janela: campos em duas colunas, Cancelar e Salvar no rodapé. */
export function FormAgenda<E extends FieldValues, S>({
  titulo,
  campos,
  inicial,
  resolver,
  aoSalvar,
  aoCancelar,
}: Props<E, S>) {
  const id = useId()
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
    <Janela
      titulo={titulo}
      aoFechar={aoCancelar}
      rotuloFechar={textos.fechar}
      rodape={
        <RodapeForm formId={id} salvando={form.formState.isSubmitting} aoCancelar={aoCancelar} />
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        {visiveis.map((c) => (
          <div key={c.nome} className={inteira(c) ? 'sm:col-span-2' : ''}>
            <CampoDoForm campo={c} register={form.register} erro={erros[c.nome]?.message} />
          </div>
        ))}
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
