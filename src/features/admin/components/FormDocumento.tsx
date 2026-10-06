import { useState } from 'react'
import { Campo, classeBrilho } from '@/components/ui'
import type { Json } from '@/types/database'
import { lerSecoes, type Secao } from '../secoes'
import { useSalvarConfiguracoes } from '../hooks/useModulos'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { JanelaSalvar } from './FormsConfiguracao'

const t = textos.configuracoes

/** Termos ou privacidade: seções com título e texto; adicionar, remover e salvar. */
export function FormDocumento({
  campo,
  valor,
  aoFechar,
}: {
  campo: 'termos' | 'privacidade'
  valor: Json
  aoFechar: () => void
}) {
  const salvar = useSalvarConfiguracoes()
  const [secoes, setSecoes] = useState(() => lerSecoes(valor))
  const mudar = (i: number, parte: Partial<Secao>) =>
    setSecoes((l) => l.map((s, j) => (j === i ? { ...s, ...parte } : s)))
  const limpas = secoes.filter((s) => s.titulo.trim() || s.texto.trim())
  return (
    <JanelaSalvar
      titulo={t.itens[campo]}
      aoFechar={aoFechar}
      aoSalvar={() => salvar.mutateAsync({ [campo]: limpas })}
    >
      {secoes.map((s, i) => (
        <fieldset
          key={i}
          className="flex flex-col gap-2 rounded-2xl border border-[#ECEFED] bg-white p-3"
        >
          <Campo
            rotulo={`${t.secaoTitulo} ${i + 1}`}
            name={`titulo-${i}`}
            value={s.titulo}
            onChange={(e) => mudar(i, { titulo: e.target.value })}
          />
          <CampoArea
            rotulo={t.secaoTexto}
            name={`texto-${i}`}
            value={s.texto}
            onChange={(e) => mudar(i, { texto: e.target.value })}
          />
          <button
            type="button"
            aria-label={t.removerSecao(i + 1)}
            onClick={() => setSecoes((l) => l.filter((_, j) => j !== i))}
            className="min-h-9 self-start text-xs font-bold text-terracota-escuro underline underline-offset-4"
          >
            {t.remover}
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => setSecoes((l) => [...l, { titulo: '', texto: '' }])}
        className={`self-start ${classeBrilho('dourado')}`}
      >
        + {t.novaSecao}
      </button>
    </JanelaSalvar>
  )
}
