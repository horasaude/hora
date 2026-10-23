import { useState, type ReactNode } from 'react'
import { classeBrilho } from '@/components/ui'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { Confirmar } from '../../plano/components/Confirmar'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import {
  removerAnamnese,
  salvarAnamnese,
  type Anamnese,
  type AreaAnamnese,
} from '../api/anamnese.api'
import { AnamneseJanela } from '../components/AnamneseJanela'
import { StatusTreino } from '../components/Etiquetas'
import { QuadroTreinos } from '../components/QuadroTreinos'
import { useAcaoTreinos, useAnamneses } from '../hooks/useTreinosPainel'
import { t } from '../textos'

type Aberta = { tipo: 'nova' } | { tipo: 'editar' | 'remover'; a: Anamnese } | null

function Linhas({ lista, abrir }: { lista: Anamnese[]; abrir: (x: Aberta) => void }) {
  const publicar = useAcaoTreinos(salvarAnamnese)
  return (
    <Tabela colunas={t.anamnese.colunas}>
      {lista.map((a) => (
        <tr
          key={a.id}
          className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
          onClick={() => abrir({ tipo: 'editar', a })}
        >
          <td className="px-3.5 py-3 font-bold text-tinta">{a.titulo}</td>
          <td className="px-3.5 py-3">{a.perguntas.length}</td>
          <td className="px-3.5 py-3">{a.enviadas}</td>
          <td className="px-3.5 py-3">
            <StatusTreino publicado={a.publicada} />
          </td>
          <td className="w-12 px-2 py-2">
            <MenuAcoes
              nome={a.titulo}
              acoes={[
                { nome: t.editar, aoEscolher: () => abrir({ tipo: 'editar', a }) },
                {
                  nome: a.publicada ? t.anamnese.tirarDoAr : t.publicar,
                  aoEscolher: () => publicar.mutate({ ...a, publicada: !a.publicada }),
                },
                { nome: t.remover, perigo: true, aoEscolher: () => abrir({ tipo: 'remover', a }) },
              ]}
            />
          </td>
        </tr>
      ))}
    </Tabela>
  )
}

/** Anamneses de uma área: questionários que a aluna responde em Avaliações; respostas no cartão dela
 * em Alunas. A moldura é a tela de Treinos ou a de Saúde. */
export function Anamneses({
  area,
  moldura: Moldura,
}: {
  area: AreaAnamnese
  moldura: (p: { acao: ReactNode; children: ReactNode }) => ReactNode
}) {
  const lista = useAnamneses(area)
  const remover = useAcaoTreinos(removerAnamnese)
  const [aberta, setAberta] = useState<Aberta>(null)
  const fechar = () => setAberta(null)
  const botao = (
    <button
      type="button"
      className={classeBrilho('verde')}
      onClick={() => setAberta({ tipo: 'nova' })}
    >
      {t.anamnese.nova}
    </button>
  )
  let corpo: ReactNode
  if (lista.isPending) corpo = <Estado tipo="carregando" />
  else if (lista.isError) corpo = <Estado tipo="erro" tentar={() => lista.refetch()} />
  else if (lista.data.length === 0)
    corpo = <Estado tipo="vazio" texto={t.anamnese.vazio} acao={botao} />
  else corpo = <Linhas lista={lista.data} abrir={setAberta} />
  return (
    <Moldura acao={botao}>
      {corpo}
      {aberta?.tipo === 'nova' && <AnamneseJanela area={area} aoFechar={fechar} />}
      {aberta?.tipo === 'editar' && (
        <AnamneseJanela anamnese={aberta.a} area={area} aoFechar={fechar} />
      )}
      {aberta?.tipo === 'remover' && (
        <Confirmar
          nome={aberta.a.titulo}
          aoConfirmar={() => remover.mutateAsync(aberta.a.id)}
          aoFechar={fechar}
        />
      )}
    </Moldura>
  )
}

/** Treinos > Anamnese (Laís). */
export function AnamnesesPage() {
  return <Anamneses area="treino" moldura={QuadroTreinos} />
}
