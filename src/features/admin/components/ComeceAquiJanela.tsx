import { useId } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Campo, Janela } from '@/components/ui'
import { buscarComeceAqui, salvarComeceAqui } from '../api/conteudo.api'
import { useSalvar } from '../hooks/usePainel'
import { esquemaComeceAqui, type EntradaComece } from '../schemas/formularios'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { Estado } from './Estado'
import { PreviaVideo } from './PreviaVideo'
import { ErroForm, RodapeForm } from './RodapeForm'

const t = textos.temas

function Formulario({ inicial, aoFechar }: { inicial: EntradaComece; aoFechar: () => void }) {
  const id = useId()
  const salvar = useSalvar(salvarComeceAqui)
  const form = useForm({ resolver: zodResolver(esquemaComeceAqui), defaultValues: inicial })
  const erros = form.formState.errors
  const video = useWatch({ control: form.control, name: 'video_url' }) ?? ''
  const enviar = form.handleSubmit(async (d) => {
    try {
      await salvar.mutateAsync(d)
      aoFechar()
    } catch {
      form.setError('root', { message: textos.erroSalvar })
    }
  })
  return (
    <Janela
      titulo={t.comeceJanela}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <RodapeForm formId={id} salvando={form.formState.isSubmitting} aoCancelar={aoFechar} />
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        <p className="text-sm text-suave sm:col-span-2">{t.comeceAjuda}</p>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Campo
            rotulo={t.comeceVideo}
            inputMode="url"
            erro={erros.video_url?.message}
            {...form.register('video_url')}
          />
          <span className="text-xs text-suave">{textos.aulas.ajudaVideo}</span>
        </div>
        <div className="sm:col-span-2">
          <PreviaVideo link={video} />
        </div>
        <div className="sm:col-span-2">
          <CampoArea rotulo={t.comeceTexto} rows={6} {...form.register('texto')} />
        </div>
        <ErroForm mensagem={erros.root?.message} />
      </form>
    </Janela>
  )
}

/** Janela grande para editar o vídeo e o texto do "Comece por aqui". */
export function ComeceAquiJanela({ aoFechar }: { aoFechar: () => void }) {
  const atual = useQuery({ queryKey: ['comece-aqui-painel'], queryFn: buscarComeceAqui })
  if (atual.isPending) return null
  if (atual.isError) return <Estado tipo="erro" tentar={() => atual.refetch()} />
  return (
    <Formulario
      inicial={{ video_url: atual.data.video_url ?? '', texto: atual.data.texto }}
      aoFechar={aoFechar}
    />
  )
}
