import { useEffect, useRef, useState } from 'react'
import type { Cupom } from '@/domain/cupom'
import type { Plano } from '@/domain/precos'
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

  // Cupom que veio no link (anúncio) já entra aplicado, sem a aluna clicar em Aplicar.
  const doLink = useRef(codigo)
  useEffect(() => {
    if (doLink.current.length >= 3) void aplicar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

/** Cupom que só vale numa forma de pagamento (ex.: BLACK87 no mensal) troca o plano para ela ao entrar. */
export function usePlanoDoCupom(
  aplicado: Cupom | null,
  plano: Plano,
  escolher: (p: Plano) => void,
) {
  const unico = aplicado?.planos.length === 1 ? aplicado.planos[0] : null
  useEffect(() => {
    if (unico && unico !== plano) escolher(unico)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unico])
}
