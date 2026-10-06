import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Botao, Campo } from '@/components/ui'
import { esquemaTema } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'

type Dados = { titulo: string; descricao: string }
type Props = {
  rotulo: string
  inicial?: Dados
  aoSalvar: (dados: Dados) => Promise<unknown>
  aoCancelar: () => void
}

/** Formulário de nome e descrição, usado em tema e etapa. */
export function FormNome({ rotulo, inicial, aoSalvar, aoCancelar }: Props) {
  const form = useForm<Dados>({
    resolver: zodResolver(esquemaTema),
    defaultValues: inicial ?? { titulo: '', descricao: '' },
  })
  const erros = form.formState.errors
  const enviar = form.handleSubmit(async (dados) => {
    try {
      await aoSalvar(dados)
    } catch {
      form.setError('root', { message: textos.erroSalvar })
    }
  })
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
      <Campo rotulo={rotulo} erro={erros.titulo?.message} {...form.register('titulo')} />
      <CampoArea rotulo={textos.temas.campoDescricao} rows={3} {...form.register('descricao')} />
      {erros.root && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erros.root.message}
        </p>
      )}
      <div className="flex gap-2">
        <Botao
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex-1 rounded-xl text-sm"
        >
          {form.formState.isSubmitting ? textos.salvando : textos.salvar}
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
