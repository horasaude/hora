import { useNavigate } from 'react-router-dom'
import { BotaoBrilho, Janela } from '@/components/ui'
import { salvarAula } from '../api/conteudo.api'
import { useAula, useSalvar, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'
import { Estado } from './Estado'
import { FormAula, type EntradaAula } from './FormAula'

const VAZIA: EntradaAula = {
  titulo: '',
  descricao: '',
  video_url: '',
  material_url: '',
  profissional: '',
  duracao: '',
  dia: '1',
}

type Props = { aulaId?: string; etapaId: string; temaId: string | null }

/** Janela de criar ou editar aula, por cima do tema. Fecha voltando para o tema. */
export function AulaJanela({ aulaId, etapaId, temaId }: Props) {
  const navegar = useNavigate()
  const aula = useAula(aulaId)
  const salvar = useSalvar(salvarAula)
  const preparacao = useTemas().data?.find((x) => x.id === temaId)?.tipo === 'preparacao'
  const voltar = () => navegar(temaId ? `/app/admin/conteudo/${temaId}` : '/app/admin/conteudo')
  if (aulaId && aula.isPending) return null
  if (aulaId && aula.isError) {
    return (
      <Janela
        titulo={textos.aulas.editar}
        aoFechar={voltar}
        rotuloFechar={textos.fechar}
        rodape={
          <BotaoBrilho tom="cinza" onClick={voltar}>
            {textos.cancelar}
          </BotaoBrilho>
        }
      >
        <Estado tipo="erro" tentar={() => aula.refetch()} />
      </Janela>
    )
  }
  const a = aula.data
  const inicial: EntradaAula = a
    ? {
        titulo: a.titulo,
        descricao: a.descricao,
        video_url: a.video_url,
        material_url: a.material_url ?? '',
        profissional: a.profissional ?? '',
        duracao: a.duracao_minutos ? String(a.duracao_minutos) : '',
        dia: String(a.dia_liberacao),
      }
    : VAZIA
  return (
    <FormAula
      preparacao={preparacao}
      titulo={aulaId ? textos.aulas.editar : textos.aulas.nova}
      inicial={inicial}
      aoCancelar={voltar}
      aoSalvar={async (d) => {
        await salvar.mutateAsync({ ...d, id: aulaId, etapa_id: a?.etapa_id ?? etapaId })
        voltar()
      }}
    />
  )
}
