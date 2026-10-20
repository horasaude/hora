import { useNavigate } from 'react-router-dom'
import { BotaoBrilho, Janela } from '@/components/ui'
import { modoDe } from '@/domain/liberacao'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarAula, type Aula, type Etapa } from '../api/conteudo.api'
import { salvarMateriais } from '../api/materiais.api'
import { useMateriais } from '../hooks/useMateriais'
import { useAula, useEtapas, useSalvar, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'
import { Estado } from './Estado'
import { FormAula, type EntradaAula } from './FormAula'
import { MateriaisAula } from './MateriaisAula'

type Props = { aulaId?: string; etapaId: string; temaId: string | null }

function inicialDa(
  a: Aula | undefined,
  etapas: Etapa[],
  etapaId: string,
  temaId: string | null,
): EntradaAula {
  const etapa = a?.etapa_id ?? etapaId
  const tema = etapas.find((e) => e.id === etapa)?.tema_id ?? temaId ?? ''
  return {
    tema,
    etapa,
    titulo: a?.titulo ?? '',
    descricao: a?.descricao ?? '',
    video_url: a?.video_url ?? '',
    profissional: a?.profissional ?? '',
    duracao: a?.duracao_minutos ? String(a.duracao_minutos) : '',
    dia: String(a?.dia_liberacao ?? 1),
    liberacao: {
      modo: a ? modoDe(a) : 'aberta',
      quando: a?.libera_em ? paraCampoBrasilia(new Date(a.libera_em)) : '',
    },
  }
}

function Falha({ voltar, tentar }: { voltar: () => void; tentar: () => void }) {
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
      <Estado tipo="erro" tentar={tentar} />
    </Janela>
  )
}

/** Janela de criar ou editar aula. Ao salvar, volta para o tema da aula, que já aparece na lista. */
export function AulaJanela({ aulaId, etapaId, temaId }: Props) {
  const navegar = useNavigate()
  const aula = useAula(aulaId)
  const temas = useTemas()
  const etapas = useEtapas()
  const salvar = useSalvar(salvarAula)
  const materiais = useMateriais(aulaId)
  const irPara = (tema: string | null) =>
    navegar(tema ? `/app/admin/conteudo/${tema}` : '/app/admin/conteudo')
  if ((aulaId && aula.isPending) || temas.isPending || etapas.isPending) return null
  if ((aulaId && aula.isError) || temas.isError || etapas.isError)
    return <Falha voltar={() => irPara(temaId)} tentar={() => void aula.refetch()} />
  const lista = etapas.data ?? []
  return (
    <FormAula
      temas={temas.data ?? []}
      etapas={lista}
      titulo={aulaId ? textos.aulas.editar : textos.aulas.nova}
      inicial={inicialDa(aula.data, lista, etapaId, temaId)}
      aoCancelar={() => irPara(temaId)}
      materiais={<MateriaisAula m={materiais} />}
      aoSalvar={async (d, publicar) => {
        if (materiais.enviando) throw new Error(textos.arquivos.esperar)
        const salva = await salvar.mutateAsync({ ...d, id: aulaId, publicado: publicar })
        await salvarMateriais(salva.id, materiais.paraSalvar, materiais.removidos)
        irPara(lista.find((e) => e.id === salva.etapa_id)?.tema_id ?? temaId)
      }}
    />
  )
}
