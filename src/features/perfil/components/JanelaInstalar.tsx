import { BotaoBrilho, Janela } from '@/components/ui'
import { textos } from '../textos'

const t = textos.instalar

function Passos({ titulo, passos }: { titulo: string; passos: string[] }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[15px] font-bold text-verde-escuro">{titulo}</h3>
      <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-[15px] text-tinta">
        {passos.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
    </section>
  )
}

/** Como instalar o app no celular: iPhone e Android. */
export function JanelaInstalar({ aoFechar }: { aoFechar: () => void }) {
  return (
    <Janela
      titulo={t.titulo}
      aoFechar={aoFechar}
      rotuloFechar={textos.fechar}
      rodape={<BotaoBrilho onClick={aoFechar}>{textos.fechar}</BotaoBrilho>}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Passos titulo={t.iphone} passos={t.passosIphone} />
        <Passos titulo={t.android} passos={t.passosAndroid} />
      </div>
    </Janela>
  )
}
