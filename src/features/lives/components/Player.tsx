import { BotaoBrilho, Janela } from '@/components/ui'
import { linkDeIncorporacao } from '@/lib/video'
import type { Live } from '../api/lives.api'
import { textos } from '../textos'

/** Janela com o vídeo da gravação (ou o link para abrir fora, se não der para incorporar). */
export function Player({ live, aoFechar }: { live: Live; aoFechar: () => void }) {
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
