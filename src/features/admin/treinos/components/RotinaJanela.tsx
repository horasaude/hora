import { BotaoBrilho, Janela } from '@/components/ui'
import { useTemas } from '../../hooks/usePainel'
import type { Rotina, TreinoLista } from '../api/treinos.api'
import { useRotinaForm, type DadosRotina } from '../hooks/useRotinaForm'
import { useTreinosPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { AerobicosDaRotina } from './AerobicosDaRotina'
import { DadosDaRotina, NivelEOrientacoes } from './CamposRotina'
import { DiasDaRotina, SequenciaDaRotina } from './TreinosDaRotina'

function Rodape({
  salvando,
  aoFechar,
  gravar,
}: {
  salvando: boolean
  aoFechar: () => void
  gravar: (p: boolean) => void
}) {
  return (
    <>
      <BotaoBrilho tom="cinza" onClick={aoFechar}>
        {t.cancelar}
      </BotaoBrilho>
      <BotaoBrilho onClick={() => gravar(false)} disabled={salvando}>
        {t.salvarRascunho}
      </BotaoBrilho>
      <BotaoBrilho tom="verde" onClick={() => gravar(true)} disabled={salvando}>
        {t.publicar}
      </BotaoBrilho>
    </>
  )
}

type Treinos = { d: DadosRotina; mudar: (x: Partial<DadosRotina>) => void; doTema: TreinoLista[] }

/** Treinos do tipo: musculação por dia (ou na ordem) e os aeróbicos. */
function TreinosDoTipo({ d, mudar, doTema }: Treinos) {
  const musculacao = doTema.filter((x) => x.categoria !== 'aerobico')
  return (
    <>
      {d.tipo === 'numerico' ? (
        <SequenciaDaRotina
          sequencia={d.sequencia}
          treinos={musculacao}
          aoMudar={(sequencia) => mudar({ sequencia })}
        />
      ) : (
        <DiasDaRotina dias={d.dias} treinos={musculacao} aoMudar={(dias) => mudar({ dias })} />
      )}
      <AerobicosDaRotina
        base={{ tema_id: d.tema_id, nivel: d.nivel, local: d.local }}
        comDias={d.tipo === 'semana'}
        aerobicos={d.aerobicos}
        treinos={doTema.filter((x) => x.categoria === 'aerobico')}
        aoMudar={(aerobicos) => mudar({ aerobicos })}
      />
    </>
  )
}

type Props = { rotina?: Rotina; temaId?: string; aoFechar: () => void }

/** Tipo de treino do tema (ex.: Emagrecimento): por dia da semana ou numérico, com musculação e aeróbicos. */
export function RotinaJanela({ rotina, temaId, aoFechar }: Props) {
  const temas = useTemas().data ?? []
  const treinos = useTreinosPainel().data ?? []
  const padrao = temaId ?? temas[0]?.id ?? ''
  const { d, mudar, gravar, erro, salvando } = useRotinaForm(rotina, padrao, aoFechar)
  const doTema = treinos.filter((x) => x.tema_id === d.tema_id)
  return (
    <Janela
      titulo={rotina ? t.editarModelo : t.novoModelo.replace('+ ', '')}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<Rodape salvando={salvando} aoFechar={aoFechar} gravar={gravar} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <DadosDaRotina d={d} mudar={mudar} />
        <NivelEOrientacoes d={d} mudar={mudar} />
        <TreinosDoTipo d={d} mudar={mudar} doTema={doTema} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </div>
    </Janela>
  )
}
