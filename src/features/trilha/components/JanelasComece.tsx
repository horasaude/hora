import { BotaoBrilho, Carregando, Janela } from '@/components/ui'
import { useRegras } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.comece

/** Regras de pontuação vindas do painel. */
export function JanelaRegras({ aoFechar }: { aoFechar: () => void }) {
  const regras = useRegras()
  return (
    <Janela
      titulo={t.regras.titulo}
      aoFechar={aoFechar}
      rodape={<BotaoBrilho onClick={aoFechar}>{t.entendi}</BotaoBrilho>}
    >
      <p className="mb-4 text-[15px] text-suave">{t.regras.texto}</p>
      {regras.isPending ? (
        <Carregando texto={textos.carregando} />
      ) : (
        <ul className="flex flex-col divide-y divide-linha">
          {(regras.data ?? []).map((r) => (
            <li key={r.acao} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
              <span className="text-tinta">{r.nome}</span>
              <span className="font-bold text-verde-escuro">{t.regras.pontos(r.pontos)}</span>
            </li>
          ))}
        </ul>
      )}
    </Janela>
  )
}

function Passos({ titulo, passos }: { titulo: string; passos: readonly string[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-bold text-tinta">{titulo}</h3>
      <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[15px] text-tinta">
        {passos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
    </section>
  )
}

/** Como instalar o app (PWA) no iPhone e no Android. */
export function JanelaApp({ aoFechar }: { aoFechar: () => void }) {
  return (
    <Janela
      titulo={t.app.titulo}
      aoFechar={aoFechar}
      rodape={<BotaoBrilho onClick={aoFechar}>{t.pronto}</BotaoBrilho>}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Passos titulo={t.app.iphone} passos={t.app.passosIphone} />
        <Passos titulo={t.app.android} passos={t.app.passosAndroid} />
      </div>
    </Janela>
  )
}
