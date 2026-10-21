import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { BotaoBrilho } from '@/components/ui'
import { iniciosDosTemas, modoDe } from '@/domain/liberacao'
import { paraCampoBrasilia } from '@/lib/datas'
import { salvarTema, type Aula, type Tema } from '../api/conteudo.api'
import { useSalvar, useTema, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'
import { doTema as tt } from '../textos/doTema'
import { excluirTema, TemaComTreinos } from '../api/excluir.api'
import { excluir as tx } from '../textos/excluir'
import { BotaoExcluir } from './BotaoExcluir'
import { BotaoPublicar } from './BotaoPublicar'
import { CapaLive, type EstadoCapa } from './CapaLive'
import { EtiquetaLiberacao } from './CampoLiberacao'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { Estado } from './Estado'
import { ConteudoDoTema } from './ConteudoDoTema'
import { FormNome } from './FormNome'
import { Situacao } from './Tabela'

/** Janela de editar tema: nome, frase, dias, liberação e capa. */
function EditarTema({ tema, aoFechar }: { tema: Tema; aoFechar: () => void }) {
  const salvar = useSalvar(salvarTema)
  const [capa, setCapa] = useState<EstadoCapa | null>(null)
  return (
    <FormNome
      titulo={textos.temas.editar}
      rotulo={textos.temas.campoTitulo}
      inicial={{
        titulo: tema.titulo,
        descricao: tema.descricao,
        dias: String(tema.dias_liberado),
        liberacao: {
          modo: modoDe(tema),
          quando: tema.libera_em ? paraCampoBrasilia(new Date(tema.libera_em)) : '',
        },
      }}
      aoCancelar={aoFechar}
      extra={
        <CapaLive
          inicial={tema.capa_path}
          aoMudar={setCapa}
          destino={{ espaco: 'capas', pasta: 'temas', titulo: textos.temas.capa }}
        />
      }
      aoSalvar={async (d) => {
        if (capa?.enviando) throw new Error(textos.arquivos.esperar)
        await salvar.mutateAsync({
          ...d,
          id: tema.id,
          capa_path: capa ? capa.caminho : tema.capa_path,
        })
        aoFechar()
      }}
    />
  )
}

/** Excluir o tema (com as aulas e materiais dele) e voltar para a lista. */
function ExcluirTema({ id }: { id: string }) {
  const navegar = useNavigate()
  const cliente = useQueryClient()
  return (
    <BotaoExcluir
      rotulo={tx.tema}
      confirmar={tx.confirmarTema}
      excluindo={tx.excluindo}
      mensagemDe={(e) => (e instanceof TemaComTreinos ? tx.temTreinos : tx.erro)}
      aoExcluir={async () => {
        await excluirTema(id)
        await cliente.invalidateQueries()
        navegar('/app/admin/conteudo')
      }}
    />
  )
}

function SobreTema({ tema, aulas, inicio }: { tema: Tema; aulas: Aula[]; inicio?: number }) {
  const [editando, setEditando] = useState(false)
  return (
    <>
      {editando && <EditarTema tema={tema} aoFechar={() => setEditando(false)} />}
      {tema.descricao && <p className="text-sm text-suave">{tema.descricao}</p>}
      <Dados
        itens={[
          [tt.abre, inicio ? String(inicio) : '-'],
          [tt.dura, tt.dias(tema.dias_liberado)],
          [textos.aulas.titulo, String(aulas.length)],
          [
            textos.status,
            <span key="s" className="flex flex-wrap gap-1.5">
              <Situacao publicado={tema.publicado} />
              <EtiquetaLiberacao l={tema} />
            </span>,
          ],
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="temas" id={tema.id} publicado={tema.publicado} />
        <ExcluirTema id={tema.id} />
      </div>
    </>
  )
}

/** Cartão do tema aberto: dados, publicar, editar e tudo o que vai dentro dele. */
export function TemaDetalhe({ temaId }: { temaId: string }) {
  const consulta = useTema(temaId)
  const temas = useTemas()
  if (consulta.isPending) return <Estado tipo="carregando" />
  if (consulta.isError) return <Estado tipo="erro" tentar={() => consulta.refetch()} />
  const { tema, aulas } = consulta.data
  const inicio = iniciosDosTemas(temas.data ?? [])[tema.id]
  return (
    <CartaoDetalhe titulo={tema.titulo}>
      <SobreTema tema={tema} aulas={aulas} inicio={inicio} />
      <ConteudoDoTema temaId={tema.id} temaPublicado={tema.publicado} aulas={aulas} />
    </CartaoDetalhe>
  )
}
