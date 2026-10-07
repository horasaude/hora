import { useEffect, useMemo, useState } from 'react'
import { AvisoErro, EscolherFoto, Janela, RodapeSalvar } from '@/components/ui'
import type { NovoCheckin } from '../api/checkin.api'
import { esquemaRefeicao, esquemaTreino } from '../schemas/treino.schema'
import { textos } from '../textos'
import { CamposTreino } from './CamposTreino'

const t = textos.foto

type Props = {
  tipo: 'treino' | 'refeicao'
  enviando: boolean
  erro: string | null
  aoFechar: () => void
  aoSalvar: (d: Omit<NovoCheckin, 'tipo'>) => void
}

/** Prévia local da foto escolhida (o link é liberado ao trocar ou fechar). */
function usePrevia(arquivo: File | null) {
  const url = useMemo(() => (arquivo ? URL.createObjectURL(arquivo) : null), [arquivo])
  useEffect(() => () => void (url && URL.revokeObjectURL(url)), [url])
  return url
}

function Previa({ url }: { url: string | null }) {
  return (
    <div className="grid aspect-[4/5] max-h-[34vh] place-items-center overflow-hidden rounded-[18px] bg-trilho sm:max-h-none">
      {url ? (
        <img src={url} alt={t.previa} className="size-full object-cover" />
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden className="size-10 text-suave">
          <path
            d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  )
}

/** Foto do treino ou da refeição: abre a câmera no celular e a escolha de arquivo no computador. */
export function JanelaFoto({ tipo, enviando, erro, aoFechar, aoSalvar }: Props) {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [tipoTreino, setTipoTreino] = useState('')
  const [duracao, setDuracao] = useState('')
  const [aviso, setAviso] = useState<string | null>(null)
  const previa = usePrevia(arquivo)
  const salvar = () => {
    const r =
      tipo === 'treino'
        ? esquemaTreino.safeParse({ arquivo, tipoTreino, duracao })
        : esquemaRefeicao.safeParse({ arquivo })
    if (!r.success) return setAviso(r.error.issues[0]?.message ?? t.falta)
    setAviso(null)
    aoSalvar(r.data)
  }
  return (
    <Janela
      titulo={tipo === 'treino' ? t.treino : t.refeicao}
      aoFechar={aoFechar}
      rodape={
        <RodapeSalvar
          aoCancelar={aoFechar}
          aoSalvar={salvar}
          salvando={enviando}
          tom={tipo === 'treino' ? 'coral' : 'verde'}
          textos={{ cancelar: t.cancelar, salvar: t.salvar, salvando: t.salvando }}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <Previa url={previa} />
          <EscolherFoto
            rotulo={previa ? t.trocar : t.tirar}
            escolhida={Boolean(previa)}
            aoEscolher={setArquivo}
          />
          <p className="text-[13px] text-suave">{t.privado}</p>
        </div>
        {tipo === 'treino' && (
          <CamposTreino
            tipoTreino={tipoTreino}
            setTipoTreino={setTipoTreino}
            duracao={duracao}
            setDuracao={setDuracao}
          />
        )}
      </div>
      <AvisoErro texto={aviso ?? erro} />
    </Janela>
  )
}
