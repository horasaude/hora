import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { BotaoBrilho, Campo } from '@/components/ui'
import type { esquemaAlimento, EntradaAlimento } from '../schemas/plano'
import { GRUPOS_TACO, tAlimentos as t, textos } from '../textos'

export type FormAlimento = UseFormReturn<
  EntradaAlimento,
  unknown,
  ReturnType<typeof esquemaAlimento.parse>
>
const NUTRIENTES = ['kcal', 'proteina', 'carboidrato', 'gordura', 'fibra'] as const
const legenda = 'mb-2 text-[11px] font-bold tracking-[0.08em] text-[#8A9692] uppercase'

/** Nome e grupo lado a lado. */
export function CamposBase({ form, id }: { form: FormAlimento; id: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Campo
        rotulo={t.campoNome}
        erro={form.formState.errors.nome?.message}
        {...form.register('nome')}
      />
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor={`${id}-grupo`} className="font-medium">
          {t.campoGrupo}
        </label>
        <select
          id={`${id}-grupo`}
          className="min-h-12 rounded-xl border border-linha bg-white px-4"
          {...form.register('grupo')}
        >
          <option value="" />
          {GRUPOS_TACO.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

/** Valores por 100 g, cinco lado a lado no computador. */
export function CamposNutrientes({ form }: { form: FormAlimento }) {
  return (
    <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <legend className={legenda}>{t.por100}</legend>
      {NUTRIENTES.map((n) => (
        <Campo
          key={n}
          rotulo={n === 'kcal' ? 'kcal' : `${textos.macros[n]} (g)`}
          inputMode="decimal"
          erro={form.formState.errors[n]?.message}
          {...form.register(n)}
        />
      ))}
    </fieldset>
  )
}

/** Medidas caseiras: nome e gramas, quantas quiser. */
export function CamposMedidas({ form }: { form: FormAlimento }) {
  const medidas = useFieldArray({ control: form.control, name: 'medidas' })
  const erros = form.formState.errors.medidas
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className={legenda}>{t.medidas}</legend>
      {medidas.fields.map((m, i) => (
        <div key={m.id} className="grid grid-cols-[1fr_7rem_auto] items-end gap-3">
          <Campo
            rotulo={t.medidaNome}
            placeholder={t.medidaExemplo}
            erro={erros?.[i]?.nome?.message}
            {...form.register(`medidas.${i}.nome`)}
          />
          <Campo
            rotulo={t.medidaGramas}
            inputMode="decimal"
            erro={erros?.[i]?.gramas?.message}
            {...form.register(`medidas.${i}.gramas`)}
          />
          <button
            type="button"
            aria-label={t.removerMedida(i + 1)}
            onClick={() => medidas.remove(i)}
            className="mb-1 grid size-10 place-items-center rounded-full text-terracota-escuro hover:bg-trilho"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-4">
              <path
                d="m4 4 8 8m0-8-8 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ))}
      <BotaoBrilho
        tom="dourado"
        className="self-start"
        onClick={() => medidas.append({ nome: '', gramas: '' })}
      >
        + {t.novaMedida}
      </BotaoBrilho>
    </fieldset>
  )
}
