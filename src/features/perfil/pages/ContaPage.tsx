import { MeuTema } from '@/features/trilha'
import { Configuracoes } from '../components/Configuracoes'
import { Indicar } from '../components/Indicar'
import { Topo } from '../components/Topo'

/** Perfil > Minha conta: tema, indicação e configurações. */
export function ContaPage() {
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <Topo />
      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <MeuTema />
          <Configuracoes />
        </div>
        <Indicar />
      </div>
    </section>
  )
}
