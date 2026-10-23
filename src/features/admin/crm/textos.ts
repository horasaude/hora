// Textos do CRM (Membros) no painel: painel com os números, alunas, financeiro e cancelamentos.

export const t = {
  menu: 'Membros',
  titulo: 'Membros',
  abas: {
    painel: 'Painel',
    alunas: 'Alunas',
    financeiro: 'Financeiro',
    cancelamentos: 'Cancelamentos',
  },
  alunas: 'Alunas',
  dinheiro: 'Financeiro',
  cartoes: {
    inscritas: 'Inscritas',
    fazendo: 'Fazendo o processo',
    atencao: 'Atenção (3 a 6 dias sem entrar)',
    paradas: 'Paradas (7 dias ou mais)',
    semAcesso: 'Sem acesso',
    valorMes: 'Vendido no mês',
    vendasMes: 'Vendas no mês',
    valor: 'Vendido no total',
    emAtraso: 'Mensalidade em atraso',
    pausadas: 'Pausadas por falta de pagamento',
    devolvidas: 'Estornadas ou canceladas',
  },
  paradasTitulo: 'Paradas há 7 dias ou mais',
  semParadas: 'Nenhuma aluna parada.',
  verTodas: 'Ver todas as alunas',
  financeiro: {
    titulo: 'Financeiro',
    colunas: ['Aluna', 'Forma', 'Valor', 'Aprovado em', 'Situação'],
    planos: { pix: 'Pix', parcelado: 'Parcelado', recorrente: 'Mensal' } as Record<string, string>,
    situacoes: {
      aprovado: 'Pago',
      reembolsado: 'Estornado',
      cancelado: 'Cancelado',
      chargeback: 'Contestado',
    } as Record<string, string>,
    porPlano: (pix: number, parc: number, rec: number) =>
      `Pix ${pix} · Parcelado ${parc} · Mensal ${rec}`,
    vazio: 'Nenhuma venda ainda.',
  },
}
