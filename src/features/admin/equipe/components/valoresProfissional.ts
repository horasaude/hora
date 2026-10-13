// Valores do formulário de profissional e as validações simples.
import { ESPECIALIDADES, type Especialidade } from '@/domain/forum'

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const ehEsp = (v: string): v is Especialidade => v in ESPECIALIDADES
export type Valores = {
  nome: string
  email: string
  senha: string
  especialidade: Especialidade | null
  titulo: string
}
