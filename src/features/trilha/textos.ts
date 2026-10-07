// Textos da trilha e da aula. Os componentes só leem daqui.

export const textos = {
  titulo: 'Trilha',
  carregando: 'Carregando',
  erro: 'Não foi possível carregar. Tente de novo.',
  tentar: 'Tentar de novo',
  semAcesso: 'Seu acesso começa assim que o pagamento for confirmado.',
  dia: (dia: number, total: number) => `Dia ${dia} de ${total}`,
  progresso: (pct: number, faltam: number) =>
    `${pct}% da etapa` +
    (faltam === 0
      ? ' · etapa completa'
      : faltam === 1
        ? ' · falta 1 aula'
        : ` · faltam ${faltam} aulas`),
  rotuloProgresso: 'Progresso da etapa',
  minutos: (n: number) => `${n} min`,
  diaN: (n: number) => `Dia ${n}`,
  concluida: 'Concluída',
  liberaNoDia: (n: number) => `Libera no dia ${n}`,
  liberaEm: (n: number) => (n === 1 ? 'Libera amanhã' : `Libera em ${n} dias`),
  preparacao: {
    titulo: 'Preparação',
    subtitulo: 'Uma aula por dia, do dia 1 ao dia 7',
    vazio: 'As aulas da preparação aparecem aqui assim que forem publicadas.',
  },
  escolhaEm: (n: number) =>
    n === 1 ? 'Escolha do seu tema libera amanhã' : `Escolha do seu tema libera em ${n} dias`,
  escolhaTexto: 'No dia 8 você escolhe o tema que vai guiar a sua trilha.',
  verPreparacao: 'Rever a preparação',
  abasRotulo: 'Etapas do tema',
  etapaVazia: 'As aulas desta etapa aparecem aqui assim que forem publicadas.',
  bloqueada: {
    titulo: (etapa: string) => `${etapa} ainda está fechada`,
    texto: (anterior: string) =>
      `Ela abre quando as duas metas de ${anterior} estiverem completas.`,
    aulas: (feitas: number, total: number, faltam: number) =>
      `${feitas} de ${total} aulas` +
      (faltam > 0 ? `, faltam ${faltam} para 80%` : ', meta cumprida'),
    dias: (dia: number, meta: number) => `Dia ${Math.min(dia, meta)} de ${meta}`,
    rotuloAulas: 'Aulas concluídas da etapa anterior',
    rotuloDias: 'Dias na etapa anterior',
  },
  conquista: (etapa: string) => `${etapa} liberada. Você cumpriu as duas metas da etapa anterior.`,
  tema: {
    titulo: 'Escolha o seu tema',
    texto: 'Ele guia as suas aulas e os seus cardápios. Dá para trocar depois em Perfil.',
    confirmarTitulo: (tema: string) => `Confirmar ${tema}?`,
    confirmarTexto:
      'A Arrancada começa hoje. Se você voltar a um tema que já fez, continua de onde parou.',
    trocarTexto: 'Ao trocar, a etapa recomeça no novo tema. O progresso deste tema fica guardado.',
    continuar: 'Continuar',
    confirmar: 'Confirmar tema',
    confirmando: 'Salvando',
    voltar: 'Voltar',
    depois: 'Escolher depois',
    erro: 'Não deu certo agora. Tente de novo.',
    meu: 'Meu tema',
    nenhum: 'Você ainda não escolheu um tema.',
    trocar: 'Trocar tema',
    escolher: 'Escolher tema',
    aindaNao: (n: number) => `A escolha libera no dia 8 (faltam ${n} dias).`,
  },
  comece: {
    titulo: 'Comece por aqui',
    progresso: (n: number, total: number) => `${n} de ${total} passos`,
    recolhido: 'Comece por aqui',
    recolher: 'Recolher',
    feito: 'Feito',
    marcar: 'Marcar como feito',
    pular: 'Pular',
    entendi: 'Entendi',
    pronto: 'Pronto',
    fechar: 'Fechar',
    erro: 'Não deu certo agora. Tente de novo.',
    itens: {
      perfil: { nome: 'Completar o perfil', acao: 'Abrir perfil' },
      medidas: { nome: 'Registrar as medidas iniciais', acao: 'Registrar' },
      foto: { nome: 'Foto inicial (opcional)', acao: 'Adicionar' },
      regras: { nome: 'Ler as regras de pontuação', acao: 'Ler' },
      app: { nome: 'Instalar o app no celular', acao: 'Ver como' },
    },
    regras: {
      titulo: 'Como ganhar pontos',
      texto: 'Cada ação vale pontos no ranking do mês. Peso e medidas nunca contam.',
      pontos: (n: number) => `+${n}`,
    },
    app: {
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
  },
  aula: {
    voltar: 'Voltar para a trilha',
    fechada: 'Esta aula ainda não abriu.',
    material: 'Baixar material (PDF)',
    concluir: 'Concluir aula',
    concluida: 'Aula concluída',
    desfazer: 'Desfazer',
    proxima: 'Próxima aula',
    erroMarcar: 'Não foi possível salvar. Tente de novo.',
    semVideo: 'Não foi possível mostrar este vídeo.',
    navegacao: 'Aulas da etapa',
  },
}
