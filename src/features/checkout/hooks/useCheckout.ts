import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mascararCpf } from '@/lib/cpf'
import { mascararTelefone } from '@/lib/telefone'
import { lerInscricao, PLANO_PADRAO } from '../inscricao'
import { esquemaCheckout, type DadosCheckout, type EntradaCheckout } from '../schemas/checkout'

type Evento = { target: { value: string } }

/** Formulário do checkout, já preenchido com o que a pessoa digitou no popup. */
export function useCheckout() {
  const [inicial] = useState(lerInscricao)
  const form = useForm<EntradaCheckout, unknown, DadosCheckout>({
    resolver: zodResolver(esquemaCheckout),
    defaultValues: {
      plano: inicial?.plano ?? PLANO_PADRAO,
      email: inicial?.email ?? '',
      nome: inicial?.nome ?? '',
      cpf: '',
      whatsapp: mascararTelefone(inicial?.whatsapp ?? ''),
    },
  })

  const cpf = form.register('cpf', {
    onChange: (ev: Evento) => form.setValue('cpf', mascararCpf(ev.target.value)),
  })
  const whatsapp = form.register('whatsapp', {
    onChange: (ev: Evento) => form.setValue('whatsapp', mascararTelefone(ev.target.value)),
  })

  return { form, cpf, whatsapp }
}
