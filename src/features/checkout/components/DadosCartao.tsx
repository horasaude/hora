import type { FieldErrors, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'
import { Campo } from '@/components/ui'
import { formatarCentavos } from '@/lib/moeda'
import type { DadosCheckout, EntradaCheckout } from '../schemas/checkout'
import { textos } from '../textos'

export type CamposCartao = Record<'numero' | 'validade' | 'cvv' | 'cep', UseFormRegisterReturn>

type Props = {
  register: UseFormRegister<EntradaCheckout>
  erros: FieldErrors<DadosCheckout>
  campos: CamposCartao
  /** Só no parcelado: total para mostrar de 1x a 12x. */
  totalCentavos?: number
}

const t = textos.pagamento.cartao

function Parcelas({ register, total }: { register: Props['register']; total: number }) {
  const opcoes = Array.from({ length: 12 }, (_, i) => 12 - i)
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor="parcelas" className="font-medium">
        {t.parcelas}
      </label>
      <select
        id="parcelas"
        className="min-h-12 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none"
        {...register('parcelas')}
      >
        {opcoes.map((n) => (
          <option key={n} value={n}>
            {t.parcela(n, formatarCentavos(Math.round(total / n)))}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Cartão digitado aqui mesmo; segue direto para o Asaas e não fica guardado no ORA. */
export function DadosCartao({ register, erros, campos, totalCentavos }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <Campo
        rotulo={t.numero.rotulo}
        placeholder={t.numero.exemplo}
        inputMode="numeric"
        autoComplete="cc-number"
        erro={erros.numeroCartao?.message}
        {...campos.numero}
      />
      <Campo
        rotulo={t.titular.rotulo}
        placeholder={t.titular.exemplo}
        autoComplete="cc-name"
        erro={erros.nomeCartao?.message}
        {...register('nomeCartao')}
      />
      <div className="grid grid-cols-2 gap-3">
        <Campo
          rotulo={t.validade.rotulo}
          placeholder={t.validade.exemplo}
          inputMode="numeric"
          autoComplete="cc-exp"
          erro={erros.validade?.message}
          {...campos.validade}
        />
        <Campo
          rotulo={t.cvv.rotulo}
          placeholder={t.cvv.exemplo}
          inputMode="numeric"
          autoComplete="cc-csc"
          erro={erros.cvv?.message}
          {...campos.cvv}
        />
        <Campo
          rotulo={t.cep.rotulo}
          placeholder={t.cep.exemplo}
          inputMode="numeric"
          autoComplete="postal-code"
          erro={erros.cep?.message}
          {...campos.cep}
        />
        <Campo
          rotulo={t.casa.rotulo}
          placeholder={t.casa.exemplo}
          erro={erros.numeroCasa?.message}
          {...register('numeroCasa')}
        />
      </div>
      {totalCentavos !== undefined && <Parcelas register={register} total={totalCentavos} />}
    </div>
  )
}
