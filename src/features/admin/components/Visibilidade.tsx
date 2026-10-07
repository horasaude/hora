import { BotaoBrilho, Janela } from '@/components/ui'
import { textos } from '../textos'
import { Etiqueta } from './Tabela'

const t = textos.visibilidade

export type Situacoes = { aula: boolean; etapa: boolean; tema: boolean }

/** O que a aluna vê: só aparece com aula, etapa e tema publicados. */
export function EtiquetaVisivel({ s }: { s: Situacoes }) {
  if (!s.aula) return <Etiqueta tom="neutro">{t.aula}</Etiqueta>
  if (!s.etapa) return <Etiqueta tom="rosa">{t.etapa}</Etiqueta>
  if (!s.tema) return <Etiqueta tom="rosa">{t.tema}</Etiqueta>
  return <Etiqueta tom="verde">{t.visivel}</Etiqueta>
}

type Props = {
  etapaRascunho: boolean
  aoTudo: () => void
  aoSoAula: () => void
  aoFechar: () => void
}

/** Ao publicar aula de etapa ou tema em rascunho: publicar tudo junto ou só a aula. */
export function ConfirmarPublicar({ etapaRascunho, aoTudo, aoSoAula, aoFechar }: Props) {
  return (
    <Janela
      titulo={t.tituloConfirmar}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoSoAula}>
            {t.soAula}
          </BotaoBrilho>
          <BotaoBrilho tom="verde" onClick={aoTudo}>
            {t.tudo}
          </BotaoBrilho>
        </>
      }
    >
      <p className="text-[15px] text-tinta">{etapaRascunho ? t.etapaRascunho : t.temaRascunho}</p>
    </Janela>
  )
}
