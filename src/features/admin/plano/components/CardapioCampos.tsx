import { Campo } from '@/components/ui'
import type { FormCardapio, Modelo } from '../cardapioForm'
import { OBJETIVOS } from '../textos'
import { tCardapios as t } from '../textos2'
import { Bloco } from './BarraTopo'

type Props = { f: FormCardapio; mudar: (p: Partial<FormCardapio>) => void; erroNome: boolean }

/** Nome e objetivo lado a lado, e o modelo do plano (alimentos calculados ou texto livre). */
export function CardapioCampos({ f, mudar, erroNome }: Props) {
  return (
    <Bloco>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          rotulo={t.campoNome}
          value={f.titulo}
          onChange={(e) => mudar({ titulo: e.target.value })}
          erro={erroNome ? t.campoNome : undefined}
        />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.campoObjetivo}</span>
          <select
            className="min-h-12 rounded-xl border border-linha bg-white px-4"
            value={f.objetivo}
            onChange={(e) => mudar({ objetivo: e.target.value as FormCardapio['objetivo'] })}
          >
            {OBJETIVOS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">{t.campoModelo}</legend>
        <div className="flex flex-wrap gap-2">
          {(['calculado', 'texto'] as Modelo[]).map((m) => (
            <label
              key={m}
              className={`flex min-h-9 cursor-pointer items-center gap-2 rounded-full px-4 text-[13px] font-bold ${f.modelo === m ? 'brilho brilho-verde' : 'border border-[#ECEFED] bg-white text-suave'}`}
            >
              <input
                type="radio"
                name="modelo"
                value={m}
                checked={f.modelo === m}
                onChange={() => mudar({ modelo: m })}
                className="sr-only"
              />
              {t.modelos[m]}
            </label>
          ))}
        </div>
      </fieldset>
    </Bloco>
  )
}
