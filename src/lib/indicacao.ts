// Código do link pessoal de indicação (/?ind=CODIGO). Fica guardado 30 dias neste navegador
// para ir junto do pedido; quem confere autoindicação e dá os pontos é o banco.

const ARMAZEM = 'ora:indicacao'
/** Chave usada antes da troca de nome; ainda lida para não perder indicação guardada. */
const ARMAZEM_ANTIGO = 'hora:indicacao'
const VALIDADE_MS = 30 * 86_400_000

/** Código válido: 4 a 16 letras e números, em maiúsculas. */
export function lerCodigoIndicacao(busca: string): string | null {
  const codigo = new URLSearchParams(busca).get('ind')?.trim().toUpperCase() ?? ''
  return /^[A-Z0-9]{4,16}$/.test(codigo) ? codigo : null
}

export function guardarIndicacao(busca: string, agora = Date.now()): void {
  const codigo = lerCodigoIndicacao(busca)
  if (!codigo) return
  try {
    localStorage.setItem(ARMAZEM, JSON.stringify({ codigo, ate: agora + VALIDADE_MS }))
  } catch {
    // armazenamento bloqueado: segue sem indicação
  }
}

export function indicacaoGuardada(agora = Date.now()): string | null {
  try {
    const salvo = JSON.parse(
      localStorage.getItem(ARMAZEM) ?? localStorage.getItem(ARMAZEM_ANTIGO) ?? 'null',
    ) as {
      codigo?: unknown
      ate?: unknown
    } | null
    if (
      !salvo ||
      typeof salvo.codigo !== 'string' ||
      typeof salvo.ate !== 'number' ||
      salvo.ate < agora
    )
      return null
    return salvo.codigo
  } catch {
    return null
  }
}
