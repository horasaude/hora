import { Configuracoes } from '../components/Configuracoes'
import { Evolucao } from '@/features/evolucao'
import { MeuTema } from '@/features/trilha'
import { Historico } from '../components/Historico'
import { Indicar } from '../components/Indicar'
import { Resumo } from '../components/Resumo'
import { Topo } from '../components/Topo'

/** Perfil: topo com o dia do acesso, resumo, evolução, indicação, configurações e histórico de pontos. */
export function PerfilPage() {
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <Topo />
      <Resumo />
      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <Evolucao />
          <div className="hidden lg:block">
            <Historico />
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:gap-6">
          <MeuTema />
          <Indicar />
          <Configuracoes />
        </div>
        <div className="lg:hidden">
          <Historico />
        </div>
      </div>
    </section>
  )
}
