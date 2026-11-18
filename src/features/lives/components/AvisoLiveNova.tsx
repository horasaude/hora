import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { BotaoBrilho, LinkBrilho } from '@/components/ui'
import { PROFISSIONAIS, nomesDasProfissionais } from '@/domain/lives'
import { diaEMes, diaSemanaEHora } from '@/lib/datas'
import type { Live } from '../api/lives.api'
import { useLiveNova } from '../hooks/useLiveNova'
import { textos } from '../textos'

/** Foto da live: a capa do painel ou a foto da primeira profissional. */
function Foto({ live }: { live: Live }) {
  const quem = live.profissionais[0]
  const foto = live.capa ?? (quem ? PROFISSIONAIS[quem].foto : null)
  if (!foto) return null
  return (
    <img
      src={foto}
      alt=""
      className="size-[72px] rounded-full border-2 border-dourado/70 object-cover"
    />
  )
}

function Cartao({ live, aoFechar }: { live: Live; aoFechar: () => void }) {
  const id = useId()
  const quando = new Date(live.data)
  const nomes = nomesDasProfissionais(live.profissionais)
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  })
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-tinta/45 p-5"
      onMouseDown={(e) => e.target === e.currentTarget && aoFechar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className="flex w-full max-w-[360px] flex-col items-center gap-2 rounded-[22px] bg-white p-6 text-center font-sistema text-tinta shadow-[0_24px_60px_rgb(15_42_36/0.25)]"
      >
        <Foto live={live} />
        <h2 id={id} className="text-[19px] font-bold text-verde-escuro">
          {textos.novaTitulo}
        </h2>
        <p className="text-[16px] leading-snug font-bold">{live.tema}</p>
        <p className="text-[14px] font-bold text-[#7A5617]">
          {textos.novaQuando(diaSemanaEHora(quando), diaEMes(quando))}
        </p>
        {nomes && <p className="text-[14px] text-suave">{textos.comMaiusculo(nomes)}</p>}
        <p className="text-[14px]">{textos.novaChamada}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {textos.novaEntendi}
          </BotaoBrilho>
          <LinkBrilho tom="dourado" to="/app/lives" onClick={aoFechar}>
            {textos.novaVer}
          </LinkBrilho>
        </div>
      </div>
    </div>
  )
}

/** Aviso ao abrir o app: tem live nova na agenda. Aparece uma vez por live, neste aparelho. */
export function AvisoLiveNova() {
  const { live, fechar } = useLiveNova()
  if (!live) return null
  return createPortal(<Cartao live={live} aoFechar={() => fechar(live.id)} />, document.body)
}
