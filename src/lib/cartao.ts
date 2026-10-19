import { soDigitos } from './telefone'

/** Máscara do número do cartão enquanto digita: grupos de 4, até 19 dígitos. */
export const mascararCartao = (v: string) =>
  soDigitos(v)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

/** Validade no formato MM/AA. */
export function mascararValidade(v: string): string {
  const d = soDigitos(v).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export function mascararCep(v: string): string {
  const d = soDigitos(v).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export const mascararCvv = (v: string) => soDigitos(v).slice(0, 4)

/** Número de cartão com 13 a 19 dígitos que passa no dígito verificador (Luhn). */
export function cartaoValido(v: string): boolean {
  const d = soDigitos(v)
  if (d.length < 13 || d.length > 19) return false
  let soma = 0
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i])
    if (i % 2 === 1) n = n * 2 > 9 ? n * 2 - 9 : n * 2
    soma += n
  }
  return soma % 10 === 0
}

/** "08/29" vira { mes: 8, ano: 2029 }; formato errado devolve null. */
export function lerValidade(v: string): { mes: number; ano: number } | null {
  const m = /^(\d{2})\/(\d{2})$/.exec(v.trim())
  if (!m) return null
  const mes = Number(m[1])
  return mes >= 1 && mes <= 12 ? { mes, ano: 2000 + Number(m[2]) } : null
}

/** Validade que ainda não passou (vale até o fim do mês). */
export function validadeValida(v: string, agora = new Date()): boolean {
  const l = lerValidade(v)
  if (!l) return false
  return l.ano * 12 + l.mes >= agora.getFullYear() * 12 + agora.getMonth() + 1
}
