import { useId, type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Janela } from '@/components/ui'
import type { Tema } from '../api/conteudo.api'
import { esquemaAula } from '../schemas/formularios'
import { textos } from '../textos'
import { OndeFica } from './OndeFica'
import { CampoLiberacao } from './CampoLiberacao'
import { Descricao, QuemEQuanto, TituloEVideo } from './CamposAula'
import { ErroForm } from './RodapeForm'
import { RodapeAula } from './RodapeAula'

export type EntradaAula = z.input<typeof esquemaAula>
export type DadosAula = z.output<typeof esquemaAula>

type Props = {
  materiais?: ReactNode
  temas: Tema[]
  titulo: string
  inicial: EntradaAula
  /** publicar: true no botão Publicar, false no Salvar rascunho. */
  aoSalvar: (d: DadosAula, publicar: boolean) => Promise<unknown>
  aoCancelar: () => void
}

function useFormAula({ inicial, aoSalvar }: Pick<Props, 'inicial' | 'aoSalvar'>) {
  const form = useForm<EntradaAula, unknown, DadosAula>({
    resolver: zodResolver(esquemaAula),
    defaultValues: inicial,
  })
  const enviar = (publicar: boolean) =>
    form.handleSubmit(async (d) => {
      try {
        await aoSalvar(d, publicar)
      } catch (e) {
        const esperar = e instanceof Error && e.message === textos.arquivos.esperar
        form.setError('root', { message: esperar ? textos.arquivos.esperar : textos.erroSalvar })
      }
    })
  return { form, enviar }
}

/** Aula numa janela: onde fica, título, vídeo com prévia grande, profissional e duração, texto, arquivos e liberação (disponível, em breve ou data). */
export function FormAula({ titulo, inicial, aoSalvar, aoCancelar, temas, materiais }: Props) {
  const id = useId()
  const { form, enviar } = useFormAula({ inicial, aoSalvar })
  const { register, control, formState } = form
  const erros = formState.errors
  return (
    <Janela
      titulo={titulo}
      aoFechar={aoCancelar}
      rotuloFechar={textos.fechar}
      rodape={
        <RodapeAula
          salvando={formState.isSubmitting}
          aoCancelar={aoCancelar}
          aoRascunho={enviar(false)}
          aoPublicar={enviar(true)}
        />
      }
    >
      <form id={id} onSubmit={enviar(false)} noValidate className="grid gap-4 sm:grid-cols-2">
        <OndeFica temas={temas} register={register} erro={erros.tema?.message} />
        <TituloEVideo register={register} control={control} erros={erros} />
        <QuemEQuanto register={register} erro={erros.duracao?.message} />
        <Descricao control={control} />
        <div className="sm:col-span-2">{materiais}</div>
        <Controller
          control={control}
          name="liberacao"
          render={({ field }) => (
            <CampoLiberacao
              valor={field.value}
              aoMudar={field.onChange}
              erro={erros.liberacao?.quando?.message}
            />
          )}
        />
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}
