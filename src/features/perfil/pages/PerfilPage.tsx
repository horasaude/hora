import { Evolucao } from '@/features/evolucao'
import { Historico } from '../components/Historico'
import { Resumo } from '../components/Resumo'
import { Topo } from '../components/Topo'

/** Perfil > Minha evolução: topo com o dia do acesso, resumo, medidas e histórico de pontos. */
export function PerfilPage() {
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <Topo />
      <Resumo />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-6">
        <Evolucao />
        <Historico />
      </div>
    </section>
  )
}
