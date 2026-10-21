import { Campo } from '@/components/ui'
import type { FormCardapio, Modelo } from '../cardapioForm'
import { useTemas } from '../../hooks/usePainel'
import { SUGESTOES_OBJETIVO, tCardapios as t } from '../textos2'
import { Bloco } from './BarraTopo'

type Props = { f: FormCardapio; mudar: (p: Partial<FormCardapio>) => void; erroNome: boolean }

/** Tema do plano; o objetivo que era só o nome do tema antigo é limpo ao trocar de tema. */
function CampoTema({ f, mudar }: Omit<Props, 'erroNome'>) {
  const temas = useTemas().data ?? []
  const nomeDoTema = (id: string) => temas.find((x) => x.id === id)?.titulo ?? ''
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{t.campoTema}</span>
      <select
        className="min-h-12 rounded-xl border border-linha bg-white px-4"
        value={f.tema_id}
        onChange={(e) =>
          mudar({
            tema_id: e.target.value,
            objetivo: f.objetivo === nomeDoTema(f.tema_id) ? '' : f.objetivo,
          })
        }
      >
        <option value="">{t.escolhaTema}</option>
        {temas.map((x) => (
          <option key={x.id} value={x.id}>
            {x.titulo}
          </option>
        ))}
      </select>
    </label>
  )
}

function CampoModelo({ f, mudar }: Omit<Props, 'erroNome'>) {
  return (
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
  )
}

/** Nome, tema e objetivo do plano lado a lado (o tema pode ter vários planos), e o modelo do plano. */
export function CardapioCampos({ f, mudar, erroNome }: Props) {
  return (
    <Bloco>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Campo
          id="cardapio-nome"
          rotulo={t.campoNome}
          value={f.titulo}
          onChange={(e) => mudar({ titulo: e.target.value })}
          erro={erroNome ? t.campoNome : undefined}
        />
        <CampoTema f={f} mudar={mudar} />
        <Campo
          id="cardapio-objetivo"
          rotulo={t.campoObjetivo}
          placeholder={t.exemploObjetivo}
          list="cardapio-objetivos"
          maxLength={80}
          value={f.objetivo}
          onChange={(e) => mudar({ objetivo: e.target.value })}
        />
        <datalist id="cardapio-objetivos">
          {SUGESTOES_OBJETIVO.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </div>
      <CampoModelo f={f} mudar={mudar} />
    </Bloco>
  )
}
