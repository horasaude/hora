import { useEffect, type ReactNode } from 'react'
import { useWatch, type Control, type UseFormRegister, type UseFormSetValue } from 'react-hook-form'
import type { Etapa, Tema } from '../api/conteudo.api'
import { textos } from '../textos'
import type { DadosAula, EntradaAula } from './FormAula'

const c = textos.conteudo
const campo =
  'min-h-12 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none'

function Escolha({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string
  rotulo: string
  erro?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      {children}
      {erro && <span className="text-terracota-escuro">{erro}</span>}
    </div>
  )
}

type Props = {
  temas: Tema[]
  etapas: Etapa[]
  register: UseFormRegister<EntradaAula>
  control: Control<EntradaAula, unknown, DadosAula>
  setValue: UseFormSetValue<EntradaAula>
  erros: { tema?: string; etapa?: string }
}

/** "Onde fica a aula": tema (Preparação ou um tema) e etapa; na Preparação a etapa é a única dela e some. */
export function OndeFica({ temas, etapas, register, control, setValue, erros }: Props) {
  const tema = useWatch({ control, name: 'tema' })
  const etapa = useWatch({ control, name: 'etapa' })
  const doTema = etapas.filter((e) => e.tema_id === tema)
  const preparacao = temas.find((t) => t.id === tema)?.tipo === 'preparacao'
  useEffect(() => {
    if (!tema) return
    if (preparacao && doTema[0] && etapa !== doTema[0].id) setValue('etapa', doTema[0].id)
    else if (etapa && !doTema.some((e) => e.id === etapa)) setValue('etapa', '')
  }, [tema, etapa, preparacao, doTema, setValue])
  return (
    <fieldset className="grid gap-4 rounded-2xl border border-linha bg-[#FAFBFA] p-4 sm:col-span-2 sm:grid-cols-2">
      <legend className="px-1 text-sm font-bold text-verde-escuro">{c.onde}</legend>
      <Escolha id="aula-tema" rotulo={c.campoTema} erro={erros.tema}>
        <select id="aula-tema" className={campo} {...register('tema')}>
          <option value="">{c.escolhaTema}</option>
          {temas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.titulo}
            </option>
          ))}
        </select>
      </Escolha>
      {tema && !preparacao && (
        <Escolha id="aula-etapa" rotulo={c.campoEtapa} erro={erros.etapa}>
          <select id="aula-etapa" className={campo} {...register('etapa')}>
            <option value="">{c.escolhaEtapa}</option>
            {doTema.map((e) => (
              <option key={e.id} value={e.id}>
                {e.titulo}
              </option>
            ))}
          </select>
          {doTema.length === 0 && <span className="text-xs text-suave">{c.semEtapas}</span>}
        </Escolha>
      )}
    </fieldset>
  )
}
