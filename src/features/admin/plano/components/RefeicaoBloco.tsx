import { useState, type ReactNode } from 'react'
import { EtiquetaBrilho } from '@/components/ui'
import { totalItens, type Refeicao, type Substituta } from '@/domain/nutricao'
import { textos } from '../textos'
import { tCardapios as t } from '../textos2'
import { IconeDuplicar, IconeEditar, IconeRemover } from './Icones'
import { ListaItens } from './ListaItens'

function Icone({
  rotulo,
  perigo,
  aoClicar,
  children,
}: {
  rotulo: string
  perigo?: boolean
  aoClicar: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      title={rotulo}
      onClick={aoClicar}
      className={`grid size-8 place-items-center rounded-full hover:bg-trilho ${perigo ? 'text-terracota-escuro' : 'text-verde-escuro'}`}
    >
      {children}
    </button>
  )
}

function SubBloco({
  s,
  textoLivre,
  aoEditar,
  aoRemover,
}: {
  s: Substituta
  textoLivre: boolean
  aoEditar: () => void
  aoRemover: () => void
}) {
  return (
    <div className="rounded-xl bg-[#F8FAF9] p-3">
      <div className="mb-1 flex items-center gap-2">
        <p className="text-[13px] font-bold text-tinta">
          {t.substituta}: {s.nome}
        </p>
        <span className="ml-auto flex">
          <Icone rotulo={t.editarRefeicao(s.nome)} aoClicar={aoEditar}>
            <IconeEditar />
          </Icone>
          <Icone rotulo={t.removerRefeicao(s.nome)} perigo aoClicar={aoRemover}>
            <IconeRemover />
          </Icone>
        </span>
      </div>
      <ListaItens itens={s.itens} texto={textoLivre ? s.texto : undefined} />
    </div>
  )
}

type Props = {
  r: Refeicao
  textoLivre: boolean
  aoDuplicar: () => void
  aoEditar: () => void
  aoRemover: () => void
  aoNovaSub: () => void
  aoEditarSub: (i: number) => void
  aoRemoverSub: (i: number) => void
}

/** Bloco da refeição no cardápio: cabeçalho com ícones, alimentos, observação e substituições. */
export function RefeicaoBloco({
  r,
  textoLivre,
  aoDuplicar,
  aoEditar,
  aoRemover,
  aoNovaSub,
  aoEditarSub,
  aoRemoverSub,
}: Props) {
  const [verSubs, setVerSubs] = useState(false)
  return (
    <article className="flex flex-col gap-3 rounded-[18px] border border-[#ECEFED] bg-white p-4 shadow-painel">
      <header className="flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-verde-escuro">{r.nome}</h3>
        {r.horario && <span className="text-[13px] text-suave">{r.horario}</span>}
        {!textoLivre && (
          <EtiquetaBrilho tom="dourado">{textos.kcal(totalItens(r.itens).kcal)}</EtiquetaBrilho>
        )}
        <span className="ml-auto flex">
          <Icone rotulo={t.duplicarRefeicao(r.nome)} aoClicar={aoDuplicar}>
            <IconeDuplicar />
          </Icone>
          <Icone rotulo={t.editarRefeicao(r.nome)} aoClicar={aoEditar}>
            <IconeEditar />
          </Icone>
          <Icone rotulo={t.removerRefeicao(r.nome)} perigo aoClicar={aoRemover}>
            <IconeRemover />
          </Icone>
        </span>
      </header>
      <ListaItens itens={r.itens} texto={textoLivre ? r.texto : undefined} />
      {r.observacao && <p className="text-xs text-suave italic">{r.observacao}</p>}
      <div className="flex flex-wrap items-center gap-3 border-t border-[#F4F5F4] pt-2 text-xs font-bold text-verde-escuro">
        {r.substitutas.length > 0 && (
          <button
            type="button"
            className="min-h-8 underline underline-offset-4"
            onClick={() => setVerSubs((v) => !v)}
          >
            {verSubs ? t.ocultarSubstitutas : t.substitutas(r.substitutas.length)}
          </button>
        )}
        <button type="button" className="min-h-8 underline underline-offset-4" onClick={aoNovaSub}>
          + {t.adicionarSubstituta}
        </button>
      </div>
      {verSubs &&
        r.substitutas.map((s, i) => (
          <SubBloco
            key={s.id}
            s={s}
            textoLivre={textoLivre}
            aoEditar={() => aoEditarSub(i)}
            aoRemover={() => aoRemoverSub(i)}
          />
        ))}
    </article>
  )
}
