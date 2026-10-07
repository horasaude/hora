import { soDigitos } from './telefone'

/** Link wa.me a partir do número com DDD (com ou sem 55). Número inválido ou vazio devolve null. */
export function linkWhatsApp(numero: string | undefined, mensagem?: string): string | null {
  const d = soDigitos(numero ?? '')
  const completo = d.length === 10 || d.length === 11 ? `55${d}` : d
  if (!/^55[0-9]{10,11}$/.test(completo)) return null
  return `https://wa.me/${completo}` + (mensagem ? `?text=${encodeURIComponent(mensagem)}` : '')
}

/** Link do WhatsApp só com a mensagem pronta: a pessoa escolhe para quem mandar. */
export function linkWhatsAppMensagem(mensagem: string): string {
  return `https://wa.me/?text=${encodeURIComponent(mensagem)}`
}
