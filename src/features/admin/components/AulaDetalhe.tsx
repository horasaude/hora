import { Link, useNavigate } from 'react-router-dom'
import { salvarAula } from '../api/conteudo.api'
import { useAula, useSalvar } from '../hooks/usePainel'
import { liberacaoDoDia } from '../schemas/formularios'
import { textos } from '../textos'
import { CartaoDetalhe } from './CartaoDetalhe'
import { Estado } from './Estado'
import { FormAula, type EntradaAula } from './FormAula'

const VAZIA: EntradaAula = {
  titulo: '',
  descricao: '',
  video_url: '',
  material_url: '',
  profissional: '',
  duracao: '',
  liberacao: 'compra',
  dia: '1',
}

type Props = { aulaId?: string; etapaId: string; temaId: string | null }

/** Cartão de criar ou editar aula, com a prévia do vídeo. Volta para o tema ao salvar. */
export function AulaDetalhe({ aulaId, etapaId, temaId }: Props) {
  const navegar = useNavigate()
  const aula = useAula(aulaId)
  const salvar = useSalvar(salvarAula)
  const doTema = temaId ? `/app/admin/conteudo/${temaId}` : '/app/admin/conteudo'
  const voltar = () => navegar(doTema)

  if (aulaId && aula.isPending) return <Estado tipo="carregando" />
  if (aulaId && aula.isError) return <Estado tipo="erro" tentar={() => aula.refetch()} />
  const inicial: EntradaAula = aula.data
    ? {
        titulo: aula.data.titulo,
        descricao: aula.data.descricao,
        video_url: aula.data.video_url,
        material_url: aula.data.material_url ?? '',
        profissional: aula.data.profissional ?? '',
        duracao: aula.data.duracao_minutos ? String(aula.data.duracao_minutos) : '',
        ...liberacaoDoDia(aula.data.dia_liberacao),
      }
    : VAZIA

  return (
    <CartaoDetalhe titulo={aulaId ? textos.aulas.editar : textos.aulas.nova}>
      <Link
        to={doTema}
        className="-mt-3 inline-flex min-h-11 items-center self-start text-sm text-suave underline underline-offset-4"
      >
        {textos.voltar}
      </Link>
      <FormAula
        inicial={inicial}
        aoCancelar={voltar}
        aoSalvar={async (d) => {
          await salvar.mutateAsync({ ...d, id: aulaId, etapa_id: aula.data?.etapa_id ?? etapaId })
          voltar()
        }}
      />
    </CartaoDetalhe>
  )
}
