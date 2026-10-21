import { useState } from 'react'
import { EtiquetaBrilho, IconePlay, Vazio } from '@/components/ui'
import { nomesDasProfissionais, PROFISSIONAIS } from '@/domain/lives'
import { formatarData } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { textos } from '../textos'
import { Player } from './Player'

/** Miniatura 16:9: a capa do painel ou a foto da profissional, com o play no meio. */
function Miniatura({ live }: { live: Live }) {
  const primeira = live.profissionais[0]
  const imagem = live.capa ?? (primeira ? PROFISSIONAIS[primeira].foto : null)
  return (
    <span className="relative grid aspect-video w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-trilho sm:w-32">
      {imagem && (
        <img
          src={imagem}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover object-[center_20%]"
        />
      )}
      <span className="brilho brilho-escuro relative grid size-7 place-items-center rounded-full">
        <IconePlay className="ml-0.5 size-3" />
      </span>
    </span>
  )
}

function Conteudo({ l }: { l: Live }) {
  return (
    <span className="flex items-center gap-3 rounded-[18px] bg-white p-3 text-left shadow-cartao">
      <Miniatura live={l} />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="line-clamp-2 text-[14px] leading-snug font-bold text-tinta">{l.tema}</span>
        <span className="text-[12px] text-suave">
          {[nomesDasProfissionais(l.profissionais), formatarData(new Date(l.data))]
            .filter(Boolean)
            .join(' · ')}
        </span>
        {!l.gravacao_url && (
          <span className="mt-0.5 self-start">
            <EtiquetaBrilho tom="cinza">{textos.emBreve}</EtiquetaBrilho>
          </span>
        )}
      </span>
    </span>
  )
}

/** Gravações em lista, das mais recentes para as mais antigas; abre o player dentro do app. */
export function Gravacoes({ lives }: { lives: Live[] }) {
  const [aberta, setAberta] = useState<Live | null>(null)
  if (lives.length === 0) return <Vazio>{textos.semGravacoes}</Vazio>
  return (
    <>
      <ul className="grid gap-2.5 lg:grid-cols-2">
        {lives.map((l) => (
          <li key={l.id}>
            {l.gravacao_url ? (
              <button
                type="button"
                aria-label={textos.assistir(l.tema)}
                onClick={() => setAberta(l)}
                className="block w-full rounded-[18px] transition hover:shadow-menu"
              >
                <Conteudo l={l} />
              </button>
            ) : (
              <Conteudo l={l} />
            )}
          </li>
        ))}
      </ul>
      {aberta && <Player live={aberta} aoFechar={() => setAberta(null)} />}
    </>
  )
}
