// Seção "Por dentro do app" (protótipo na página). Dados de exemplo, só para mostrar como funciona.
// Peso e medidas nunca aparecem no ranking.

export const app = {
  etiqueta: 'Por dentro do app',
  cta: 'Quero meu acesso ao app',
  titulo: 'Tudo na palma da *mão*',
  texto:
    'Em cinco segundos você sabe o que fazer hoje. Cada hábito cumprido vira ponto, e as três acompanham você de perto.',
  dica: 'Toque nas telas',
  abas: [
    {
      id: 'hoje',
      nome: 'Hoje',
      explica:
        'Hábitos do dia, desafio da semana e a próxima live, com um toque para marcar como feito.',
    },
    {
      id: 'plano',
      nome: 'Plano',
      explica: 'Cardápio da nutricionista com substituições e treinos para casa ou academia.',
    },
    {
      id: 'desafios',
      nome: 'Desafios',
      explica: 'Um desafio por semana. Cada dia cumprido aparece na sua sequência.',
    },
    {
      id: 'ranking',
      nome: 'Ranking',
      explica: 'Pontos por hábito, nunca por peso. Quem se dedica sobe de nível e é premiada.',
    },
    {
      id: 'eu',
      nome: 'Eu',
      explica: 'Sua constância, suas conquistas e o check-in da semana com energia, sono e fome.',
    },
  ],
  selos: [
    { pts: '+10', texto: 'Treino feito', sub: 'Hábito do dia' },
    { pts: '+5', texto: 'Meta de água', sub: '2 litros' },
    { pts: '4/7', texto: 'Prato consciente', sub: 'Desafio da semana' },
    { pts: '#3', texto: 'No ranking', sub: 'Nível Constante' },
  ],
  hoje: {
    ola: 'Oi, Maria',
    dia: 'Dia 12 · Semana 2',
    live: {
      rotulo: 'Próxima live',
      tema: 'Mais energia no dia a dia',
      quando: 'Quinta, 19h · Dra. Clara',
      botao: 'Lembrar de mim',
    },
    habitosTitulo: 'Hábitos de hoje',
    habitos: [
      { cor: 'terracota' as const, nome: 'Treino do dia', pts: 10, feito: false },
      { cor: 'salvia' as const, nome: 'Meta de água: 2 litros', pts: 5, feito: true },
      { cor: 'ocre' as const, nome: 'Aula da semana', pts: 5, feito: false },
      { cor: 'ora' as const, nome: 'Foto do almoço', pts: 5, feito: false },
    ],
    pontos: 'pts',
  },
  plano: {
    abas: ['Cardápio', 'Treino'],
    refeicoes: [
      {
        hora: '07h30',
        nome: 'Café da manhã',
        itens: '2 ovos, 1 fatia de pão integral e 1 fruta',
        troca: 'ou iogurte natural com aveia',
      },
      {
        hora: '12h30',
        nome: 'Almoço',
        itens: 'Frango grelhado, arroz, feijão e salada à vontade',
        troca: 'ou peixe na mesma porção',
      },
      {
        hora: '16h00',
        nome: 'Lanche',
        itens: 'Iogurte natural com pasta de amendoim',
        troca: 'ou 1 fruta com queijo branco',
      },
    ],
    treino: [
      { nome: 'Agachamento', detalhe: '3 x 12' },
      { nome: 'Elevação de quadril', detalhe: '3 x 15' },
      { nome: 'Prancha', detalhe: '3 x 30 s' },
    ],
    treinoTitulo: 'Treino em casa · 25 min',
  },
  desafios: {
    titulo: 'Prato consciente',
    sub: 'Metade do prato com vegetais',
    dias: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
    feitos: 4,
    proximos: ['Água antes do café', 'Caminhada de 20 minutos', 'Dormir antes das 23h'],
  },
  ranking: {
    titulo: 'Ranking do mês',
    podio: [
      { nome: 'Marina', pts: 410 },
      { nome: 'Juliana', pts: 385 },
      { nome: 'Patrícia', pts: 352 },
    ],
    voce: { nome: 'Você', pts: 340, pos: 4 },
    nivel: 'Nível Constante',
  },
  eu: {
    titulo: 'Sua constância',
    numeros: [
      { valor: '12', rotulo: 'dias seguidos' },
      { valor: '9', rotulo: 'treinos' },
      { valor: '3', rotulo: 'lives' },
    ],
    checkin: 'Check-in da semana',
    medidores: [
      { nome: 'Energia', valor: 80 },
      { nome: 'Sono', valor: 65 },
      { nome: 'Fome', valor: 40 },
    ],
  },
  barra: { botao: 'Ver planos' },
}
