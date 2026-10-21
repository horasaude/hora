import { Link } from 'react-router-dom'
import { Carregando, classeBrilho } from '@/components/ui'
import { IconeVoltar } from '../components/IconesPerfil'
import { CampoLink } from '../components/LinkIndicacao'
import { useLinkIndicacao } from '../hooks/useLinkIndicacao'
import { ListaIndicacoes } from '../components/ListaIndicacoes'
import { useIndicacoes } from '../hooks/usePerfil'
import { textos } from '../textos'

const t = textos.indique

/** Indique e ganhe: foto das três, quantos pontos vale, o link, o WhatsApp e as indicações dela. */
export function IndiquePage() {
  const indicacoes = useIndicacoes()
  const link = useLinkIndicacao()
  return (
    <section className="flex flex-col gap-4 lg:gap-6">
      <header className="flex items-center gap-2">
        <Link
          to="/app/perfil"
          aria-label={t.voltar}
          className="grid size-9 place-items-center rounded-full border border-linha bg-white text-verde-escuro transition hover:shadow-menu"
        >
          <IconeVoltar />
        </Link>
        <h1 className="text-[22px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
          {textos.menu.indique}
        </h1>
      </header>
      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-3">
          <img
            src="/fotos/tres-em-pe.webp"
            alt=""
            className="h-[190px] w-full rounded-[22px] object-cover object-[center_25%] lg:h-72"
          />
          <h2 className="text-[24px] leading-tight font-bold text-verde-escuro">
            {t.titulo(indicacoes.data?.pontosRegra ?? 0)}
          </h2>
          <p className="text-[15px] text-suave">{t.linha}</p>
        </div>
        <div className="flex flex-col gap-3">
          <CampoLink {...link} />
          <a
            href={link.whatsapp}
            target="_blank"
            rel="noreferrer"
            className={`${classeBrilho('verde', 'lg')} w-full sm:w-auto sm:self-start`}
          >
            {t.whatsapp}
          </a>
          <h2 className="mt-3 text-[19px] font-bold text-verde-escuro">{textos.indicar.lista}</h2>
          {indicacoes.isPending ? (
            <Carregando texto={textos.carregando} blocos={1} />
          ) : (
            <ListaIndicacoes lista={indicacoes.data?.lista ?? []} erro={indicacoes.isError} />
          )}
        </div>
      </div>
    </section>
  )
}
