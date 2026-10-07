import { useSearchParams } from 'react-router-dom'
import { Abas } from '@/components/ui'
import { ListaCardapios } from '../components/ListaCardapios'
import { ListaReceitas } from '../components/ListaReceitas'
import { textos } from '../textos'

const ABAS = [
  { id: 'cardapios', nome: textos.abas.cardapios },
  { id: 'receitas', nome: textos.abas.receitas },
] as const

/** Cardápios do tema e, na outra aba, as receitas. */
export function CardapiosPage() {
  const [busca, setBusca] = useSearchParams()
  const aba = busca.get('aba') === 'receitas' ? 'receitas' : 'cardapios'
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {textos.titulo}
      </h1>
      <Abas
        opcoes={ABAS}
        ativa={aba}
        aoEscolher={(id) =>
          setBusca(id === 'receitas' ? { aba: 'receitas' } : {}, { replace: true })
        }
        rotulo={textos.abasRotulo}
      />
      {aba === 'receitas' ? <ListaReceitas /> : <ListaCardapios />}
    </section>
  )
}
