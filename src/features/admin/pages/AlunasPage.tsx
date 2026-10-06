import { useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { acessoAtivo, statusAluna, type StatusAluna } from '@/domain/painel'
import { diaEmBrasilia, formatarData, quandoFoi } from '@/lib/datas'
import type { AlunaPainel } from '../api/modulos.api'
import { AlunaDetalhe, EtiquetaAluna } from '../components/AlunaDetalhe'
import { Estado } from '../components/Estado'
import { Divisao, Quadro, type Numero } from '../components/Quadro'
import { celula, LinhaTabela, Tabela } from '../components/Tabela'
import { useAlunas } from '../hooks/useModulos'
import { textos } from '../textos'

const t = textos.alunas
const nowrap = `${celula} whitespace-nowrap`
type Linha = { aluna: AlunaPainel; status: StatusAluna }

function numeros(linhas: Linha[], agora: Date): Numero[] {
  const ativas = linhas.filter((l) => acessoAtivo(l.aluna, agora))
  const hoje = diaEmBrasilia(agora)
  const entraram = ativas.filter(
    (l) => l.aluna.ultimo_acesso_em && diaEmBrasilia(new Date(l.aluna.ultimo_acesso_em)) === hoje,
  )
  const atencao = ativas.filter((l) => l.status === 'atencao' || l.status === 'sumiu')
  return [
    { valor: String(ativas.length), rotulo: t.ativas, tom: 'salvia' },
    { valor: String(entraram.length), rotulo: t.hoje, tom: 'ocre' },
    { valor: String(atencao.length), rotulo: t.atencao, tom: 'terracota' },
  ]
}

function TabelaAlunas({ linhas, ativa, agora }: { linhas: Linha[]; ativa?: string; agora: Date }) {
  return (
    <Tabela colunas={t.colunas}>
      {linhas.map(({ aluna: a, status }) => (
        <LinhaTabela
          key={a.id}
          ativa={a.id === ativa}
          para={`/app/admin/alunas/${a.id}`}
          semQuebra
          titulo={a.nome || '-'}
        >
          <td className={nowrap}>{a.apelido ?? '-'}</td>
          <td className={nowrap}>
            {a.acesso_inicio_em ? formatarData(new Date(a.acesso_inicio_em)) : '-'}
          </td>
          <td className={nowrap}>{a.dia ?? '-'}</td>
          <td className={nowrap}>
            {a.ultimo_acesso_em ? quandoFoi(new Date(a.ultimo_acesso_em), agora) : t.nunca}
          </td>
          <td className="px-3.5 py-3">
            <EtiquetaAluna status={status} />
          </td>
        </LinhaTabela>
      ))}
    </Tabela>
  )
}

/** Alunas (só leitura): resumo, tabela e a aluna aberta à direita com o progresso. */
export function AlunasPage() {
  const alunas = useAlunas()
  const { alunaId } = useParams()
  const [agora] = useState(() => new Date())
  const linhas: Linha[] = (alunas.data ?? []).map((a) => ({
    aluna: a,
    status: statusAluna(a, agora),
  }))
  const atual = linhas.find((l) => l.aluna.id === alunaId) ?? linhas[0]
  let corpo: ReactNode
  if (alunas.isPending) corpo = <Estado tipo="carregando" />
  else if (alunas.isError) corpo = <Estado tipo="erro" tentar={() => alunas.refetch()} />
  else if (!atual) corpo = <Estado tipo="vazio" texto={t.vazio} />
  else {
    corpo = (
      <Divisao
        estreito
        tabela={<TabelaAlunas linhas={linhas} ativa={atual.aluna.id} agora={agora} />}
        detalhe={
          <AlunaDetalhe
            key={atual.aluna.id}
            aluna={atual.aluna}
            status={atual.status}
            agora={agora}
          />
        }
      />
    )
  }
  return (
    <Quadro titulo={t.pagina} numeros={numeros(linhas, agora)}>
      {corpo}
    </Quadro>
  )
}
