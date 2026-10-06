import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Botao } from '@/components/ui'
import { salvarEtapa } from '../api/conteudo.api'
import { CabecalhoTema } from '../components/CabecalhoTema'
import { Estado } from '../components/Estado'
import { EtapaCartao } from '../components/EtapaCartao'
import { FormNome } from '../components/FormNome'
import { useSalvar, useTema } from '../hooks/usePainel'
import { textos } from '../textos'

/** Um tema: editar, publicar e gerenciar as etapas e aulas dele. */
export function TemaPage() {
  const { temaId = '' } = useParams()
  const consulta = useTema(temaId)
  const salvar = useSalvar(salvarEtapa)
  const [novaEtapa, setNovaEtapa] = useState(false)
  if (consulta.isPending) return <Estado tipo="carregando" />
  if (consulta.isError) return <Estado tipo="erro" tentar={() => consulta.refetch()} />
  const { tema, etapas, aulas } = consulta.data
  return (
    <section className="flex flex-col gap-4">
      <Link
        to="/app/admin/conteudo"
        className="inline-flex min-h-11 items-center text-sm text-suave underline underline-offset-4"
      >
        {textos.voltar}
      </Link>
      <CabecalhoTema tema={tema} />
      <div className="mt-2 flex items-center justify-between gap-3">
        <h2 className="font-titulo text-2xl text-ora">{textos.etapas.titulo}</h2>
        {!novaEtapa && <Botao onClick={() => setNovaEtapa(true)}>{textos.etapas.nova}</Botao>}
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
      {etapas.length === 0 && !novaEtapa && <Estado tipo="vazio" texto={textos.etapas.vazio} />}
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
    </section>
  )
}
