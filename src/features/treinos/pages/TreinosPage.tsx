import { useMemo, useState } from 'react'
import { BotaoBrilho, Voltar } from '@/components/ui'
import { useMeuPerfil } from '@/features/auth'
import { AvisoAnamnese } from '@/features/avaliacoes'
import { EscolhaNivelLocal } from '../components/EscolhaNivelLocal'
import { Estado } from '../components/Estado'
import { ListaTipos } from '../components/ListaTipos'
import { TipoDeTreino } from '../components/TipoDeTreino'
import {
  useFeitosDaSemana,
  usePreferencias,
  useTiposDeTreino,
  useTreinosVisiveis,
} from '../hooks/useTreinos'
import { useLinkTreino } from '../hooks/useLinkTreino'
import { useTipoAberto } from '../hooks/useTipoAberto'
import { ContextoTemaTreinos, usePreviaTreinos } from '../previa'
import { textos } from '../textos'

/** Tipos de treino em cartões; com um aberto (?tipo=), a semana dele em lista. */
function Conteudo({ nivel, local }: { nivel: string; local: string }) {
  const tipos = useTiposDeTreino()
  const todos = useTreinosVisiveis()
  const feitosQ = useFeitosDaSemana()
  const { id, abrir } = useTipoAberto()
  const link = useLinkTreino()
  const feitos = useMemo(
    () => new Set((feitosQ.data ?? []).map((f) => f.treino_id)),
    [feitosQ.data],
  )
  if (tipos.isPending || todos.isPending) return <Estado tipo="carregando" />
  if (tipos.isError || todos.isError)
    return <Estado tipo="erro" tentar={() => (tipos.refetch(), todos.refetch())} />
  const aberto = id ? tipos.data.find((r) => r.id === id) : undefined
  if (aberto) return <TipoDeTreino rotina={aberto} aoVoltar={() => abrir(null)} />
  const naRotina = new Set(tipos.data.flatMap((r) => r.dias.map((d) => d.treino.id)))
  const avulsos = todos.data.filter(
    (x) => !naRotina.has(x.id) && (!nivel || (x.nivel === nivel && x.local === local)),
  )
  return (
    <ListaTipos
      tipos={tipos.data}
      avulsos={avulsos}
      nivel={nivel}
      local={local}
      feitos={feitos}
      link={link}
      abrir={abrir}
    />
  )
}

/** Treinos de um tema, dentro da página do tema (sem o título da página). */
export function TreinosDoTema({ temaId }: { temaId: string }) {
  return (
    <ContextoTemaTreinos.Provider value={temaId}>
      <TreinosPage embutido />
    </ContextoTemaTreinos.Provider>
  )
}

/** Treinos da aluna: os tipos de treino do tema e, dentro de cada um, a semana em lista.
 * Nível e local são opcionais: ela vê todos os tipos e escolhe; quem escolhe ganha o "Para você". */
export function TreinosPage({ embutido = false }: { embutido?: boolean }) {
  const prefs = usePreferencias()
  const perfil = useMeuPerfil()
  const previa = usePreviaTreinos()
  const [escolhendo, setEscolhendo] = useState(false)
  if (prefs.isPending || perfil.isPending) return <Estado tipo="carregando" />
  if (prefs.isError) return <Estado tipo="erro" tentar={() => prefs.refetch()} />
  const nivel =
    prefs.data.treino_nivel ?? (previa || perfil.data?.papel === 'admin' ? 'iniciante' : '')
  const local = prefs.data.treino_local ?? (previa || perfil.data?.papel === 'admin' ? 'casa' : '')
  return (
    <section className="flex flex-col gap-6 font-sistema">
      {!embutido && (
        <div className="flex flex-col gap-2">
          <Voltar para="/app" historico rotulo={textos.escolha.voltar} />
          <h1 className="text-[26px] font-bold text-verde-escuro">{textos.titulo}</h1>
        </div>
      )}
      {!previa && <AvisoAnamnese />}
      {!(nivel && local) && (
        <BotaoBrilho tom="cinza" className="self-start" onClick={() => setEscolhendo(true)}>
          {textos.indicados}
        </BotaoBrilho>
      )}
      <Conteudo nivel={nivel && local ? nivel : ''} local={nivel && local ? local : ''} />
      {escolhendo && !(nivel && local) && (
        <EscolhaNivelLocal aoFechar={() => setEscolhendo(false)} />
      )}
    </section>
  )
}
