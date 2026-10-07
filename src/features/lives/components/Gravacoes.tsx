import { useState } from 'react'
import { BotaoBrilho, EtiquetaBrilho, IconePlay, Janela, Vazio } from '@/components/ui'
import { PROFISSIONAIS } from '@/domain/lives'
import { formatarData } from '@/lib/datas'
import { linkDeIncorporacao } from '@/lib/video'
import type { Live } from '../api/lives.api'
import { textos } from '../textos'

function Player({ live, aoFechar }: { live: Live; aoFechar: () => void }) {
  const link = live.gravacao_url ? linkDeIncorporacao(live.gravacao_url) : null
  return (
    <Janela
      titulo={live.tema}
      aoFechar={aoFechar}
      larga
      rotuloFechar={textos.fechar}
      rodape={
        <BotaoBrilho tom="cinza" onClick={aoFechar}>
          {textos.fechar}
        </BotaoBrilho>
      }
    >
      {link ? (
        <div className="aspect-video overflow-hidden rounded-[18px] bg-tinta">
          <iframe
            src={link}
            title={live.tema}
            className="h-full w-full"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-sm text-suave">
          {textos.semPlayer}{' '}
          {live.gravacao_url && (
            <a
              href={live.gravacao_url}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-verde-escuro underline"
            >
              {textos.abrirFora}
            </a>
          )}
        </p>
      )}
    </Janela>
  )
}

/** Capa: a imagem cadastrada no painel ou a foto da profissional em círculo sobre areia, com play verde ORA. */
function Capa({ live }: { live: Live }) {
  if (live.capa)
    return (
      <img src={live.capa} alt="" loading="lazy" className="aspect-video w-full object-cover" />
    )
  const foto = live.profissional ? PROFISSIONAIS[live.profissional].foto : null
  return (
    <div aria-hidden className="grid aspect-video w-full place-items-center bg-[#F7F3EC]">
      <span className="relative grid place-items-center">
        {foto && <img src={foto} alt="" className="size-28 rounded-full object-cover object-top" />}
        <span className="brilho brilho-escuro absolute grid size-12 place-items-center rounded-full">
          <IconePlay className="ml-0.5 size-4" />
        </span>
      </span>
    </div>
  )
}

/** Gravações, das mais recentes para as mais antigas; abre o player dentro do app. */
export function Gravacoes({ lives }: { lives: Live[] }) {
  const [aberta, setAberta] = useState<Live | null>(null)
  if (lives.length === 0) return <Vazio>{textos.semGravacoes}</Vazio>
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lives.map((l) => {
          const conteudo = (
            <div className="flex h-full flex-col gap-2 overflow-hidden rounded-[22px] bg-white text-left shadow-cartao">
              <Capa live={l} />
              <div className="flex flex-col gap-1 px-5 pb-5">
                <span className="self-start">
                  <EtiquetaBrilho tom={l.gravacao_url ? 'verde' : 'cinza'}>
                    {l.gravacao_url ? textos.gravada : textos.emBreve}
                  </EtiquetaBrilho>
                </span>
                <span className="text-[16px] font-bold text-tinta">{l.tema}</span>
                <span className="text-[13px] text-suave">
                  {[
                    l.profissional && PROFISSIONAIS[l.profissional].nome,
                    formatarData(new Date(l.data)),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </div>
            </div>
          )
          return (
            <li key={l.id}>
              {l.gravacao_url ? (
                <button
                  type="button"
                  aria-label={textos.assistir(l.tema)}
                  onClick={() => setAberta(l)}
                  className="block h-full w-full rounded-[22px] transition hover:shadow-menu"
                >
                  {conteudo}
                </button>
              ) : (
                conteudo
              )}
            </li>
          )
        })}
      </ul>
      {aberta && <Player live={aberta} aoFechar={() => setAberta(null)} />}
    </>
  )
}
