import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { salvarInscricao } from '@/features/checkout'
import type { Plano } from '@/domain/precos'
import { irPara } from '@/lib/navegacao'
import { mascararTelefone } from '@/lib/telefone'
import { registrarLead } from '../api/registrarLead'
import { esquemaCompra, type Compra, type EntradaCompra } from '../schemas/compra'

/** Grava o lead (sem travar a venda) e leva ao checkout já com os dados preenchidos. */
export function useCompraForm(planoInicial: Plano) {
  const [saindo, setSaindo] = useState(false)
  const form = useForm<EntradaCompra, unknown, Compra>({
    resolver: zodResolver(esquemaCompra),
    defaultValues: { plano: planoInicial, nome: '', email: '', whatsapp: '', site: '' },
  })

  const enviar = form.handleSubmit(async (dados) => {
    await registrarLead(dados)
    const { plano, nome, email, whatsapp } = dados
    salvarInscricao({ plano, nome, email, whatsapp })
    setSaindo(true)
    irPara('/checkout')
  })

  const whatsapp = form.register('whatsapp', {
    onChange: (ev: { target: { value: string } }) =>
      form.setValue('whatsapp', mascararTelefone(ev.target.value)),
  })

  const ocupado = form.formState.isSubmitting || saindo
  return { form, enviar, whatsapp, ocupado }
}
