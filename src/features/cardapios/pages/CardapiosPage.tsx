import { useSearchParams } from 'react-router-dom'
import { AbasSublinhadas } from '@/components/ui'
import { ListaCardapios } from '../components/ListaCardapios'
import { ListaMateriais } from '../components/ListaMateriais'
import { ListaReceitas } from '../components/ListaReceitas'
import { textos } from '../textos'

const ABAS = [
  { id: 'cardapios', nome: textos.abas.meu },
  { id: 'receitas', nome: textos.abas.receitas },
  { id: 'materiais', nome: textos.abas.materiais },
] as const

type Aba = (typeof ABAS)[number]['id']
const ehAba = (v: string | null): v is Aba => ABAS.some((a) => a.id === v)

/** Cardápios do tema e, nas outras abas, as receitas e os materiais da nutricionista. */
export function CardapiosPage() {
  const [busca, setBusca] = useSearchParams()
  const pedida = busca.get('aba')
  const aba: Aba = ehAba(pedida) ? pedida : 'cardapios'
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-[28px] leading-tight font-bold text-verde-escuro lg:text-[30px]">
        {textos.titulo}
      </h1>
      <AbasSublinhadas
        opcoes={ABAS}
        ativa={aba}
        aoEscolher={(id) => setBusca(id === 'cardapios' ? {} : { aba: id }, { replace: true })}
        rotulo={textos.abasRotulo}
      />
      {aba === 'receitas' ? (
        <ListaReceitas />
      ) : aba === 'materiais' ? (
        <ListaMateriais />
      ) : (
        <ListaCardapios />
      )}
    </section>
  )
}
