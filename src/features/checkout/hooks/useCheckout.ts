import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mascararCartao, mascararCep, mascararCvv, mascararValidade } from '@/lib/cartao'
import { mascararCpf } from '@/lib/cpf'
import { mascararTelefone } from '@/lib/telefone'
import { lerInscricao, PLANO_PADRAO } from '../inscricao'
import { esquemaCheckout, type DadosCheckout, type EntradaCheckout } from '../schemas/checkout'

type Evento = { target: { value: string } }
type Mascarado = 'cpf' | 'whatsapp' | 'numeroCartao' | 'validade' | 'cvv' | 'cep'

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
      parcelas: '12',
    },
  })

  /** Campo que se formata enquanto a pessoa digita. */
  const mascarado = <N extends Mascarado>(nome: N, mascara: (v: string) => string) =>
    form.register(nome, {
      onChange: (ev: Evento) => form.setValue(nome as Mascarado, mascara(ev.target.value)),
    })

  const cartao = {
    numero: mascarado('numeroCartao', mascararCartao),
    validade: mascarado('validade', mascararValidade),
    cvv: mascarado('cvv', mascararCvv),
    cep: mascarado('cep', mascararCep),
  }
  return {
    form,
    cpf: mascarado('cpf', mascararCpf),
    whatsapp: mascarado('whatsapp', mascararTelefone),
    cartao,
  }
}
