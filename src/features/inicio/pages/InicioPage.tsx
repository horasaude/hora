import { Cartao, Carregando, ErroCarregar } from '@/components/ui'
import { aulaParaContinuar, temaAtual } from '@/domain/trilha'
import { AcessoPausado, MensalidadeEmAberto, useMeuPerfil } from '@/features/auth'
import { AvisoAnamnese } from '@/features/avaliacoes'
import { AvisosNovos } from '@/features/avisos'
import { PedidosDaEquipe } from '@/features/lembretes'
import { AvisoRespondida } from '@/features/forum'
import { ChamadaIndicar } from '@/features/perfil'
import { useTrilha } from '@/features/trilha'
import { ResumoDoDia, useHoje } from '@/features/checkin'
import { CartaoDesafioAtivo } from '@/features/desafios'
import { CartaoPontos } from '../components/CartaoPontos'
import { ContinueAula } from '../components/Cartoes'
import { ConsultaIndividual } from '../components/ConsultaIndividual'
import { ProximaLive } from '../components/ProximaLive'
import { Topo } from '../components/Topo'
import { textos } from '../textos'

/** Primeiro nome; sem nome, o apelido. */
function primeiroNome(nome?: string, apelido?: string | null) {
  return nome?.trim().split(/\s+/)[0] || apelido || ''
}

/** Pedido da equipe: os pedidos e a anamnese pendente; o título some quando não há nada. */
function PedidoDaEquipe() {
  return (
    <section className="flex flex-col gap-2.5 [&:not(:has([data-pedido]))]:hidden">
      <h2 className="text-[15px] font-bold text-tinta">{textos.pedido}</h2>
      <PedidosDaEquipe />
      <AvisoAnamnese />
    </section>
  )
}

/** Continue de onde parou: a próxima aula não concluída dos temas abertos. */
function Continue() {
  const trilha = useTrilha()
  if (trilha.isPending) return <Carregando texto={textos.carregando} blocos={1} />
  if (trilha.isError)
    return (
      <ErroCarregar texto={textos.erro} tentar={textos.tentar} aoTentar={() => trilha.refetch()} />
    )
  const achada = aulaParaContinuar(trilha.data)
  return achada ? <ContinueAula aula={achada.aula} tema={achada.tema} /> : null
}

/** Início da aluna na ordem do protótipo: topo, pontos, pedido da equipe, seu dia, aula, desafio, live, indicação e consulta individual. */
export function InicioPage() {
  const hoje = useHoje()
  const perfil = useMeuPerfil()
  const trilha = useTrilha()
  const nome = primeiroNome(perfil.data?.nome, perfil.data?.apelido)
  const dia = trilha.data?.dia ?? null
  const semAcesso = trilha.isSuccess && dia === null
  const tema = trilha.data ? temaAtual(trilha.data) : null
  return (
    <section className="flex flex-col gap-5 lg:gap-7">
      <Topo nome={nome} dia={dia} />
      {!semAcesso && <MensalidadeEmAberto />}
      {semAcesso ? (
        <AcessoPausado
          padrao={<Cartao className="text-sm text-tinta">{textos.semAcesso}</Cartao>}
        />
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr] lg:gap-7">
          <div className="flex flex-col gap-5">
            <CartaoPontos />
            <PedidoDaEquipe />
            <AvisosNovos />
            <AvisoRespondida />
            <ResumoDoDia />
            <Continue />
          </div>
          <div className="flex flex-col gap-5">
            <CartaoDesafioAtivo hoje={hoje} temaId={tema?.id ?? null} />
            <ProximaLive />
            <ChamadaIndicar />
            <ConsultaIndividual />
          </div>
        </div>
      )}
    </section>
  )
}
