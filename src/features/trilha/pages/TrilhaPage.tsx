import { EtiquetaBrilho, Vazio } from '@/components/ui'
import { ComeceAqui } from '../components/ComeceAqui'
import { EstadoAluna } from '../components/EstadoAluna'
import { ListaTemas } from '../components/ListaTemas'
import { useTrilha } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.sequencia

/** Comece por aqui: título com o dia da aluna, os passos iniciais e os temas em sequência (abrem pela data de assinatura). */
export function TrilhaPage() {
  const trilha = useTrilha()
  if (trilha.isPending) return <EstadoAluna tipo="carregando" />
  if (trilha.isError) return <EstadoAluna tipo="erro" tentar={() => trilha.refetch()} />
  const dados = trilha.data
  if (dados.dia === null) return <EstadoAluna tipo="aviso" texto={textos.semAcesso} />
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[24px] leading-tight font-bold text-verde-escuro lg:text-[28px]">
            {t.titulo}
          </h1>
          <EtiquetaBrilho tom="verde">{textos.diaN(dados.dia)}</EtiquetaBrilho>
        </div>
        <p className="text-[15px] text-suave">{t.linha}</p>
      </header>
      <ComeceAqui />
      {dados.temas.length === 0 ? (
        <Vazio>{t.vazio}</Vazio>
      ) : (
        <ListaTemas temas={dados.temas} dia={dados.dia} />
      )}
    </section>
  )
}
