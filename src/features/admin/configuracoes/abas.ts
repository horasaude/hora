export const ABAS_CONFIG = ['planos', 'cupons', 'parceiras', 'equipe', 'documentos'] as const
export type AbaConfig = (typeof ABAS_CONFIG)[number]

const base = '/app/admin/configuracoes'
export const caminhoAba = (a: AbaConfig) => (a === 'planos' ? base : `${base}/${a}`)
