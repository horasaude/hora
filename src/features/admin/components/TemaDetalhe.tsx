import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { salvarTema, type Aula, type Tema } from '../api/conteudo.api'
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
  const janela = editando && (
    <FormNome
      titulo={textos.temas.editar}
      rotulo={textos.temas.campoTitulo}
      inicial={{ titulo: tema.titulo, descricao: tema.descricao }}
      aoCancelar={() => setEditando(false)}
      aoSalvar={async (d) => {
        await salvar.mutateAsync({ ...d, id: tema.id })
        setEditando(false)
      }}
    />
  )
  return (
    <>
      {janela}
      {tema.descricao && <p className="text-sm text-suave">{tema.descricao}</p>}
      <Dados
        itens={[
          [textos.etapas.titulo, String(etapas)],
          [textos.aulas.titulo, String(aulas.length)],
          [textos.status, <Situacao key="s" publicado={tema.publicado} />],
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <BotaoBrilho onClick={() => setEditando(true)}>{textos.editar}</BotaoBrilho>
        <BotaoPublicar tabela="temas" id={tema.id} publicado={tema.publicado} />
      </div>
    </>
  )
}

/** Cartão do tema aberto: dados, publicar, editar e as etapas com as aulas. */
export function TemaDetalhe({ temaId }: { temaId: string }) {
  const consulta = useTema(temaId)
  if (consulta.isPending) return <Estado tipo="carregando" />
  if (consulta.isError) return <Estado tipo="erro" tentar={() => consulta.refetch()} />
  const { tema, etapas, aulas } = consulta.data
  return (
    <CartaoDetalhe titulo={tema.titulo}>
      <SobreTema tema={tema} etapas={etapas.length} aulas={aulas} />
      <h3 className="border-t border-[#F0F2F1] pt-4 text-base font-bold text-verde-escuro">
        {textos.etapas.titulo}
      </h3>
      {etapas.length === 0 && <p className="text-sm text-suave">{textos.etapas.vazio}</p>}
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
