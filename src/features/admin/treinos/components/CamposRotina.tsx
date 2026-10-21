import { Campo } from '@/components/ui'
import { LOCAIS, NIVEIS, OBJETIVOS, TIPOS_ROTINA } from '@/domain/treinos'
import { CampoArea } from '../../components/CampoArea'
import { useTemas } from '../../hooks/usePainel'
import type { DadosRotina } from '../hooks/useRotinaForm'
import { t } from '../textos'
import { Escolha } from './Escolha'

type Campos = { d: DadosRotina; mudar: (x: Partial<DadosRotina>) => void }

/** Tema, nome, objetivo e montagem da semana do tipo de treino. */
export function DadosDaRotina({ d, mudar }: Campos) {
  const temas = useTemas().data ?? []
  return (
    <>
      <div className="sm:col-span-2">
        <Escolha
          id="rotina-tema"
          rotulo={t.campos.tema}
          valor={d.tema_id}
          opcoes={temas.map((x) => [x.id, x.titulo])}
          aoMudar={(tema_id) => mudar({ tema_id, dias: {}, sequencia: [], aerobicos: [] })}
        />
      </div>
      <div className="sm:col-span-2">
        <Campo
          id="rotina-nome"
          rotulo={t.campos.nomeModelo}
          value={d.nome}
          onChange={(e) => mudar({ nome: e.target.value })}
        />
      </div>
      <Escolha
        id="rotina-objetivo"
        rotulo={t.campos.objetivo}
        valor={d.objetivo}
        opcoes={[['', t.campos.semObjetivo], ...Object.entries(OBJETIVOS)]}
        aoMudar={(objetivo) => mudar({ objetivo })}
      />
      <Escolha
        id="rotina-tipo"
        rotulo={t.campos.tipo}
        valor={d.tipo}
        opcoes={Object.entries(TIPOS_ROTINA)}
        aoMudar={(tipo) => mudar({ tipo: tipo === 'numerico' ? 'numerico' : 'semana' })}
      />
    </>
  )
}

/** Nível, local, descrição e orientações gerais. */
export function NivelEOrientacoes({ d, mudar }: Campos) {
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
