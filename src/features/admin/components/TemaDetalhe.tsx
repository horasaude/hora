import { useState } from 'react'
import { Botao } from '@/components/ui'
import { salvarEtapa, salvarTema, type Aula, type Tema } from '../api/conteudo.api'
import { useSalvar, useTema } from '../hooks/usePainel'
import { textos } from '../textos'
import { BotaoPublicar } from './BotaoPublicar'
import { CartaoDetalhe, Dados } from './CartaoDetalhe'
import { Estado } from './Estado'
import { EtapaCartao } from './EtapaCartao'
import { FormNome } from './FormNome'
import { Situacao } from './Tabela'

function SobreTema({ tema, etapas, aulas }: { tema: Tema; etapas: number; aulas: Aula[] }) {
  const salvar = useSalvar(salvarTema)
  const [editando, setEditando] = useState(false)
  if (editando) {
    return (
      <FormNome
        rotulo={textos.temas.campoTitulo}
        inicial={{ titulo: tema.titulo, descricao: tema.descricao }}
        aoCancelar={() => setEditando(false)}
        aoSalvar={async (d) => {
          await salvar.mutateAsync({ ...d, id: tema.id })
          setEditando(false)
        }}
      />
    )
  }
  return (
    <>
      {tema.descricao && <p className="text-sm text-suave">{tema.descricao}</p>}
      <Dados
        itens={[
          [textos.etapas.titulo, String(etapas)],
          [textos.aulas.titulo, String(aulas.length)],
          [textos.status, <Situacao key="s" publicado={tema.publicado} />],
        ]}
      />
      <div className="flex gap-2">
        <BotaoPublicar
          tabela="temas"
          id={tema.id}
          publicado={tema.publicado}
          className="flex-1 text-sm"
        />
        <Botao
          variante="secundario"
          className="rounded-xl text-sm"
          onClick={() => setEditando(true)}
        >
          {textos.editar}
        </Botao>
      </div>
    </>
  )
}

/** Cartão do tema aberto: dados, publicar, editar e as etapas com as aulas. */
export function TemaDetalhe({ temaId }: { temaId: string }) {
  const consulta = useTema(temaId)
  const salvar = useSalvar(salvarEtapa)
  const [novaEtapa, setNovaEtapa] = useState(false)
  if (consulta.isPending) return <Estado tipo="carregando" />
  if (consulta.isError) return <Estado tipo="erro" tentar={() => consulta.refetch()} />
  const { tema, etapas, aulas } = consulta.data
  return (
    <CartaoDetalhe titulo={tema.titulo}>
      <SobreTema tema={tema} etapas={etapas.length} aulas={aulas} />
      <div className="flex items-center justify-between gap-3 border-t border-linha pt-5">
        <h3 className="text-[1.35rem] leading-snug font-bold text-ora">{textos.etapas.titulo}</h3>
        {!novaEtapa && (
          <Botao
            variante="secundario"
            className="rounded-xl text-sm"
            onClick={() => setNovaEtapa(true)}
          >
            {textos.etapas.nova}
          </Botao>
        )}
      </div>
      {novaEtapa && (
        <FormNome
          rotulo={textos.etapas.campoTitulo}
          aoCancelar={() => setNovaEtapa(false)}
          aoSalvar={async (d) => {
            await salvar.mutateAsync({ ...d, tema_id: tema.id, ordem: 1 })
            setNovaEtapa(false)
          }}
        />
      )}
      {etapas.length === 0 && !novaEtapa && (
        <p className="text-sm text-suave">{textos.etapas.vazio}</p>
      )}
      <ul className="flex flex-col gap-3">
        {etapas.map((etapa, i) => (
          <EtapaCartao
            key={etapa.id}
            etapa={etapa}
            aulas={aulas.filter((a) => a.etapa_id === etapa.id)}
            temaId={tema.id}
            primeira={i === 0}
            ultima={i === etapas.length - 1}
          />
        ))}
      </ul>
    </CartaoDetalhe>
  )
}
