import { useState } from 'react'
import { AvisoErro, BotaoBrilho, Janela } from '@/components/ui'
import { LOCAIS, NIVEIS, type Local, type Nivel } from '@/domain/treinos'
import { useSalvarPreferencias } from '../hooks/useTreinos'
import { textos } from '../textos'

const t = textos.escolha

function Opcao({
  nome,
  texto,
  escolhida,
  aoEscolher,
}: {
  nome: string
  texto: string
  escolhida: boolean
  aoEscolher: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={escolhida}
      onClick={aoEscolher}
      className={`flex min-h-20 flex-col items-start justify-center gap-1 rounded-[20px] border-2 px-5 py-4 text-left transition ${escolhida ? 'border-coral bg-[#FFF4EF]' : 'border-linha bg-white hover:border-[#F2B9A3]'}`}
    >
      <span className="text-[17px] font-bold text-tinta">{nome}</span>
      <span className="text-sm text-suave">{texto}</span>
    </button>
  )
}

/** Primeiro acesso aos treinos: dois passos, nível e depois local, em cartões grandes. Fechar sem escolher sai dos treinos. */
export function EscolhaNivelLocal({ aoFechar }: { aoFechar: () => void }) {
  const [passo, setPasso] = useState<1 | 2>(1)
  const [nivel, setNivel] = useState<Nivel | null>(null)
  const [local, setLocal] = useState<Local | null>(null)
  const salvar = useSalvarPreferencias()
  const concluir = () =>
    nivel && local && salvar.mutate({ treino_nivel: nivel, treino_local: local })
  const rodape =
    passo === 1 ? (
      <BotaoBrilho tom="coral" disabled={!nivel} onClick={() => setPasso(2)}>
        {textos.execucao.proximo}
      </BotaoBrilho>
    ) : (
      <>
        <BotaoBrilho tom="cinza" onClick={() => setPasso(1)}>
          {t.voltar}
        </BotaoBrilho>
        <BotaoBrilho tom="coral" disabled={!local || salvar.isPending} onClick={concluir}>
          {salvar.isPending ? t.salvando : t.pronto}
        </BotaoBrilho>
      </>
    )
  return (
    <Janela titulo={t.titulo} aoFechar={aoFechar} rodape={rodape}>
      <div className="flex flex-col gap-4 font-sistema">
        <h2 className="text-xl font-bold text-verde-escuro">{passo === 1 ? t.nivel : t.local}</h2>
        <div className="grid gap-3">
          {passo === 1
            ? (Object.keys(NIVEIS) as Nivel[]).map((n) => (
                <Opcao
                  key={n}
                  nome={NIVEIS[n]}
                  texto={textos.niveisTexto[n]}
                  escolhida={nivel === n}
                  aoEscolher={() => setNivel(n)}
                />
              ))
            : (Object.keys(LOCAIS) as Local[]).map((l) => (
                <Opcao
                  key={l}
                  nome={LOCAIS[l]}
                  texto={textos.locaisTexto[l]}
                  escolhida={local === l}
                  aoEscolher={() => setLocal(l)}
                />
              ))}
        </div>
        <AvisoErro texto={salvar.isError ? t.erro : null} />
      </div>
    </Janela>
  )
}
