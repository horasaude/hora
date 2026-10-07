import { useState } from 'react'
import { AvisoErro, BotaoBrilho } from '@/components/ui'
import type { TemaOpcao } from '@/domain/trilha'
import { useEscolherTema } from '../hooks/useTrilha'
import { textos } from '../textos'
import { tomDoTema } from './corDoTema'
import { IconeTema } from './Temas'

const t = textos.tema

type Props = { temas: TemaOpcao[]; atual?: string | null; troca?: boolean; aoConcluir?: () => void }

function CartaoTema({
  tema,
  escolhido,
  aoEscolher,
}: {
  tema: TemaOpcao
  escolhido: boolean
  aoEscolher: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={escolhido}
      onClick={aoEscolher}
      className={`flex h-full flex-col items-start gap-3 rounded-[20px] border-2 bg-white p-4 text-left transition hover:shadow-cartao ${escolhido ? 'border-verde-vivo shadow-cartao' : 'border-linha'}`}
    >
      <span
        className={`brilho ${tomDoTema(tema.chave)} grid size-11 place-items-center rounded-full`}
      >
        <IconeTema chave={tema.chave} className="size-6" />
      </span>
      <span className="text-base font-bold text-tinta">{tema.titulo}</span>
      <span className="text-sm leading-snug text-suave">{tema.frase}</span>
    </button>
  )
}

/** Cinco temas em cartões; escolher e confirmar num segundo passo. */
export function EscolhaTema({ temas, atual, troca = false, aoConcluir }: Props) {
  const escolher = useEscolherTema()
  const [escolhido, setEscolhido] = useState<TemaOpcao | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  if (confirmando && escolhido)
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-verde-escuro">
          {t.confirmarTitulo(escolhido.titulo)}
        </h3>
        <p className="text-[15px] text-tinta">{troca ? t.trocarTexto : t.confirmarTexto}</p>
        <div className="flex flex-wrap gap-2">
          <BotaoBrilho tom="cinza" onClick={() => setConfirmando(false)}>
            {t.voltar}
          </BotaoBrilho>
          <BotaoBrilho
            tom="verde"
            disabled={escolher.isPending}
            onClick={() => escolher.mutate(escolhido.id, { onSuccess: () => aoConcluir?.() })}
          >
            {escolher.isPending ? t.confirmando : t.confirmar}
          </BotaoBrilho>
        </div>
        <AvisoErro texto={escolher.isError ? t.erro : null} />
      </div>
    )
  return (
    <div className="flex flex-col gap-4">
      <div
        role="radiogroup"
        aria-label={t.titulo}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {temas
          .filter((x) => x.id !== atual)
          .map((x) => (
            <CartaoTema
              key={x.id}
              tema={x}
              escolhido={escolhido?.id === x.id}
              aoEscolher={() => setEscolhido(x)}
            />
          ))}
      </div>
      <BotaoBrilho
        tom="verde"
        className="self-start"
        disabled={!escolhido}
        onClick={() => setConfirmando(true)}
      >
        {t.continuar}
      </BotaoBrilho>
    </div>
  )
}
