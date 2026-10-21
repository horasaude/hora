import { classeBrilho } from '@/components/ui'
import { textos } from '../textos'
import { ABAS_TEMA, CORES_ABAS, type AbaTema } from './abasDoTema'
import { IconeAba } from './IconesTrilha'

const t = textos.sequencia
/** Abas coloridas do tema com ícone; no celular rolam para o lado. */
export function AbasTema({
  ativa,
  aoEscolher,
}: {
  ativa: AbaTema
  aoEscolher: (a: AbaTema) => void
}) {
  return (
    <div
      role="tablist"
      aria-label={t.abasRotulo}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      {ABAS_TEMA.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={id === ativa}
          onClick={() => aoEscolher(id)}
          className={`${classeBrilho(id === ativa ? CORES_ABAS[id] : 'cinza', 'md')} shrink-0`}
        >
          <IconeAba aba={id} className="size-4" />
          {t.abas[id]}
        </button>
      ))}
    </div>
  )
}
