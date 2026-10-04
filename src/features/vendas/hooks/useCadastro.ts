import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Plano } from '@/domain/precos'
import { mascararTelefone } from '@/lib/telefone'
import { cadastrarInteressada } from '../api/cadastrarInteressada'
import { esquemaCadastro, type Cadastro, type EntradaCadastro } from '../schemas/cadastro'

/** Formulário de interessada. Ao gravar, devolve o plano escolhido para a próxima etapa. */
export function useCadastro(onCadastrado: (plano: Plano) => void) {
  const [falhou, setFalhou] = useState(false)
  const form = useForm<EntradaCadastro, unknown, Cadastro>({
    resolver: zodResolver(esquemaCadastro),
    defaultValues: { nome: '', email: '', whatsapp: '', site: '' },
  })

  const enviar = form.handleSubmit(async (dados) => {
    setFalhou(false)
    try {
      await cadastrarInteressada(dados)
      onCadastrado(dados.plano)
    } catch {
      setFalhou(true)
    }
  })

  const whatsapp = form.register('whatsapp', {
    onChange: (ev: { target: { value: string } }) =>
      form.setValue('whatsapp', mascararTelefone(ev.target.value)),
  })

  return { form, enviar, falhou, whatsapp }
}
