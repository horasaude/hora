import { useEffect, useState } from 'react'
import { precosVigentes } from '@/domain/precos'
import { iniciarRevelar } from '@/lib/revelar'
import { Banner } from '../components/Banner'
import { DadosPessoais } from '../components/DadosPessoais'
import { Lateral } from '../components/Lateral'
import { Pagamento } from '../components/Pagamento'
import { Resumo } from '../components/Resumo'
import { valorDoPlano } from '../components/valores'
import { useCheckout } from '../hooks/useCheckout'
import { textos } from '../textos'

/** Checkout próprio, no formato do Hotmart: resumo, dados, pagamento e lateral de confiança. */
export function CheckoutPage() {
  const [precos] = useState(() => precosVigentes(new Date()))
  const { form, enviar, cpf, whatsapp, aguardando } = useCheckout()
  const plano = form.watch('plano')
  useEffect(() => iniciarRevelar(), [])
  return (
    <main className="min-h-dvh bg-creme px-4 py-6 sm:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Banner emOferta={precos.emOferta} />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <form
            data-revelar
            onSubmit={enviar}
            noValidate
            className="flex flex-col gap-8 rounded-[1.75rem] border border-ora/10 bg-[#fbfaf7] p-5 sm:p-8"
          >
            <Resumo precos={precos} plano={plano} campo={form.register('plano')} />
            <DadosPessoais
              register={form.register}
              erros={form.formState.errors}
              cpf={cpf}
              whatsapp={whatsapp}
            />
            <Pagamento plano={plano} valor={valorDoPlano(precos, plano)} aguardando={aguardando} />
          </form>
          <Lateral />
        </div>
        <a href="/" className="self-center text-sm text-suave underline underline-offset-4">
          {textos.voltar}
        </a>
      </div>
    </main>
  )
}
