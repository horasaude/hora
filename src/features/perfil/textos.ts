// Textos do perfil. Os componentes só leem daqui.

export const textos = {
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
  apelidoInvalido: 'Use de 2 a 20 letras ou números, sem espaço (pode ponto, traço e sublinhado).',
  fotoDe: (nome: string) => `Foto de ${nome}`,
  dia: (dia: number, semana: number) => `Dia ${dia} · Semana ${semana}`,
  resumo: {
    pontos: 'pontos no mês',
    seguidos: 'dias seguidos',
    aulas: 'aulas concluídas',
    desafios: 'desafios completos',
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
