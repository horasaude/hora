import { Campo } from '@/components/ui'
import { t } from '../textos'

export type Valores = { nome: string; pontos: string; tipo: string; qtd: string; ativo: boolean }

function Limite({
  v,
  mudar,
  propria,
}: {
  v: Valores
  mudar: (p: Partial<Valores>) => void
  propria: boolean
}) {
  const tipos = propria ? t.regras.tiposPropria : t.regras.tipos
  return (
    <>
      <Campo
        rotulo={t.regras.pontos}
        type="number"
        min={0}
        value={v.pontos}
        onChange={(e) => mudar({ pontos: e.target.value })}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{t.regras.limiteTipo}</span>
        <select
          className="min-h-12 rounded-xl border border-linha bg-white px-4"
          value={v.tipo}
          onChange={(e) => mudar({ tipo: e.target.value })}
        >
          {Object.entries(tipos).map(([valor, n]) => (
            <option key={valor} value={valor}>
              {n}
            </option>
          ))}
        </select>
      </label>
      {v.tipo === 'por_dia' && (
        <Campo
          rotulo={t.regras.qtd}
          type="number"
          min={1}
          max={50}
          value={v.qtd}
          onChange={(e) => mudar({ qtd: e.target.value })}
        />
      )}
    </>
  )
}

export function Campos({
  v,
  mudar,
  propria,
  nova,
}: {
  v: Valores
  mudar: (p: Partial<Valores>) => void
  propria: boolean
  nova: boolean
}) {
  return (
    <>
      {propria && (
        <div className="sm:col-span-3">
          <Campo
            rotulo={t.regras.nome}
            maxLength={80}
            value={v.nome}
            onChange={(e) => mudar({ nome: e.target.value })}
          />
        </div>
      )}
      <Limite v={v} mudar={mudar} propria={propria} />
      {!nova && (
        <label className="flex items-center gap-3 text-sm font-medium sm:col-span-3">
          <input
            type="checkbox"
            className="size-5 accent-ora"
            checked={v.ativo}
            onChange={(e) => mudar({ ativo: e.target.checked })}
          />
          {t.regras.ativa(v.nome)}
        </label>
      )}
    </>
  )
}
