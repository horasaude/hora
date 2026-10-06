import { useState } from 'react'
import { Botao } from '@/components/ui'
import { salvarTema, type Tema } from '../api/conteudo.api'
import { useAcoes, useSalvar } from '../hooks/usePainel'
import { textos } from '../textos'
import { FormNome } from './FormNome'
import { Linha } from './Linha'

/** Nome, descrição e situação do tema, com edição no lugar. */
export function CabecalhoTema({ tema }: { tema: Tema }) {
  const { publicar } = useAcoes()
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
      <ul>
        <Linha
          titulo={tema.titulo}
          detalhe={tema.descricao}
          publicado={tema.publicado}
          ocupado={publicar.isPending}
          aoPublicar={() =>
            publicar.mutate({ tabela: 'temas', id: tema.id, publicado: !tema.publicado })
          }
        />
      </ul>
      <Botao variante="secundario" onClick={() => setEditando(true)} className="self-start">
        {textos.editar}
      </Botao>
    </>
  )
}
