import { useEffect, useState } from 'react'
import { descontoOferta, precosVigentes } from '@/domain/precos'
import { useConfiguracao } from '@/features/configuracao'
import { iniciarRevelar } from '@/lib/revelar'
import { Banner } from '../components/Banner'
import { DadosPessoais } from '../components/DadosPessoais'
import { Lateral } from '../components/Lateral'
import { Pagamento } from '../components/Pagamento'
import { PixGerado } from '../components/PixGerado'
import { Resumo } from '../components/Resumo'
import { valorDoPlano } from '../components/valores'
import { useCheckout } from '../hooks/useCheckout'
import { useFinalizar } from '../hooks/useFinalizar'
import { textos } from '../textos'

/** Checkout próprio, no formato do Hotmart: resumo, dados, pagamento e lateral de confiança. */
export function CheckoutPage() {
  const config = useConfiguracao()
  const [agora] = useState(() => new Date())
  const precos = precosVigentes(agora, config)
  const { form, cpf, whatsapp } = useCheckout()
  const plano = form.watch('plano')
  const { finalizar, enviando, erro, resultado, recomecar } = useFinalizar(plano)
  useEffect(() => iniciarRevelar(), [])
  return (
    <main className="min-h-dvh bg-creme px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Banner emOferta={precos.emOferta} desconto={descontoOferta(config)} />
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <form
            data-revelar
            onSubmit={form.handleSubmit(finalizar)}
            noValidate
            className="flex flex-col gap-8 rounded-[1.75rem] border border-ora/10 bg-[#fbfaf7] p-6 sm:p-8"
          >
            <Resumo precos={precos} plano={plano} campo={form.register('plano')} />
            <DadosPessoais
              register={form.register}
              erros={form.formState.errors}
              cpf={cpf}
              whatsapp={whatsapp}
            />
            {resultado && (
              <PixGerado pedido={resultado.pedido} pix={resultado.pix} aoGerarOutro={recomecar} />
            )}
            {!resultado && (
              <Pagamento
                plano={plano}
                valor={valorDoPlano(precos, plano)}
                enviando={enviando}
                erro={erro}
              />
            )}
          </form>
          <Lateral />
        </div>
        <a
          href="/"
          className="inline-flex min-h-11 items-center self-center text-sm text-suave underline underline-offset-4"
        >
          {textos.voltar}
        </a>
      </div>
    </main>
  )
}
