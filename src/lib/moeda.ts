/** Formata centavos (int) em reais. 19700 vira "R$ 197,00". */
export function formatarCentavos(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    centavos / 100,
  )
}
