import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Botao } from '@/components/ui'
import { salvarTema } from '../api/conteudo.api'
import { Estado } from '../components/Estado'
import { FormNome } from '../components/FormNome'
import { Linha } from '../components/Linha'
import { useAcoes, useSalvar, useTemas } from '../hooks/usePainel'
import { textos } from '../textos'

const t = textos.temas

/** Lista de temas: criar, publicar, reordenar e abrir para editar etapas e aulas. */
export function ConteudoPage() {
  const temas = useTemas()
  const { publicar, ordenar } = useAcoes()
  const salvar = useSalvar(salvarTema)
  const [criando, setCriando] = useState(false)
  const navegar = useNavigate()
  const lista = temas.data ?? []
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-titulo text-3xl text-ora">{t.titulo}</h1>
        {!criando && <Botao onClick={() => setCriando(true)}>{t.novo}</Botao>}
      </div>
      {criando && (
        <FormNome
          rotulo={t.campoTitulo}
          aoCancelar={() => setCriando(false)}
          aoSalvar={async (dados) => {
            const novo = await salvar.mutateAsync(dados)
            navegar(novo.id)
          }}
        />
      )}
      {temas.isPending && <Estado tipo="carregando" />}
      {temas.isError && <Estado tipo="erro" tentar={() => temas.refetch()} />}
      {temas.isSuccess && lista.length === 0 && !criando && <Estado tipo="vazio" texto={t.vazio} />}
      <ul className="flex flex-col gap-2">
        {lista.map((tema, i) => (
          <Linha
            key={tema.id}
            titulo={tema.titulo}
            detalhe={tema.descricao}
            publicado={tema.publicado}
            para={tema.id}
            ocupado={publicar.isPending || ordenar.isPending}
            aoPublicar={() =>
              publicar.mutate({ tabela: 'temas', id: tema.id, publicado: !tema.publicado })
            }
            aoSubir={
              i > 0 ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: -1 }) : undefined
            }
            aoDescer={
              i < lista.length - 1
                ? () => ordenar.mutate({ tipo: 'tema', id: tema.id, direcao: 1 })
                : undefined
            }
          />
        ))}
      </ul>
    </section>
  )
}
