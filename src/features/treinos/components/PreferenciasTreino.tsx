import { Cartao } from '@/components/ui'
import { LOCAIS, NIVEIS } from '@/domain/treinos'
import { usePreferencias, useSalvarPreferencias } from '../hooks/useTreinos'
import { textos } from '../textos'

const t = textos.conta
const caixa =
  'min-h-11 rounded-xl border border-linha bg-white px-3 text-sm focus:border-ora focus:outline-none'

/** Minha conta: trocar nível e local dos treinos. */
export function PreferenciasTreino() {
  const prefs = usePreferencias()
  const salvar = useSalvarPreferencias()
  if (!prefs.data) return null
  const nivel = prefs.data.treino_nivel ?? 'iniciante'
  const local = prefs.data.treino_local ?? 'casa'
  const mudar = (d: { treino_nivel?: string; treino_local?: string }) =>
    salvar.mutate({ treino_nivel: d.treino_nivel ?? nivel, treino_local: d.treino_local ?? local })
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.nivel}
          <select
            value={nivel}
            onChange={(e) => mudar({ treino_nivel: e.target.value })}
            className={caixa}
          >
            {Object.entries(NIVEIS).map(([v, n]) => (
              <option key={v} value={v}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          {t.local}
          <select
            value={local}
            onChange={(e) => mudar({ treino_local: e.target.value })}
            className={caixa}
          >
            {Object.entries(LOCAIS).map(([v, n]) => (
              <option key={v} value={v}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      {salvar.isSuccess && (
        <p role="status" className="text-[13px] text-verde-vivo">
          {t.salvo}
        </p>
      )}
    </Cartao>
  )
}
