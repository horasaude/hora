export function soDigitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

/** Máscara enquanto digita: "98987654321" vira "(98) 98765-4321"; fixo fica "(98) 3234-5678". */
export function mascararTelefone(valor: string): string {
  const d = soDigitos(valor).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  const ddd = `(${d.slice(0, 2)}) `
  const resto = d.slice(2)
  const corte = d.length === 11 ? 5 : 4
  if (resto.length <= corte) return ddd + resto
  return `${ddd}${resto.slice(0, corte)}-${resto.slice(corte)}`
}
