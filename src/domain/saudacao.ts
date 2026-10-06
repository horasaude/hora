/** Saudação pela hora de Brasília (0 a 23): manhã a partir das 5h, tarde a partir das 12h, noite a partir das 18h. */
export function saudacaoPorHora(hora: number): 'Bom dia' | 'Boa tarde' | 'Boa noite' {
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}
