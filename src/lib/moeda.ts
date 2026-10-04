/** Formata centavos (int) em reais. 19700 vira "R$ 197,00". */
export function formatarCentavos(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    centavos / 100,
  )
}

/** Para vitrine: tira o ",00" de valores redondos. 199700 vira "R$ 1.997". */
export function formatarPreco(centavos: number): string {
  const texto = formatarCentavos(centavos)
  return centavos % 100 === 0 ? texto.replace(/,00$/, '') : texto
}
