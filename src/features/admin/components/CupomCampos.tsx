import { Campo } from '@/components/ui'
import { PLANOS, type Plano } from '@/domain/precos'
import type { ErrosCupom, FormCupom } from '../schemas/cupomForm'
import { cupons as t } from '../textos/cupons'
import { CampoDinheiro } from './CampoDinheiro'

type Props = {
  f: FormCupom
  erros: ErrosCupom
  mudar: (parte: Partial<FormCupom>) => void
}

const pilula =
  'flex min-h-9 cursor-pointer items-center gap-2 rounded-full border border-[#ECEFED] px-4 text-[13px] font-semibold has-checked:border-verde-escuro has-checked:bg-trilho'

function Grupo({
  titulo,
  erro,
  children,
}: {
  titulo: string
  erro?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="flex flex-col gap-2 text-sm">
      <legend className="mb-1 font-medium">{titulo}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {erro && <span className="text-terracota-escuro">{erro}</span>}
    </fieldset>
  )
}

/** Tipo e tamanho do desconto. */
export function CamposDesconto({ f, erros, mudar }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Grupo titulo={t.tipo}>
        {(['porcentagem', 'valor'] as const).map((tipo) => (
          <label key={tipo} className={pilula}>
            <input
              type="radio"
              name="tipo"
              className="accent-ora"
              checked={f.tipo === tipo}
              onChange={() => mudar({ tipo })}
            />
            {t[tipo]}
          </label>
        ))}
      </Grupo>
      {f.tipo === 'porcentagem' ? (
        <Campo
          rotulo={t.quantoPorcento}
          name="porcentagem"
          inputMode="numeric"
          value={f.porcentagem}
          onChange={(e) => mudar({ porcentagem: e.target.value.replace(/\D/g, '').slice(0, 2) })}
          erro={erros.valor}
        />
      ) : (
        <CampoDinheiro
          rotulo={t.quantoReais}
          valor={f.centavos}
          aoMudar={(centavos) => mudar({ centavos })}
          erro={erros.valor}
        />
      )}
    </div>
  )
}

/** Formas de pagamento em que o cupom vale. */
export function CamposPlanos({ f, erros, mudar }: Props) {
  const alternar = (p: Plano) =>
    mudar({
      planos: PLANOS.filter((x) => (x === p ? !f.planos.includes(p) : f.planos.includes(x))),
    })
  return (
    <Grupo titulo={t.planos} erro={erros.planos}>
      {PLANOS.map((p) => (
        <label key={p} className={pilula}>
          <input
            type="checkbox"
            className="accent-ora"
            checked={f.planos.includes(p)}
            onChange={() => alternar(p)}
          />
          {t.nomesPlanos[p]}
        </label>
      ))}
    </Grupo>
  )
}

/** Limite de usos, prazo e ligado. */
export function CamposLimites({ f, erros, mudar }: Props) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          rotulo={t.limite}
          name="limite"
          inputMode="numeric"
          placeholder={t.limiteDica}
          value={f.limite}
          onChange={(e) => mudar({ limite: e.target.value.replace(/\D/g, '').slice(0, 7) })}
          erro={erros.limite}
        />
        <Campo
          rotulo={t.validoAte}
          name="valido_ate"
          type="datetime-local"
          value={f.validoAte}
          onChange={(e) => mudar({ validoAte: e.target.value })}
          erro={erros.data}
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          className="size-5 accent-ora"
          checked={f.ativo}
          onChange={(e) => mudar({ ativo: e.target.checked })}
        />
        {t.ativo}
      </label>
    </>
  )
}
