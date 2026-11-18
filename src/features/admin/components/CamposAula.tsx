import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { Campo } from '@/components/ui'
import {
  PROFISSIONAIS,
  nomesDasProfissionais,
  profissionaisDoTexto,
  type Profissional,
} from '@/domain/lives'
import { EditorTexto } from '../plano/components/EditorTexto'
import { textos } from '../textos'
import type { DadosAula, EntradaAula } from './FormAula'
import { PreviaVideo } from './PreviaVideo'

const t = textos.aulas
type Controle = Control<EntradaAula, unknown, DadosAula>

function Previa({ control }: { control: Controle }) {
  return <PreviaVideo link={useWatch({ control, name: 'video_url' }) ?? ''} />
}

const TODAS = Object.keys(PROFISSIONAIS) as Profissional[]

/** Uma ou mais profissionais da aula; o que vai para a aluna são os nomes, na ordem fixa. */
function QuemDaAula({ valor, aoMudar }: { valor: string; aoMudar: (v: string) => void }) {
  const marcadas = profissionaisDoTexto(valor)
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="mb-1 text-sm font-medium">{t.campoProfissional}</legend>
      <div className="flex min-h-12 flex-wrap items-center gap-x-5 gap-y-1">
        {TODAS.map((p) => (
          <label key={p} className="flex min-h-10 items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-5 accent-ora"
              checked={marcadas.includes(p)}
              onChange={(e) =>
                aoMudar(
                  nomesDasProfissionais(
                    TODAS.filter((q) => (q === p ? e.target.checked : marcadas.includes(q))),
                  ),
                )
              }
            />
            {PROFISSIONAIS[p].nome}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Profissionais (marcar uma ou mais) e duração (as duas colunas da janela). */
export function QuemEQuanto({
  register,
  control,
  erro,
}: {
  register: UseFormRegister<EntradaAula>
  control: Controle
  erro?: string
}) {
  return (
    <>
      <Controller
        control={control}
        name="profissional"
        render={({ field }) => <QuemDaAula valor={field.value} aoMudar={field.onChange} />}
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
