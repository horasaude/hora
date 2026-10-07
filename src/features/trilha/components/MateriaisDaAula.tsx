import { useState } from 'react'
import { BotaoBrilho, Cartao, Janela } from '@/components/ui'
import { formatarTamanho } from '@/domain/arquivos'
import type { MaterialAula } from '../api/trilha.api'
import { useMateriaisAula } from '../hooks/useTrilha'
import { textos } from '../textos'

const t = textos.materiais
const baixar =
  'brilho brilho-escuro inline-flex min-h-9 items-center rounded-full px-4 text-[13px] font-bold'

function IconePdf() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-9 shrink-0 text-terracota">
      <path
        d="M7 3h7l5 5v13H7zM14 3v5h5M9.5 13h5M9.5 16.5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Visualizador({ m, aoFechar }: { m: MaterialAula; aoFechar: () => void }) {
  return (
    <Janela
      titulo={m.nome}
      aoFechar={aoFechar}
      larga
      rodape={
        <>
          <BotaoBrilho tom="cinza" onClick={aoFechar}>
            {t.fechar}
          </BotaoBrilho>
          {m.baixar && (
            <a href={m.baixar} className={baixar}>
              {t.baixar}
            </a>
          )}
        </>
      }
    >
      {m.url && (
        <img src={m.url} alt={m.nome} className="mx-auto max-h-[70vh] w-auto rounded-[14px]" />
      )}
    </Janela>
  )
}

function Item({ m, aoAmpliar }: { m: MaterialAula; aoAmpliar: () => void }) {
  if (m.tipo === 'imagem')
    return (
      <Cartao className="flex items-center gap-3 p-3">
        <button
          type="button"
          onClick={aoAmpliar}
          aria-label={t.ampliar(m.nome)}
          className="shrink-0 overflow-hidden rounded-[12px]"
        >
          {m.url && <img src={m.url} alt="" className="size-16 object-cover" />}
        </button>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-bold text-tinta">{m.nome}</span>
          <span className="text-[13px] text-suave">{formatarTamanho(m.tamanho)}</span>
        </span>
        {m.baixar && (
          <a href={m.baixar} className={baixar}>
            {t.baixar}
          </a>
        )}
      </Cartao>
    )
  if (m.tipo === 'link')
    return (
      <a
        href={m.url ?? '#'}
        target="_blank"
        rel="noreferrer"
        className="block rounded-[22px] transition hover:shadow-menu"
      >
        <Cartao className="flex items-center gap-3 p-4">
          <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-verde-escuro underline underline-offset-2">
            {m.nome}
          </span>
          <span className="text-[13px] text-suave">{t.abrir}</span>
        </Cartao>
      </a>
    )
  return (
    <Cartao className="flex items-center gap-3 p-4">
      <IconePdf />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-bold text-tinta">{m.nome}</span>
        <span className="text-[13px] text-suave">{formatarTamanho(m.tamanho)}</span>
      </span>
      {m.baixar && (
        <a href={m.baixar} className={baixar}>
          {t.baixar}
        </a>
      )}
    </Cartao>
  )
}

/** Materiais da aula em cartões: PDF para baixar, imagem que amplia e link que abre em outra aba. */
export function MateriaisDaAula({ aula }: { aula: string }) {
  const materiais = useMateriaisAula(aula, true)
  const [aberta, setAberta] = useState<MaterialAula | null>(null)
  if (!materiais.data?.length) return null
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {materiais.data.map((m) => (
          <li key={m.id}>
            <Item m={m} aoAmpliar={() => setAberta(m)} />
          </li>
        ))}
      </ul>
      {aberta && <Visualizador m={aberta} aoFechar={() => setAberta(null)} />}
    </section>
  )
}
