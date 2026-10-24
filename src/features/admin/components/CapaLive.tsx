import { BotaoBrilho } from '@/components/ui'
import { textos } from '../textos'
import { AjustarFoto } from './AjustarFoto'
import { AreaArquivos } from './AreaArquivos'
import { BarraEnvio } from './BarraEnvio'
import { useCapa } from './useCapa'

const t = textos.arquivos

export type EstadoCapa = { caminho: string | null; enviando: boolean }

/** Onde a imagem fica: espaço (bucket) e pasta. Padrão: capas das lives no espaço materiais.
 * uso 'exercicio' aceita também GIF animado. */
export type Destino = { espaco: string; pasta: string; titulo?: string; uso?: 'capa' | 'exercicio' }
const CAPAS: Destino = { espaco: 'materiais', pasta: 'capas' }

/** Capa já escolhida: prévia, Ajustar foto (só imagem) e Tirar capa. */
function Previa({ c }: { c: ReturnType<typeof useCapa> }) {
  if (!c.previa) return null
  return (
    <div className="flex flex-wrap items-end gap-3">
      {c.video ? (
        <video
          src={c.previa}
          autoPlay
          loop
          muted
          playsInline
          className="aspect-video w-64 rounded-[14px] bg-tinta object-contain"
        />
      ) : (
        <img
          src={c.previa}
          alt={t.previaCapa}
          className="aspect-video w-64 rounded-[14px] object-cover"
        />
      )}
      {c.podeAjustar && (
        <BotaoBrilho tom="escuro" tamanho="sm" onClick={c.ajustar} disabled={c.progresso !== null}>
          {t.ajustar}
        </BotaoBrilho>
      )}
      <BotaoBrilho tom="coral" tamanho="sm" onClick={c.tirar} disabled={c.progresso !== null}>
        {t.tirarCapa}
      </BotaoBrilho>
    </div>
  )
}

/** Capa da gravação: arrastar e soltar uma imagem (até 5 MB), com prévia e progresso. */
export function CapaLive({
  inicial,
  aoMudar,
  destino = CAPAS,
}: {
  inicial: string | null
  aoMudar: (c: EstadoCapa) => void
  destino?: Destino
}) {
  const c = useCapa(inicial, aoMudar, destino)
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{destino.titulo ?? t.capa}</h3>
      {c.ajustando ? (
        <AjustarFoto src={c.ajustando} aoUsar={c.usarAjuste} aoCancelar={c.cancelarAjuste} />
      ) : c.previa ? (
        <Previa c={c} />
      ) : (
        <AreaArquivos
          aceita={
            destino.uso === 'exercicio'
              ? '.jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov,image/*,video/mp4,video/webm,video/quicktime'
              : '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
          }
          multiplos={false}
          dica={destino.uso === 'exercicio' ? t.dicaExercicio : t.dicaCapa}
          aoEscolher={c.escolher}
        />
      )}
      {c.progresso !== null && <BarraEnvio pct={c.progresso} />}
      {c.aviso && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {c.aviso}
        </p>
      )}
    </section>
  )
}
