// Textos da Loja da aluna. Os componentes só leem daqui.

export const textos = {
  titulo: 'Loja',
  faixa: 'Descontos exclusivos para alunas ORA',
  todas: 'Todos',
  vazio: 'Nenhum produto nesta categoria por enquanto.',
  semLoja: 'Os produtos dos parceiros aparecem aqui em breve.',
  desconto: (pct: number) => `${pct}% OFF`,
  abrir: (nome: string) => `Ver produto: ${nome}`,
  de: 'De',
  por: 'Por',
  cupom: 'Cupom',
  copiar: 'Copiar cupom',
  copiado: 'Copiado!',
  comprar: 'Comprar com desconto',
  voltar: 'Voltar para a loja',
  naoEncontrado: 'Este produto não está mais disponível.',
  carregando: 'Carregando',
  erro: 'Não foi possível carregar. Tente de novo.',
  tentar: 'Tentar de novo',
}
