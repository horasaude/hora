// Textos do primeiro acesso. Os componentes só leem daqui.

export const textos = {
  continuar: 'Continuar',
  salvando: 'Salvando',
  passo: (n: number, total: number) => `Passo ${n} de ${total}`,
  boasVindas: {
    titulo: 'Boas-vindas à ORA',
    texto: 'Doze meses de cuidado com a Ana, a Dra. Clara e a Laís.',
  },
  apelido: {
    titulo: 'Como você quer aparecer no ranking?',
    campo: 'Apelido',
    exemplo: 'ex.: mari',
    nota: 'Só o apelido aparece. Peso e medidas nunca entram no ranking.',
    curto: 'Use de 2 a 20 caracteres',
    invalido: 'Use letras, números, ponto, traço ou sublinhado',
  },
  saude: {
    titulo: 'Seus dados de saúde',
    texto:
      'Check-ins, fotos e medidas que você registrar ficam com você e com a equipe da ORA, só para acompanhar a sua evolução.',
    aceite: 'Concordo com o uso dos meus dados de saúde para o meu acompanhamento na ORA.',
    politica: 'Ler a política de privacidade',
  },
  erro: 'Não foi possível salvar. Tente de novo.',
}
