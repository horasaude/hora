// Textos dos arquivos (materiais da aula, capa da live) e da visibilidade das aulas.

export const visibilidade = {
  visivel: 'Visível para alunas',
  aula: 'Não aparece: aula em rascunho',
  etapa: 'Não aparece: etapa em rascunho',
  tema: 'Não aparece: tema em rascunho',
  tituloConfirmar: 'Publicar a aula',
  etapaRascunho: 'Essa etapa ainda não está publicada. Publicar tudo junto?',
  temaRascunho: 'Esse tema ainda não está publicado. Publicar tudo junto?',
  tudo: 'Publicar tudo',
  soAula: 'Só a aula',
}

export const arquivos = {
  arraste: 'Arraste os arquivos para cá',
  arrasteUm: 'Arraste a imagem para cá',
  escolher: 'Escolher arquivos',
  dicaMateriais: 'PDF, JPG, PNG ou WEBP, até 20 MB cada',
  dicaCapa: 'JPG, PNG ou WEBP, até 5 MB',
  materiais: 'Materiais da aula',
  semMateriais: 'Nenhum material ainda.',
  nome: (n: string) => `Nome do material ${n}`,
  remover: (n: string) => `Remover ${n}`,
  subir: (n: string) => `Subir ${n}`,
  descer: (n: string) => `Descer ${n}`,
  arrastar: 'Arraste para mudar a ordem',
  enviando: (pct: number) => `Enviando ${pct}%`,
  falhou: 'O envio falhou. Remova e tente de novo.',
  recusado: (nome: string, motivo: string) =>
    `${nome}: ${motivo === 'tipo' ? 'tipo não aceito' : motivo === 'tamanho' ? 'arquivo grande demais' : 'arquivo vazio'}`,
  link: 'Link',
  esperar: 'Espere terminar o envio dos arquivos.',
  capa: 'Capa da gravação',
  capaEnviada: 'Imagem enviada',
  trocarCapa: 'Trocar capa',
  tirarCapa: 'Tirar capa',
  previaCapa: 'Prévia da capa',
}

export const acesso = {
  secao: 'Acesso',
  botao: 'Liberar acesso',
  titulo: 'Liberar acesso',
  inicio: 'Início do acesso',
  ajuda:
    'Para teste ou para quem pagou fora do sistema. O acesso vale 12 meses a partir dessa data.',
  confirmar: 'Liberar',
  liberando: 'Liberando',
  registro: (quem: string | null, quando: string, inicio: string) =>
    `Liberado por ${quem ?? 'alguém da equipe'} em ${quando}, com início em ${inicio}.`,
}
