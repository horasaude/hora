import { useState } from 'react'
import type { Cupom } from '@/domain/cupom'
import { consultarCupom } from '../api/cupom.api'

export type EstadoCupom = 'parado' | 'buscando' | 'invalido' | 'falha'

export const limparCodigo = (v: string) =>
  v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 20)

/** Cupom do checkout. O link pode trazer ?cupom=CODIGO já digitado. */
export function useCupom() {
  const [codigo, setCodigo] = useState(() =>
    limparCodigo(new URLSearchParams(window.location.search).get('cupom') ?? ''),
  )
  const [aplicado, setAplicado] = useState<Cupom | null>(null)
  const [estado, setEstado] = useState<EstadoCupom>('parado')

  async function aplicar() {
    if (codigo.length < 3) return setEstado('invalido')
    setEstado('buscando')
    try {
      const c = await consultarCupom(codigo)
      setAplicado(c)
      setEstado(c ? 'parado' : 'invalido')
    } catch {
      setEstado('falha')
    }
  }

  const remover = () => {
    setAplicado(null)
    setCodigo('')
    setEstado('parado')
  }

  const digitar = (v: string) => {
    setCodigo(limparCodigo(v))
    if (estado !== 'buscando') setEstado('parado')
  }

  return { codigo, digitar, aplicado, estado, aplicar, remover }
}
