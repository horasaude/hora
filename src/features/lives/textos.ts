// Textos das lives da aluna. Os componentes só leem daqui.

export const textos = {
  titulo: 'Lives',
  carregando: 'Carregando as lives',
  erro: 'Não foi possível carregar as lives.',
  tentar: 'Tentar de novo',
  proxima: 'Próxima live',
  semAgendada: 'Nenhuma live agendada agora. A próxima aparece aqui assim que for marcada.',
  agendadas: 'Também na agenda',
  gravacoes: 'Gravações',
  semGravacoes: 'As gravações das lives aparecem aqui.',
  gravada: 'Gravada',
  emBreve: 'Gravação em breve',
  assistir: (titulo: string) => `Assistir à gravação: ${titulo}`,
  fechar: 'Fechar',
  semPlayer: 'Não foi possível mostrar este vídeo aqui.',
  abrirFora: 'Abrir em outra aba',
  falta: (d: number, h: number, m: number) =>
    d > 0
      ? `Começa em ${d}d ${h}h ${m}min`
      : h > 0
        ? `Começa em ${h}h ${m}min`
        : m > 0
          ? `Começa em ${m} min`
          : 'Começando agora',
  aoVivo: 'Ao vivo agora',
  agenda: 'Adicionar à agenda',
  lembrar: 'Me lembrar',
  lembrando: 'Lembrete ligado',
  lembreteAviso: 'Vamos te lembrar aqui no app, no Início, no dia da live.',
  entrar: 'Entrar na live',
  entrando: 'Abrindo',
  pontos: (n: number) => `+${n} pontos pela presença`,
  presente: 'Presença registrada',
  semSala: 'O link da sala ainda não foi colocado. Tente de novo perto do horário.',
  erroEntrar: 'Não deu para entrar agora. Confira o horário e tente de novo.',
  hoje: (hora: string) => `Live hoje às ${hora}`,
  faixa: (quando: string, tema: string) => `Live ${quando} · ${tema}`,
  com: (nome: string) => `com ${nome}`,
  duracao: (n: number) => `${n} min`,
}
