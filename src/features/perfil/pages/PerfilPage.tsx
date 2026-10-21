import { ArquivosDaEquipe } from '@/features/avaliacoes'
import { AntesEDepois, Evolucao } from '@/features/evolucao'
import { TreinosFeitos } from '@/features/treinos'
import { Historico } from '../components/Historico'
import { MenuPerfil } from '../components/MenuPerfil'
import { Resumo } from '../components/Resumo'
import { TopoPerfil } from '../components/TopoPerfil'
import { textos } from '../textos'

/** Perfil > Minha evolução: topo centrado, três números, gráfico, antes e depois e o menu.
 * No computador, duas colunas: evolução à esquerda, menu e histórico à direita. */
export function PerfilPage() {
  return (
    <section className="flex flex-col gap-5 lg:gap-6">
      <TopoPerfil />
      <div className="w-full lg:mx-auto lg:max-w-2xl">
        <Resumo />
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-6">
        <div className="flex flex-col gap-5 lg:gap-6">
          <Evolucao comLista={false} />
          <section className="flex flex-col gap-3">
            <h2 className="text-[19px] font-bold text-verde-escuro">{textos.secoes.antesDepois}</h2>
            <AntesEDepois />
          </section>
        </div>
        <div className="flex flex-col gap-5 lg:gap-6">
          <MenuPerfil />
          <TreinosFeitos />
          <ArquivosDaEquipe />
          <Historico />
        </div>
      </div>
    </section>
  )
}
