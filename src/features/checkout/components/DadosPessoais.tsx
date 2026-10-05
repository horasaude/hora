import type { FieldErrors, UseFormRegister, UseFormRegisterReturn } from 'react-hook-form'
import { Campo } from '@/components/ui'
import type { DadosCheckout, EntradaCheckout } from '../schemas/checkout'
import { textos } from '../textos'

type Props = {
  register: UseFormRegister<EntradaCheckout>
  erros: FieldErrors<DadosCheckout>
  cpf: UseFormRegisterReturn<'cpf'>
  whatsapp: UseFormRegisterReturn<'whatsapp'>
}

const t = textos.dados

export function DadosPessoais({ register, erros, cpf, whatsapp }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-ora">{t.titulo}</h2>
      <Campo
        rotulo={t.email.rotulo}
        placeholder={t.email.exemplo}
        type="email"
        autoComplete="email"
        erro={erros.email?.message}
        {...register('email')}
      />
      <Campo
        rotulo={t.nome.rotulo}
        placeholder={t.nome.exemplo}
        autoComplete="name"
        erro={erros.nome?.message}
        {...register('nome')}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo
          rotulo={t.cpf.rotulo}
          placeholder={t.cpf.exemplo}
          inputMode="numeric"
          erro={erros.cpf?.message}
          {...cpf}
        />
        <Campo
          rotulo={t.whatsapp.rotulo}
          placeholder={t.whatsapp.exemplo}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          erro={erros.whatsapp?.message}
          {...whatsapp}
        />
      </div>
    </section>
  )
}
