import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Plano } from '@/domain/precos'
import { irPara } from '@/lib/navegacao'
import { mascararTelefone } from '@/lib/telefone'
import { linkPagamento } from '../api/pagamento'
import { registrarLead } from '../api/registrarLead'
import { esquemaCompra, type Compra, type EntradaCompra } from '../schemas/compra'

/** Grava o lead (sem travar a venda) e leva para o link do Mercado Pago do plano escolhido. */
export function useCompraForm(planoInicial: Plano) {
  const [semLink, setSemLink] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const form = useForm<EntradaCompra, unknown, Compra>({
    resolver: zodResolver(esquemaCompra),
    defaultValues: { plano: planoInicial, nome: '', email: '', whatsapp: '', site: '' },
  })

  const enviar = form.handleSubmit(async (dados) => {
    setSemLink(false)
    await registrarLead(dados)
    const link = linkPagamento(dados.plano)
    if (!link) return setSemLink(true)
    setSaindo(true)
    irPara(link)
  })

  const whatsapp = form.register('whatsapp', {
    onChange: (ev: { target: { value: string } }) =>
      form.setValue('whatsapp', mascararTelefone(ev.target.value)),
  })

  const ocupado = form.formState.isSubmitting || saindo
  return { form, enviar, whatsapp, semLink, ocupado }
}
