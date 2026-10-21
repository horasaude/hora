import { BotaoBrilho, Janela } from '@/components/ui'
import type { Opcao, Por100 } from '@/domain/nutricao'
import { por100De } from '../opcoes'
import { textos } from '../textos'
import { tEscolher as t } from '../textos2'
import { useSeletor } from '../hooks/useSeletor'
import { PainelSeletor } from './SeletorItem'

type Props = {
  titulo: string
  soAlimentos?: boolean
  aoEscolher: (o: Opcao, por100?: Por100) => void
  aoFechar: () => void
}

/** Janela de escolher um alimento: busca (Todas, TACO, Meus alimentos, Receitas), medida e quantidade. */
export function EscolherItem({ titulo, soAlimentos, aoEscolher, aoFechar }: Props) {
  const s = useSeletor(soAlimentos)
  const confirmar = () => {
    if (!s.opcao || !s.escolhido) return
    aoEscolher(s.opcao, s.escolhido.tipo === 'alimento' ? por100De(s.escolhido.a) : undefined)
    aoFechar()
  }
  return (
    <Janela
      larga
      titulo={titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.cancelar}
          </BotaoBrilho>
          <BotaoBrilho disabled={!s.opcao} onClick={confirmar}>
            {t.adicionar}
          </BotaoBrilho>
        </>
      }
    >
      <PainelSeletor s={s} />
    </Janela>
  )
}
