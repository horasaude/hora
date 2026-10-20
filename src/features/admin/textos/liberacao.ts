// Textos da liberação de tema e aula (disponível, em breve ou numa data) e da ordem por arrastar.

export const liberacao = {
  titulo: 'Liberação para a aluna',
  modos: { aberta: 'Disponível', breve: 'Em breve', data: 'Liberar em' },
  quando: 'Data e hora',
  erroData: 'Escolha a data e a hora.',
  emBreve: 'Em breve',
  liberaEm: (quando: string) => `Libera ${quando}`,
  salvar: 'Salvar',
  salvo: 'Salvo.',
  erro: 'Não foi possível salvar.',
  arrastar: 'Arraste para mudar a ordem',
  erroOrdem: 'Não foi possível mudar a ordem.',
}
