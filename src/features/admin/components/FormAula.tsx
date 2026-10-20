import { useId, type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { Janela } from '@/components/ui'
import type { Etapa, Tema } from '../api/conteudo.api'
import { esquemaAula, esquemaAulaPara } from '../schemas/formularios'
import { textos } from '../textos'
import { OndeFica } from './OndeFica'
import { CampoLiberacao } from './CampoLiberacao'
import { Descricao, Liberacao, QuemEQuanto, TituloEVideo } from './CamposAula'
import { ErroForm } from './RodapeForm'
import { RodapeAula } from './RodapeAula'

export type EntradaAula = z.input<typeof esquemaAula>
export type DadosAula = z.output<typeof esquemaAula>

type Props = {
  materiais?: ReactNode
  temas: Tema[]
  etapas: Etapa[]
  titulo: string
  inicial: EntradaAula
  /** publicar: true no botão Publicar, false no Salvar rascunho. */
  aoSalvar: (d: DadosAula, publicar: boolean) => Promise<unknown>
  aoCancelar: () => void
}

function useFormAula({ temas, inicial, aoSalvar }: Pick<Props, 'temas' | 'inicial' | 'aoSalvar'>) {
  const preparacoes = temas.filter((t) => t.tipo === 'preparacao').map((t) => t.id)
  const form = useForm<EntradaAula, unknown, DadosAula>({
    resolver: zodResolver(esquemaAulaPara(preparacoes)),
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
  const tema = useWatch({ control: form.control, name: 'tema' })
  return { form, enviar, preparacao: preparacoes.includes(tema) }
}

/** Aula numa janela: onde fica, título, vídeo com prévia grande, profissional e duração, texto, arquivos, dia em que libera e liberação (disponível, em breve ou data). */
export function FormAula({
  titulo,
  inicial,
  aoSalvar,
  aoCancelar,
  temas,
  etapas,
  materiais,
}: Props) {
  const id = useId()
  const { form, enviar, preparacao } = useFormAula({ temas, inicial, aoSalvar })
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
        <OndeFica
          temas={temas}
          etapas={etapas}
          register={register}
          control={control}
          setValue={form.setValue}
          erros={{ tema: erros.tema?.message, etapa: erros.etapa?.message }}
        />
        <TituloEVideo register={register} control={control} erros={erros} />
        <QuemEQuanto register={register} erro={erros.duracao?.message} />
        <Descricao control={control} />
        <div className="sm:col-span-2">{materiais}</div>
        <div className="flex flex-col gap-3">
          <Liberacao register={register} erroDia={erros.dia?.message} preparacao={preparacao} />
        </div>
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
