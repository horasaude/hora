import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { BotaoBrilho, Janela } from '@/components/ui'
import { modoDe } from '@/domain/liberacao'
import { paraCampoBrasilia } from '@/lib/datas'
import { etapaDoTema, salvarAula, type Aula, type Etapa } from '../api/conteudo.api'
import { salvarMateriais } from '../api/materiais.api'
import { useMateriais } from '../hooks/useMateriais'
import { useAula, useEtapas, useSalvar, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'
import { Estado } from './Estado'
import { FormAula, type EntradaAula } from './FormAula'
import { CapaLive, type EstadoCapa } from './CapaLive'
import { MateriaisAula } from './MateriaisAula'
import { excluirAula } from '../api/excluir.api'
import { excluir as tx } from '../textos/excluir'
import { BotaoExcluir } from './BotaoExcluir'

type Props = { aulaId?: string; temaId: string | null }

function inicialDa(a: Aula | undefined, etapas: Etapa[], temaId: string | null): EntradaAula {
  const tema = etapas.find((e) => e.id === a?.etapa_id)?.tema_id ?? temaId ?? ''
  return {
    tema,
    titulo: a?.titulo ?? '',
    descricao: a?.descricao ?? '',
    video_url: a?.video_url ?? '',
    profissional: a?.profissional ?? '',
    duracao: a?.duracao_minutos ? String(a.duracao_minutos) : '',
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

/** Excluir a aula (com os arquivos e a miniatura dela). */
function ExcluirAula({ id, aoExcluir }: { id: string; aoExcluir: () => void }) {
  const cliente = useQueryClient()
  return (
    <BotaoExcluir
      rotulo={tx.aula}
      confirmar={tx.confirmarAula}
      excluindo={tx.excluindo}
      mensagemDe={() => tx.erro}
      aoExcluir={async () => {
        await excluirAula(id)
        await cliente.invalidateQueries()
        aoExcluir()
      }}
    />
  )
}

/** Janela de criar ou editar aula. Ao salvar, volta para o tema da aula, que já aparece na lista. */
export function AulaJanela({ aulaId, temaId }: Props) {
  const navegar = useNavigate()
  const aula = useAula(aulaId)
  const temas = useTemas()
  const etapas = useEtapas()
  const salvar = useSalvar(salvarAula)
  const materiais = useMateriais(aulaId)
  const [capa, setCapa] = useState<EstadoCapa | null>(null)
  const irPara = (tema: string | null) =>
    navegar(tema ? `/app/admin/conteudo/${tema}` : '/app/admin/conteudo')
  if ((aulaId && aula.isPending) || temas.isPending || etapas.isPending) return null
  if ((aulaId && aula.isError) || temas.isError || etapas.isError)
    return <Falha voltar={() => irPara(temaId)} tentar={() => void aula.refetch()} />
  const lista = etapas.data ?? []
  return (
    <FormAula
      temas={temas.data ?? []}
      titulo={aulaId ? textos.aulas.editar : textos.aulas.nova}
      inicial={inicialDa(aula.data, lista, temaId)}
      aoCancelar={() => irPara(temaId)}
      excluir={
        aulaId && (
          <ExcluirAula
            id={aulaId}
            aoExcluir={() =>
              irPara(lista.find((e) => e.id === aula.data?.etapa_id)?.tema_id ?? temaId)
            }
          />
        )
      }
      materiais={
        <div className="flex flex-col gap-5">
          <CapaLive
            key={aula.data?.id ?? 'nova'}
            inicial={aula.data?.capa_path ?? null}
            aoMudar={setCapa}
            destino={{ espaco: 'capas', pasta: 'aulas', titulo: textos.aulas.capa }}
          />
          <MateriaisAula m={materiais} />
        </div>
      }
      aoSalvar={async (d, publicar) => {
        if (materiais.enviando || capa?.enviando) throw new Error(textos.arquivos.esperar)
        const capaPath = capa ? capa.caminho : (aula.data?.capa_path ?? null)
        const { tema, ...campos } = d
        const salva = await salvar.mutateAsync({
          ...campos,
          etapa_id: await etapaDoTema(tema),
          dia_liberacao: aula.data?.dia_liberacao ?? 1,
          id: aulaId,
          publicado: publicar,
          capa_path: capaPath,
        })
        await salvarMateriais(salva.id, materiais.paraSalvar, materiais.removidos)
        irPara(lista.find((e) => e.id === salva.etapa_id)?.tema_id ?? tema)
      }}
    />
  )
}
