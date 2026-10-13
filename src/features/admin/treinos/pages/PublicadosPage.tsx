import { Estado } from '../../components/Estado'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { TabelaModelos } from '../components/TabelaModelos'
import { TabelaTreinos } from '../components/TabelaTreinos'
import { useRotinas, useTreinosPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'

/** Publicados: só o que as alunas já veem, treinos e modelos. */
export function PublicadosPage() {
  const treinos = useTreinosPainel()
  const rotinas = useRotinas()
  if (treinos.isPending || rotinas.isPending)
    return (
      <QuadroTreinos>
        <Estado tipo="carregando" />
      </QuadroTreinos>
    )
  if (treinos.isError || rotinas.isError)
    return (
      <QuadroTreinos>
        <Estado tipo="erro" tentar={() => (treinos.refetch(), rotinas.refetch())} />
      </QuadroTreinos>
    )
  const ts = treinos.data.filter((x) => x.publicado)
  const rs = rotinas.data.filter((x) => x.publicado)
  return (
    <QuadroTreinos>
      {ts.length === 0 && rs.length === 0 && <Estado tipo="vazio" texto={t.vazioPublicados} />}
      {ts.length > 0 && <TabelaTreinos treinos={ts} />}
      {rs.length > 0 && <TabelaModelos rotinas={rs} />}
    </QuadroTreinos>
  )
}
