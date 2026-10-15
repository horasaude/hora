import { BotaoBrilho, Campo, Janela } from '@/components/ui'
import { LOCAIS, NIVEIS, OBJETIVOS, TIPOS_ROTINA } from '@/domain/treinos'
import { CampoArea } from '../../components/CampoArea'
import { useTemas } from '../../hooks/usePainel'
import type { Rotina } from '../api/treinos.api'
import { useRotinaForm, type DadosRotina } from '../hooks/useRotinaForm'
import { useTreinosPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { Escolha } from './Escolha'
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

type Campos = { d: DadosRotina; mudar: (x: Partial<DadosRotina>) => void }

function DadosDaRotina({ d, mudar }: Campos) {
  const temas = useTemas().data ?? []
  return (
    <>
      <div className="sm:col-span-2">
        <Campo
          id="rotina-nome"
          rotulo={t.campos.nomeModelo}
          value={d.nome}
          onChange={(e) => mudar({ nome: e.target.value })}
        />
      </div>
      <Escolha
        id="rotina-tipo"
        rotulo={t.campos.tipo}
        valor={d.tipo}
        opcoes={Object.entries(TIPOS_ROTINA)}
        aoMudar={(tipo) => mudar({ tipo: tipo === 'numerico' ? 'numerico' : 'semana' })}
      />
      <Escolha
        id="rotina-tema"
        rotulo={t.campos.tema}
        valor={d.tema_id}
        opcoes={temas.map((x) => [x.id, x.titulo])}
        aoMudar={(tema_id) => mudar({ tema_id, dias: {}, sequencia: [] })}
      />
      <Escolha
        id="rotina-objetivo"
        rotulo={t.campos.objetivo}
        valor={d.objetivo}
        opcoes={[['', t.campos.semObjetivo], ...Object.entries(OBJETIVOS)]}
        aoMudar={(objetivo) => mudar({ objetivo })}
      />
    </>
  )
}

function NivelEOrientacoes({ d, mudar }: Campos) {
  return (
    <>
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
      <div className="sm:col-span-2">
        <CampoArea
          id="rotina-orientacoes"
          rotulo={t.campos.orientacoes}
          rows={3}
          value={d.orientacoes}
          onChange={(e) => mudar({ orientacoes: e.target.value })}
        />
      </div>
    </>
  )
}

/** Modelo de rotina: por dia da semana ou numérica (Treino 1, 2, 3), com objetivo e orientações. */
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
        <DadosDaRotina d={d} mudar={mudar} />
        <NivelEOrientacoes d={d} mudar={mudar} />
        {d.tipo === 'numerico' ? (
          <SequenciaDaRotina
            sequencia={d.sequencia}
            treinos={doTema}
            aoMudar={(sequencia) => mudar({ sequencia })}
          />
        ) : (
          <DiasDaRotina dias={d.dias} treinos={doTema} aoMudar={(dias) => mudar({ dias })} />
        )}
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </div>
    </Janela>
  )
}
