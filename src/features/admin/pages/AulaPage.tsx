import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { salvarAula } from '../api/conteudo.api'
import { Estado } from '../components/Estado'
import { FormAula, type EntradaAula } from '../components/FormAula'
import { useAula, useSalvar } from '../hooks/usePainel'
import { liberacaoDoDia } from '../schemas/formularios'
import { textos } from '../textos'

const VAZIA: EntradaAula = {
  titulo: '',
  descricao: '',
  video_url: '',
  material_url: '',
  liberacao: 'compra',
  dia: '1',
}

/** Criar (/aulas/nova?etapa=&tema=) ou editar (/aulas/:aulaId?tema=) uma aula. */
export function AulaPage() {
  const { aulaId } = useParams()
  const [busca] = useSearchParams()
  const navegar = useNavigate()
  const aula = useAula(aulaId)
  const salvar = useSalvar(salvarAula)
  const tema = busca.get('tema')
  const voltar = () => navegar(tema ? `/app/admin/conteudo/${tema}` : '/app/admin/conteudo')

  if (aulaId && aula.isPending) return <Estado tipo="carregando" />
  if (aulaId && aula.isError) return <Estado tipo="erro" tentar={() => aula.refetch()} />
  const etapaId = aula.data?.etapa_id ?? busca.get('etapa') ?? ''
  const inicial: EntradaAula = aula.data
    ? {
        titulo: aula.data.titulo,
        descricao: aula.data.descricao,
        video_url: aula.data.video_url,
        material_url: aula.data.material_url ?? '',
        ...liberacaoDoDia(aula.data.dia_liberacao),
      }
    : VAZIA

  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-titulo text-3xl text-ora">
        {aulaId ? textos.aulas.editar : textos.aulas.nova}
      </h1>
      <FormAula
        inicial={inicial}
        aoCancelar={voltar}
        aoSalvar={async (d) => {
          await salvar.mutateAsync({ ...d, id: aulaId, etapa_id: etapaId })
          voltar()
        }}
      />
    </section>
  )
}
