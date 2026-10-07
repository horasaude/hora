import { useState } from 'react'
import { Abas, BotaoBrilho, Carregando, Cartao, ErroCarregar } from '@/components/ui'
import { useHoje } from '@/features/checkin'
import { CAMPOS_MEDIDA, type CampoMedida } from '../api/medidas.api'
import { useMedidas } from '../hooks/useMedidas'
import { textos } from '../textos'
import { GraficoLinha } from './GraficoLinha'
import { JanelaMedida } from './JanelaMedida'
import { ListaMedidas } from './ListaMedidas'

const t = textos.evolucao

/** Minha evolução: gráfico por medida, lista dos registros e o botão de registrar. */
export function Evolucao() {
  const hoje = useHoje()
  const medidas = useMedidas()
  const [abrir, setAbrir] = useState(false)
  const [escolhido, setEscolhido] = useState<CampoMedida | null>(null)
  const lista = medidas.data ?? []
  const comDados = CAMPOS_MEDIDA.filter((c) => lista.some((m) => m[c] !== null))
  const campo = escolhido && comDados.includes(escolhido) ? escolhido : comDados[0]
  const serie = campo
    ? lista
        .flatMap((m) => (m[campo] === null ? [] : [{ dia: m.dia, valor: Number(m[campo]) }]))
        .reverse()
    : []
  return (
    <Cartao className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
          <p className="text-[13px] text-suave">{t.privado}</p>
        </div>
        <BotaoBrilho tom="escuro" onClick={() => setAbrir(true)}>
          {t.novo}
        </BotaoBrilho>
      </div>
      {medidas.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : medidas.isError ? (
        <ErroCarregar
          texto={textos.erro}
          tentar={textos.tentar}
          aoTentar={() => medidas.refetch()}
        />
      ) : lista.length === 0 ? (
        <p className="py-4 text-center text-sm text-suave">{t.vazio}</p>
      ) : (
        <>
          {campo && (
            <Abas
              opcoes={comDados.map((c) => ({ id: c, nome: textos.campos[c].nome }))}
              ativa={campo}
              aoEscolher={setEscolhido}
              rotulo={t.abasRotulo}
            />
          )}
          {campo && serie.length > 1 ? (
            <GraficoLinha
              serie={serie}
              unidade={textos.campos[campo].unidade}
              rotulo={t.grafico(textos.campos[campo].nome)}
            />
          ) : (
            <p className="text-[13px] text-suave">{t.poucos}</p>
          )}
          <ListaMedidas medidas={lista} />
        </>
      )}
      {abrir && <JanelaMedida hoje={hoje} aoFechar={() => setAbrir(false)} />}
    </Cartao>
  )
}
