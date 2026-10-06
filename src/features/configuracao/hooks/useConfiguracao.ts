import { useSyncExternalStore } from 'react'
import { CONFIGURACAO_PADRAO, type Configuracao } from '@/domain/configuracao'
import { buscarConfiguracaoPublica, type ConfiguracaoPublica } from '../api/configuracao.api'

let atual: ConfiguracaoPublica | null = null
let pedido: Promise<void> | null = null
const ouvintes = new Set<() => void>()

function carregar() {
  pedido ??= buscarConfiguracaoPublica()
    .then((c) => {
      if (!c) return
      atual = c
      ouvintes.forEach((avisar) => avisar())
    })
    .catch(() => undefined)
}

function assinar(avisar: () => void) {
  ouvintes.add(avisar)
  carregar()
  return () => ouvintes.delete(avisar)
}

/** Configuração pública do banco; null até chegar (uma busca só por visita). */
export function useConfiguracaoPublica(): ConfiguracaoPublica | null {
  return useSyncExternalStore(
    assinar,
    () => atual,
    () => null,
  )
}

/** Preços e janela da oferta: os do banco, ou o padrão enquanto não chegam. */
export function useConfiguracao(): Configuracao {
  return useConfiguracaoPublica()?.config ?? CONFIGURACAO_PADRAO
}
