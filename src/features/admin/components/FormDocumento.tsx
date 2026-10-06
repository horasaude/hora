import { useState } from 'react'
import { Campo } from '@/components/ui'
import type { Json } from '@/types/database'
import { lerSecoes, type Secao } from '../secoes'
import { useSalvarConfiguracoes } from '../hooks/useModulos'
import { textos } from '../textos'
import { CampoArea } from './CampoArea'
import { Salvar } from './FormsConfiguracao'

const t = textos.configuracoes

/** Termos ou privacidade: seções com título e texto; adicionar, remover e salvar. */
export function FormDocumento({ campo, valor }: { campo: 'termos' | 'privacidade'; valor: Json }) {
  const salvar = useSalvarConfiguracoes()
  const [secoes, setSecoes] = useState(() => lerSecoes(valor))
  const mudar = (i: number, parte: Partial<Secao>) =>
    setSecoes((l) => l.map((s, j) => (j === i ? { ...s, ...parte } : s)))
  const limpas = secoes.filter((s) => s.titulo.trim() || s.texto.trim())
  return (
    <Salvar aoSalvar={() => salvar.mutateAsync({ [campo]: limpas })}>
      {secoes.map((s, i) => (
        <fieldset
          key={i}
          className="flex flex-col gap-2 rounded-xl border border-linha bg-areia p-3"
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
            className="min-h-11 self-start text-xs font-semibold text-terracota-escuro underline underline-offset-4"
          >
            {t.remover}
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => setSecoes((l) => [...l, { titulo: '', texto: '' }])}
        className="min-h-11 rounded-xl border border-ora text-sm font-semibold text-ora"
      >
        + {t.novaSecao}
      </button>
    </Salvar>
  )
}
