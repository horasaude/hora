import { Cartao } from '@/components/ui'
import { useIndicacoes } from '../hooks/usePerfil'
import { textos } from '../textos'
import { useLinkIndicacao } from '../hooks/useLinkIndicacao'
import { CampoLink } from './LinkIndicacao'
import { ListaIndicacoes } from './ListaIndicacoes'

const t = textos.indicar

/** Cartão Indicar uma amiga (Desafios e Minha conta): link, Copiar, WhatsApp e a lista. */
export function Indicar() {
  const indicacoes = useIndicacoes()
  const link = useLinkIndicacao()
  return (
    <Cartao className="flex flex-col gap-4">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      {indicacoes.data && (
        <p className="text-sm text-tinta">{t.texto(indicacoes.data.pontosRegra)}</p>
      )}
      <CampoLink {...link} />
      <a
        href={link.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="brilho brilho-verde inline-flex min-h-9 items-center self-start rounded-full px-4 text-[13px] font-bold"
      >
        {t.whatsapp}
      </a>
      <h3 className="pt-2 text-base font-bold text-tinta">{t.lista}</h3>
      <ListaIndicacoes lista={indicacoes.data?.lista ?? []} erro={indicacoes.isError} />
    </Cartao>
  )
}
