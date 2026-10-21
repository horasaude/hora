import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import type { Opcao } from '@/domain/nutricao'
import { rotuloOpcao } from '../opcoes'
import { tEditor as t } from '../textosRefeicao'
import { EscolherItem } from './EscolherItem'
import { IconeRemover } from './Icones'

type Props = { subs: Opcao[]; aoMudar: (subs: Opcao[]) => void }

/** Seção "Alimentos substitutos": as alternativas "ou" do alimento, cada uma com remover. */
export function SubstitutosEditor({ subs, aoMudar }: Props) {
  const [adicionando, setAdicionando] = useState(false)
  return (
    <section className="flex flex-col gap-2 border-t border-[#F4F5F4] pt-4">
      <h3 className="text-[13px] font-bold text-verde-escuro">{t.substitutos}</h3>
      {subs.length === 0 ? (
        <p className="text-[13px] text-suave">{t.semSubstitutos}</p>
      ) : (
        <ul className="flex flex-col rounded-xl border border-[#ECEFED]">
          {subs.map((o, i) => (
            <li
              key={`${o.ref_id}-${i}`}
              className="flex items-center gap-3 border-b border-[#F4F5F4] px-3.5 py-2 text-[13px] last:border-b-0"
            >
              <span className="text-[11px] font-bold text-suave uppercase">{t.ou}</span>
              <span className="min-w-0 flex-1">
                <span className="font-bold text-tinta">{o.nome}</span>
                <span className="text-suave"> · {rotuloOpcao(o)}</span>
              </span>
              <span className="shrink-0 text-suave">{t.kcal(o.nutrientes.kcal)}</span>
              <button
                type="button"
                aria-label={t.removerSubstituto(o.nome)}
                title={t.removerSubstituto(o.nome)}
                onClick={() => aoMudar(subs.filter((_, k) => k !== i))}
                className="grid size-8 place-items-center rounded-full text-terracota-escuro hover:bg-trilho"
              >
                <IconeRemover />
              </button>
            </li>
          ))}
        </ul>
      )}
      <BotaoBrilho tom="cinza" className="self-start" onClick={() => setAdicionando(true)}>
        + {t.adicionarSubstituto}
      </BotaoBrilho>
      {adicionando && (
        <EscolherItem
          titulo={t.adicionarSubstituto}
          aoEscolher={(o) => aoMudar([...subs, o])}
          aoFechar={() => setAdicionando(false)}
        />
      )}
    </section>
  )
}
