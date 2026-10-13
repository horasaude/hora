import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { Campo } from '@/components/ui'
import { EditorTexto } from '../plano/components/EditorTexto'
import { textos } from '../textos'
import type { DadosAula, EntradaAula } from './FormAula'
import { PreviaVideo } from './PreviaVideo'

const t = textos.aulas
type Controle = Control<EntradaAula, unknown, DadosAula>

/** Dia em que a aula libera: da preparação (1 a 7) ou dentro da etapa do tema. */
export function Liberacao({
  register,
  erroDia,
  preparacao,
}: {
  register: UseFormRegister<EntradaAula>
  erroDia?: string
  preparacao: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <Campo
        rotulo={preparacao ? t.campoDiaPreparacao : t.campoDiaEtapa}
        type="number"
        min={1}
        max={preparacao ? 7 : undefined}
        inputMode="numeric"
        erro={erroDia}
        {...register('dia')}
      />
      <span className="text-xs text-suave">{preparacao ? t.ajudaPreparacao : t.ajudaEtapa}</span>
    </div>
  )
}

function Previa({ control }: { control: Controle }) {
  return <PreviaVideo link={useWatch({ control, name: 'video_url' }) ?? ''} />
}

/** Profissional e duração (as duas colunas da janela). */
export function QuemEQuanto({
  register,
  erro,
}: {
  register: UseFormRegister<EntradaAula>
  erro?: string
}) {
  return (
    <>
      <Campo
        rotulo={t.campoProfissional}
        placeholder={t.exemploProfissional}
        {...register('profissional')}
      />
      <Campo
        rotulo={t.campoDuracao}
        type="number"
        min={1}
        inputMode="numeric"
        erro={erro}
        {...register('duracao')}
      />
    </>
  )
}

/** Título, link do vídeo com ajuda e a prévia grande. */
export function TituloEVideo({
  register,
  control,
  erros,
}: {
  register: UseFormRegister<EntradaAula>
  control: Controle
  erros: FieldErrors<EntradaAula>
}) {
  return (
    <>
      <div className="sm:col-span-2">
        <Campo rotulo={t.campoTitulo} erro={erros.titulo?.message} {...register('titulo')} />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <Campo
          rotulo={t.campoVideo}
          placeholder={t.exemploVideo}
          inputMode="url"
          erro={erros.video_url?.message}
          {...register('video_url')}
        />
        <span className="text-xs text-suave">{t.ajudaVideo}</span>
      </div>
      <div className="sm:col-span-2">
        <Previa control={control} />
      </div>
    </>
  )
}

/** Descrição num editor simples: negrito, itálico, lista e link. */
export function Descricao({ control }: { control: Controle }) {
  return (
    <div className="sm:col-span-2">
      <Controller
        control={control}
        name="descricao"
        render={({ field }) => (
          <EditorTexto
            completo
            rotulo={t.campoDescricao}
            valor={field.value}
            aoMudar={field.onChange}
          />
        )}
      />
    </div>
  )
}
