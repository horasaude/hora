import { useState } from 'react'
import { BotaoBrilho, Carregando, ErroCarregar, Janela } from '@/components/ui'
import { useHoje } from '@/features/checkin'
import { useMedidas } from '../hooks/useMedidas'
import { textos } from '../textos'
import { JanelaMedida } from './JanelaMedida'
import { ListaMedidas } from './ListaMedidas'

const t = textos.evolucao

/** Minhas medidas: todos os registros (com Apagar) e o botão de registrar. */
export function JanelaMinhasMedidas({ aoFechar }: { aoFechar: () => void }) {
  const hoje = useHoje()
  const medidas = useMedidas()
  const [novo, setNovo] = useState(false)
  const lista = medidas.data ?? []
  return (
    <Janela
      titulo={textos.minhasMedidas}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.fechar}
          </BotaoBrilho>
          <BotaoBrilho onClick={() => setNovo(true)}>{t.novo}</BotaoBrilho>
        </>
      }
    >
      {medidas.isPending ? (
        <Carregando texto={textos.carregando} blocos={1} />
      ) : medidas.isError ? (
        <ErroCarregar
          texto={textos.erro}
          tentar={textos.tentar}
          aoTentar={() => medidas.refetch()}
        />
      ) : lista.length === 0 ? (
        <p className="py-4 text-center text-sm text-suave">{t.vazio}</p>
      ) : (
        <ListaMedidas medidas={lista} />
      )}
      {novo && <JanelaMedida hoje={hoje} aoFechar={() => setNovo(false)} />}
    </Janela>
  )
}
