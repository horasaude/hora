import { useId, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Campo, Janela } from '@/components/ui'
import type { z } from 'zod'
import { esquemaNome } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { liberacao as tl } from '../textos/liberacao'
import { CampoLiberacao } from './CampoLiberacao'
import { ErroForm, RodapeForm } from './RodapeForm'

type Entrada = z.input<typeof esquemaNome>
export type DadosNome = z.output<typeof esquemaNome>
type Props = {
  titulo: string
  rotulo: string
  /** Com liberacao, a janela mostra também Disponível, Em breve ou Liberar em (tema). */
  inicial?: Entrada
  aoSalvar: (dados: DadosNome) => Promise<unknown>
  /** Parte que não é campo do formulário (ex.: a capa do tema), no fim da janela. */
  extra?: ReactNode
  aoCancelar: () => void
}

/** Nome e descrição numa janela, usado em tema (com a liberação) e etapa. */
export function FormNome({ titulo, rotulo, inicial, aoSalvar, aoCancelar, extra }: Props) {
  const id = useId()
  const form = useForm<Entrada, unknown, DadosNome>({
    resolver: zodResolver(esquemaNome),
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
        {inicial?.dias !== undefined && (
          <Campo
            rotulo={tl.campoDias}
            type="number"
            min={1}
            max={365}
            inputMode="numeric"
            erro={erros.dias?.message}
            {...form.register('dias')}
          />
        )}
        {inicial?.liberacao && (
          <Controller
            control={form.control}
            name="liberacao"
            render={({ field }) => (
              <CampoLiberacao
                valor={field.value ?? { modo: 'aberta', quando: '' }}
                aoMudar={field.onChange}
                erro={erros.liberacao?.quando?.message}
              />
            )}
          />
        )}
        {extra}
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
