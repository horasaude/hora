// Textos do perfil. Os componentes só leem daqui.

export const textos = {
  chamadaIndicar: {
    titulo: 'Indique uma amiga',
    texto: 'Ela entra no ORA e você ganha pontos no ranking.',
    botao: 'Indicar',
  },
  titulo: 'Perfil',
  painel: 'Painel das profissionais',
  carregando: 'Carregando',
  erro: 'Não foi possível carregar.',
  erroSalvar: 'Não deu certo agora. Tente de novo.',
  tentar: 'Tentar de novo',
  cancelar: 'Cancelar',
  fechar: 'Fechar',
  salvar: 'Salvar',
  salvando: 'Salvando',
  apelidoInvalido:
    'Use só letras, números, ponto, traço ou sublinhado (sem emoji ou símbolos como ! e #).',
  apelidoTamanho: 'O apelido precisa ter de 2 a 20 caracteres.',
  apelidoEmUso: 'Esse apelido já está em uso. Escolha outro.',
  fotoDe: (nome: string) => `Foto de ${nome}`,
  dia: (dia: number, semana: number) => `Dia ${dia} · Semana ${semana}`,
  assinanteDesde: (mes: string) => `Assinante desde ${mes}`,
  resumo: {
    pontos: 'pontos no mês',
    peso: 'peso',
    cintura: 'cintura',
    variacao: (n: number | null, unidade: string) =>
      n === null ? '-' : `${n > 0 ? '+' : ''}${n.toLocaleString('pt-BR')} ${unidade}`,
    constancia: (seguidos: number, aulas: number, desafios: number) =>
      [
        seguidos === 1 ? '1 dia seguido' : `${seguidos} dias seguidos`,
        aulas === 1 ? '1 aula concluída' : `${aulas} aulas concluídas`,
        desafios === 1 ? '1 desafio completo' : `${desafios} desafios completos`,
      ].join(' · '),
  },
  secoes: { evolucao: 'Minha evolução', antesDepois: 'Antes e depois' },
  menu: {
    rotulo: 'Mais opções',
    avaliacoes: 'Avaliações',
    indique: 'Indique e ganhe',
    medidas: 'Minhas medidas',
    instalar: 'Instalar o app',
    conta: 'Minha conta',
  },
  instalar: {
    titulo: 'Instalar o app no celular',
    iphone: 'No iPhone (Safari)',
    passosIphone: [
      'Abra este site no Safari.',
      'Toque no botão Compartilhar, o quadrado com a seta para cima.',
      'Escolha "Adicionar à Tela de Início" e toque em Adicionar.',
    ],
    android: 'No Android (Chrome)',
    passosAndroid: [
      'Abra este site no Chrome.',
      'Toque nos três pontinhos no canto de cima.',
      'Escolha "Instalar app" ou "Adicionar à tela inicial".',
    ],
  },
  indique: {
    titulo: (pontos: number) =>
      pontos > 0 ? `Traga uma amiga e ganhe ${pontos} pontos` : 'Traga uma amiga',
    linha: 'Quando ela entrar pelo seu link e passar a garantia de 7 dias, os pontos caem na hora.',
    voltar: 'Voltar para o perfil',
    whatsapp: 'Mandar no WhatsApp',
  },
  indicar: {
    titulo: 'Indicar uma amiga',
    texto: (pontos: number) =>
      `Quando ela entrar pelo seu link e passar a garantia de 7 dias, você ganha ${pontos} pontos.`,
    link: 'Seu link',
    copiar: 'Copiar link',
    copiado: 'Link copiado',
    whatsapp: 'Enviar no WhatsApp',
    mensagem: (link: string) =>
      `Oi! Estou na comunidade ORA, com a Ana, a Dra. Clara e a Laís, e lembrei de você. Entra pelo meu link: ${link}`,
    lista: 'Suas indicações',
    vazio: 'Nenhuma indicação ainda.',
    status: { aguardando: 'Aguardando garantia', confirmada: 'Confirmada', cancelada: 'Cancelada' },
    pontos: (n: number, status: string) =>
      status === 'aguardando' ? `+${n} ao confirmar` : n > 0 ? `+${n} pts` : '0 pts',
    semNome: 'Amiga indicada',
  },
  config: {
    titulo: 'Configurações',
    editar: 'Editar apelido e foto',
    janela: 'Apelido e foto',
    apelido: 'Apelido no ranking',
    foto: 'Foto de perfil',
    escolherFoto: 'Escolher foto',
    trocarFoto: 'Trocar foto',
    ranking: 'Aparecer no ranking',
    rankingAjuda: 'Desligado, as outras alunas não veem você; você continua vendo a sua posição.',
    senha: 'Trocar senha',
    senhaNova: 'Nova senha',
    senhaRepetir: 'Repita a nova senha',
    senhaCurta: 'Use pelo menos 8 caracteres.',
    senhaDiferente: 'As senhas não são iguais.',
    senhaOk: 'Senha trocada.',
    sair: 'Sair da conta',
    saindo: 'Saindo',
    salvo: 'Salvo.',
  },
  cancelamento: {
    botao: 'Cancelar inscrição',
    titulo: 'Cancelar inscrição',
    confirmar: 'Confirmar cancelamento',
    voltar: 'Voltar',
    cancelando: 'Cancelando',
    fechar: 'Fechar',
    motivo: 'Quer contar o motivo? (opcional)',
    dentro:
      'Você está dentro dos 7 dias da compra: recebe 100% do valor de volta e o acesso termina agora.',
    fora: (fim: string) =>
      `Como já passaram 7 dias da compra, o plano segue normalmente até ${fim} e não é renovado.`,
    estornoFeito:
      'Cancelamento feito. O estorno integral já foi pedido e o seu acesso foi encerrado.',
    estornoPendente:
      'Cancelamento recebido. A nossa equipe faz o estorno integral e te avisa por e-mail.',
    naoRenovaOk: (fim: string) => `Pedido recebido. Seu acesso segue até ${fim} e não é renovado.`,
    pedido: (quando: string, fim: string) =>
      `Cancelamento pedido em ${quando}. Seu acesso segue até ${fim} e não é renovado.`,
    pedidoEstorno: (quando: string) =>
      `Cancelamento pedido em ${quando}. O estorno integral está em andamento.`,
    erro: 'Não deu certo agora. Tente de novo ou fale com a gente no WhatsApp.',
  },
  historico: {
    titulo: 'Histórico de pontos',
    vazio: 'Seus pontos aparecem aqui a partir do primeiro check-in.',
    porPagina: 'Por página',
    anterior: 'Anterior',
    proxima: 'Próxima',
    pagina: (p: number, de: number) => `${p} de ${de}`,
    acao: (acao: string, nome: string | null, motivo: string | null) => {
      const fixos: Record<string, string> = {
        desafio_checkin: `Desafio${motivo ? `: ${motivo}` : ''}`,
        desafio_bonus: `Bônus do desafio${motivo ? `: ${motivo}` : ''}`,
        ajuste: `Ajuste${motivo ? `: ${motivo}` : ''}`,
        estorno: `Estorno${motivo ? `: ${motivo}` : ''}`,
      }
      return fixos[acao] ?? nome ?? acao
    },
  },
}
