import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Campo, Janela } from '@/components/ui'
import { esquemaTema } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { ErroForm, RodapeForm } from './RodapeForm'

type Dados = { titulo: string; descricao: string }
type Props = {
  titulo: string
  rotulo: string
  inicial?: Dados
  aoSalvar: (dados: Dados) => Promise<unknown>
  aoCancelar: () => void
}

/** Nome e descrição numa janela, usado em tema e etapa. */
export function FormNome({ titulo, rotulo, inicial, aoSalvar, aoCancelar }: Props) {
  const id = useId()
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
    <Janela
      titulo={titulo}
      aoFechar={aoCancelar}
      rotuloFechar={textos.fechar}
      rodape={
        <RodapeForm formId={id} salvando={form.formState.isSubmitting} aoCancelar={aoCancelar} />
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <Campo rotulo={rotulo} erro={erros.titulo?.message} {...form.register('titulo')} />
        <CampoArea rotulo={textos.temas.campoDescricao} rows={4} {...form.register('descricao')} />
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
