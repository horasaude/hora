import { useState } from 'react'
import { nivelLocal } from '@/domain/treinos'
import { useTemas } from '../../hooks/usePainel'
import { Tabela } from '../../components/Tabela'
import { Confirmar } from '../../plano/components/Confirmar'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import {
  buscarTreino,
  publicar,
  removerTreino,
  salvarTreino,
  type TreinoLista,
} from '../api/treinos.api'
import { useAcaoTreinos, useTreinoPainel } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { StatusTreino } from './Etiquetas'
import { TreinoJanela } from './TreinoJanela'

/** Abre a janela de um treino já salvo, com os exercícios carregados. */
export function EditarTreino({ id, aoFechar }: { id: string; aoFechar: () => void }) {
  const q = useTreinoPainel(id)
  if (!q.data) return null
  return <TreinoJanela treino={q.data.treino} itensIniciais={q.data.itens} aoFechar={aoFechar} />
}

async function duplicar(id: string) {
  const { treino, itens } = await buscarTreino(id)
  const { id: _i, created_at: _c, updated_at: _u, ...resto } = treino
  return salvarTreino({ treino: { ...resto, nome: t.copia(treino.nome), publicado: false }, itens })
}

type Aberta = { tipo: 'editar' | 'remover'; x: TreinoLista } | null

function Linha({ x, abrir, tema }: { x: TreinoLista; abrir: (a: Aberta) => void; tema: string }) {
  const mudar = useAcaoTreinos(publicar)
  const copiar = useAcaoTreinos(duplicar)
  return (
    <tr
      className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
      onClick={() => abrir({ tipo: 'editar', x })}
    >
      <td className="px-3.5 py-3 font-bold text-tinta">
        {x.nome}
        {x.duracao_minutos && (
          <span className="ml-2 font-normal text-suave">{t.min(x.duracao_minutos)}</span>
        )}
      </td>
      <td className="px-3.5 py-3">{tema}</td>
      <td className="px-3.5 py-3">{nivelLocal(x.nivel, x.local)}</td>
      <td className="px-3.5 py-3">{x.qtd}</td>
      <td className="px-3.5 py-3">
        <StatusTreino publicado={x.publicado} />
      </td>
      <td className="w-12 px-2 py-2">
        <MenuAcoes
          nome={x.nome}
          acoes={[
            { nome: t.editar, aoEscolher: () => abrir({ tipo: 'editar', x }) },
            {
              nome: x.publicado ? t.rascunho : t.publicar,
              aoEscolher: () =>
                mudar.mutate({ tabela: 'treinos', id: x.id, publicado: !x.publicado }),
            },
            { nome: t.duplicar, aoEscolher: () => copiar.mutate(x.id) },
            { nome: t.remover, perigo: true, aoEscolher: () => abrir({ tipo: 'remover', x }) },
          ]}
        />
      </td>
    </tr>
  )
}

/** Tabela dos treinos com status em etiqueta e o menu de ações de cada linha. */
export function TabelaTreinos({ treinos }: { treinos: TreinoLista[] }) {
  const temas = useTemas().data ?? []
  const [aberta, setAberta] = useState<Aberta>(null)
  const remover = useAcaoTreinos(removerTreino)
  const fechar = () => setAberta(null)
  return (
    <>
      <Tabela colunas={t.colunasTreinos}>
        {treinos.map((x) => (
          <Linha
            key={x.id}
            x={x}
            abrir={setAberta}
            tema={temas.find((m) => m.id === x.tema_id)?.titulo ?? ''}
          />
        ))}
      </Tabela>
      {aberta?.tipo === 'editar' && <EditarTreino id={aberta.x.id} aoFechar={fechar} />}
      {aberta?.tipo === 'remover' && (
        <Confirmar
          nome={aberta.x.nome}
          aoConfirmar={() => remover.mutateAsync(aberta.x.id)}
          aoFechar={fechar}
        />
      )}
    </>
  )
}
