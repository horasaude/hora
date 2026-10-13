import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import { DIAS_SEMANA, LOCAIS, NIVEIS } from '@/domain/treinos'
import { useTemas } from '../../hooks/usePainel'
import type { Rotina } from '../api/treinos.api'
import { useRotinaForm } from '../hooks/useRotinaForm'
import { useTreinosPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { Escolha } from './Escolha'

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

function DiasDaRotina({
  dias,
  treinos,
  aoMudar,
}: {
  dias: Record<number, string>
  treinos: { id: string; nome: string }[]
  aoMudar: (dias: Record<number, string>) => void
}) {
  const d = { dias }
  const doTema = treinos
  const mudar = (x: { dias: Record<number, string> }) => aoMudar(x.dias)
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-linha p-4 sm:col-span-2 sm:grid-cols-2">
      <legend className="px-1 text-sm font-bold text-verde-escuro">{t.dias}</legend>
      {DIAS_SEMANA.map((nome, dia) => (
        <Escolha
          key={nome}
          id={`rotina-dia-${dia}`}
          rotulo={nome}
          valor={d.dias[dia] ?? ''}
          opcoes={[['', t.descanso], ...doTema.map((x): [string, string] => [x.id, x.nome])]}
          aoMudar={(id) => mudar({ dias: { ...d.dias, [dia]: id } })}
        />
      ))}
    </fieldset>
  )
}

/** Modelo de rotina semanal: dados e o treino de cada dia (ou descanso). */
export function RotinaJanela({ rotina, aoFechar }: { rotina?: Rotina; aoFechar: () => void }) {
  const temas = useTemas().data ?? []
  const treinos = useTreinosPainel().data ?? []
  const { d, mudar, gravar, erro, salvando } = useRotinaForm(rotina, temas[0]?.id ?? '', aoFechar)
  const doTema = treinos.filter((x) => x.tema_id === d.tema_id)
  return (
    <Janela
      titulo={rotina ? t.editarModelo : t.novoModelo.replace('+ ', '')}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<Rodape salvando={salvando} aoFechar={aoFechar} gravar={gravar} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo
            id="rotina-nome"
            rotulo={t.campos.nomeModelo}
            value={d.nome}
            onChange={(e) => mudar({ nome: e.target.value })}
          />
        </div>
        <Escolha
          id="rotina-tema"
          rotulo={t.campos.tema}
          valor={d.tema_id}
          opcoes={temas.map((x) => [x.id, x.titulo])}
          aoMudar={(tema_id) => mudar({ tema_id, dias: {} })}
        />
        <Escolha
          id="rotina-nivel"
          rotulo={t.campos.nivel}
          valor={d.nivel}
          opcoes={Object.entries(NIVEIS)}
          aoMudar={(nivel) => mudar({ nivel })}
        />
        <Escolha
          id="rotina-local"
          rotulo={t.campos.local}
          valor={d.local}
          opcoes={Object.entries(LOCAIS)}
          aoMudar={(local) => mudar({ local })}
        />
        <Campo
          id="rotina-descricao"
          rotulo={t.campos.descricao}
          value={d.descricao}
          onChange={(e) => mudar({ descricao: e.target.value })}
        />
        <DiasDaRotina dias={d.dias} treinos={doTema} aoMudar={(dias) => mudar({ dias })} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </div>
    </Janela>
  )
}
