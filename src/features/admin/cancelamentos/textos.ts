export const t = {
  titulo: 'Cancelamentos',
  cartoes: { total: 'Pedidos', estornados: 'Estornados em 7 dias', pendentes: 'Estorno pendente' },
  colunas: ['Aluna', 'Plano', 'Pediu em', 'Tipo', 'Motivo'],
  planos: { pix: 'Pix', parcelado: 'Parcelado', recorrente: 'Mensal' } as Record<string, string>,
  tipos: { estornado: 'Estornado', pendente: 'Estornar no Asaas', naoRenovar: 'Não renovar' },
  vazio: 'Nenhum pedido de cancelamento.',
}
