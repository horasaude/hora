import { useState } from 'react'
import { BotaoBrilho, Campo } from '@/components/ui'
import { DIAS_CURTOS } from '@/domain/treinos'
import { useNovoAerobico } from '../hooks/useNovoAerobico'
import type { AerobicoDaRotina } from '../hooks/useRotinaForm'
import { useExercicios } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { Escolha } from './Escolha'

const a = t.aerobicos
const NOVO = 'novo'

type Props = {
  base: { tema_id: string; nivel: string; local: string }
  /** Rotina por dia da semana pede os dias; a numérica, não. */
  comDias: boolean
  existentes: { id: string; nome: string }[]
  aoAdicionar: (novos: AerobicoDaRotina[]) => void
  aoCancelar: () => void
}

/** Dias da semana em pílulas: marca um ou vários. */
function Dias({ dias, mudar }: { dias: number[]; mudar: (d: number[]) => void }) {
  return (
    <fieldset className="flex flex-wrap gap-1.5 sm:col-span-2">
      <legend className="mb-1 text-sm font-medium">{a.dias}</legend>
      {DIAS_CURTOS.map((nome, i) => {
        const marcado = dias.includes(i)
        return (
          <button
            key={nome}
            type="button"
            aria-pressed={marcado}
            onClick={() => mudar(marcado ? dias.filter((x) => x !== i) : [...dias, i])}
            className={`brilho ${marcado ? 'brilho-coral' : 'brilho-cinza'} inline-flex min-h-9 items-center rounded-full px-3.5 text-[13px] font-bold`}
          >
            {nome}
          </button>
        )
      })}
    </fieldset>
  )
}

type Form = { exercicio: string; minutos: string; intensidade: string; obs: string }

/** Campos do aeróbico novo: modalidade de cardio, minutos, intensidade e observação. */
function CamposNovo({
  f,
  setF,
  cardio,
}: {
  f: Form
  setF: (f: Form) => void
  cardio: { id: string; nome: string }[]
}) {
  return (
    <>
      <Escolha
        id="aerobico-modalidade"
        rotulo={a.modalidade}
        valor={f.exercicio}
        opcoes={[['', a.semModalidade], ...cardio.map((x): [string, string] => [x.id, x.nome])]}
        aoMudar={(exercicio) => setF({ ...f, exercicio })}
      />
      <Campo
        id="aerobico-minutos"
        rotulo={a.minutos}
        type="number"
        inputMode="numeric"
        min={1}
        max={300}
        value={f.minutos}
        onChange={(e) => setF({ ...f, minutos: e.target.value })}
      />
      <Escolha
        id="aerobico-intensidade"
        rotulo={a.intensidade}
        valor={f.intensidade}
        opcoes={a.intensidades.map((x): [string, string] => [x, x])}
        aoMudar={(intensidade) => setF({ ...f, intensidade })}
      />
      <Campo
        id="aerobico-obs"
        rotulo={a.observacao}
        maxLength={300}
        value={f.obs}
        onChange={(e) => setF({ ...f, obs: e.target.value })}
      />
    </>
  )
}

/** Adicionar aeróbico: um já criado ou um novo (modalidade, minutos, intensidade), nos dias escolhidos. */
export function NovoAerobico({ base, comDias, existentes, aoAdicionar, aoCancelar }: Props) {
  const cardio = useExercicios('', 'cardio').data ?? []
  const { criar, criando } = useNovoAerobico(base)
  const [qual, setQual] = useState(NOVO)
  const [f, setF] = useState<Form>({
    exercicio: '',
    minutos: '20',
    intensidade: 'Moderada',
    obs: '',
  })
  const [dias, setDias] = useState<number[]>([])
  const [erro, setErro] = useState('')
  const adicionar = async () => {
    const minutos = Number(f.minutos)
    const exercicio = cardio.find((x) => x.id === f.exercicio)
    if (comDias && dias.length === 0) return setErro(a.semDia)
    if (qual === NOVO && !exercicio) return setErro(a.semModalidade)
    if (qual === NOVO && !(minutos >= 1 && minutos <= 300)) return setErro(t.erros.duracao)
    try {
      const id =
        qual === NOVO && exercicio
          ? await criar({ exercicio, minutos, intensidade: f.intensidade, observacao: f.obs })
          : qual
      aoAdicionar(
        comDias ? dias.map((dia) => ({ dia, treino_id: id })) : [{ dia: null, treino_id: id }],
      )
    } catch {
      setErro(a.erro)
    }
  }
  return (
    <div className="grid gap-3 rounded-2xl border border-dashed border-[#F2C4B3] bg-[#FFF8F5] p-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Escolha
          id="aerobico-qual"
          rotulo={a.existente}
          valor={qual}
          opcoes={[[NOVO, a.novo], ...existentes.map((x): [string, string] => [x.id, x.nome])]}
          aoMudar={setQual}
        />
      </div>
      {qual === NOVO && <CamposNovo f={f} setF={setF} cardio={cardio} />}
      {comDias && <Dias dias={dias} mudar={setDias} />}
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
          {erro}
        </p>
      )}
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <BotaoBrilho tom="cinza" onClick={aoCancelar}>
          {t.cancelar}
        </BotaoBrilho>
        <BotaoBrilho tom="dourado" onClick={adicionar} disabled={criando}>
          {criando ? t.salvando : a.adicionar}
        </BotaoBrilho>
      </div>
    </div>
  )
}
