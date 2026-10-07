import { useState } from 'react'
import { BotaoBrilho, Janela } from '@/components/ui'
import { precisaEscolherTema } from '@/domain/trilha'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'
import { EscolhaTema } from './EscolhaTema'

const CHAVE = 'ora:escolha-tema-adiada'

function adiadaNestaVisita() {
  try {
    return sessionStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

/** No dia 8 em diante, sem tema, abre a escolha ao entrar no app (uma vez por visita se ela adiar). */
export function EscolhaAoAbrir() {
  const trilha = useTrilha()
  const [fechada, setFechada] = useState(adiadaNestaVisita)
  if (!trilha.data || !precisaEscolherTema(trilha.data) || fechada) return null
  const adiar = () => {
    try {
      sessionStorage.setItem(CHAVE, '1')
    } catch {
      // armazenamento bloqueado: só fecha
    }
    setFechada(true)
  }
  return (
    <Janela
      titulo={textos.tema.titulo}
      aoFechar={adiar}
      larga
      rodape={
        <BotaoBrilho tom="cinza" onClick={adiar}>
          {textos.tema.depois}
        </BotaoBrilho>
      }
    >
      <p className="mb-4 text-[15px] text-suave">{textos.tema.texto}</p>
      <EscolhaTema temas={trilha.data.temas} aoConcluir={() => setFechada(true)} />
    </Janela>
  )
}
