import { useState } from 'react'
import { formatarTamanho } from '@/domain/arquivos'
import type { ItemMaterial, Materiais } from '../hooks/useMateriais'
import { textos } from '../textos'
import { AreaArquivos } from './AreaArquivos'
import { BarraEnvio } from './BarraEnvio'
import { IconeArquivo } from './IconeArquivo'

const t = textos.arquivos

type Arrastar = { arrastando: number | null; setArrastando: (n: number | null) => void }
const botao =
  'grid size-8 place-items-center rounded-full text-suave hover:bg-trilho disabled:opacity-30'

function Controles({ item, i, m }: { item: ItemMaterial; i: number; m: Materiais }) {
  return (
    <>
      <button
        type="button"
        aria-label={t.subir(item.nome)}
        disabled={i === 0}
        onClick={() => m.mover(i, i - 1)}
        className={botao}
      >
        ↑
      </button>
      <button
        type="button"
        aria-label={t.descer(item.nome)}
        disabled={i === m.itens.length - 1}
        onClick={() => m.mover(i, i + 1)}
        className={botao}
      >
        ↓
      </button>
      <button
        type="button"
        aria-label={t.remover(item.nome)}
        onClick={() => m.remover(item.chave)}
        className={`${botao} hover:text-terracota-escuro`}
      >
        ✕
      </button>
    </>
  )
}

function Linha({
  item,
  i,
  m,
  arrastando,
  setArrastando,
}: { item: ItemMaterial; i: number; m: Materiais } & Arrastar) {
  return (
    <li
      draggable
      onDragStart={() => setArrastando(i)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        if (arrastando !== null) m.mover(arrastando, i)
        setArrastando(null)
      }}
      className={`flex flex-col gap-2 rounded-[14px] border border-linha bg-white px-3 py-2.5 ${arrastando === i ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span
          title={t.arrastar}
          aria-hidden
          className="cursor-grab px-1 text-lg leading-none text-suave select-none"
        >
          ⠿
        </span>
        <IconeArquivo tipo={item.tipo} />
        <input
          aria-label={t.nome(item.nome)}
          value={item.nome}
          maxLength={160}
          onChange={(e) => m.mudar(item.chave, { nome: e.target.value })}
          className="min-h-9 min-w-0 flex-1 rounded-lg border border-transparent px-2 text-sm hover:border-linha focus:border-ora focus:outline-none"
        />
        <span className="shrink-0 text-xs text-suave">
          {item.tipo === 'link' ? t.link : formatarTamanho(item.tamanho)}
        </span>
        <Controles item={item} i={i} m={m} />
      </div>
      {item.progresso !== null && <BarraEnvio pct={item.progresso} />}
      {item.falhou && <p className="text-xs text-terracota-escuro">{t.falhou}</p>}
    </li>
  )
}

/** Materiais da aula: arrastar e soltar, e cada arquivo numa linha com nome editável, tamanho, progresso, ordem e remover. */
export function MateriaisAula({ m }: { m: Materiais }) {
  const [arrastando, setArrastando] = useState<number | null>(null)
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{t.materiais}</h3>
      <AreaArquivos
        aceita=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
        dica={t.dicaMateriais}
        aoEscolher={m.adicionar}
      />
      {m.recusas.map((r) => {
        const [nome = '', motivo = ''] = r.split('|')
        return (
          <p key={r} role="alert" className="text-sm text-terracota-escuro">
            {t.recusado(nome, motivo)}
          </p>
        )
      })}
      {m.itens.length > 0 && (
        <ul className="flex flex-col gap-2">
          {m.itens.map((item, i) => (
            <Linha
              key={item.chave}
              item={item}
              i={i}
              m={m}
              arrastando={arrastando}
              setArrastando={setArrastando}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
