import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { resumoMembros, resumoVendas } from '@/domain/crm'
import { statusAluna } from '@/domain/painel'
import { quandoFoi } from '@/lib/datas'
import { formatarCentavos } from '@/lib/moeda'
import type { AlunaPainel } from '../api/modulos.api'
import { Estado } from '../components/Estado'
import { Quadro, Resumo } from '../components/Quadro'
import { useAlunas } from '../hooks/useModulos'
import { AbasCrm } from './AbasCrm'
import { listarVendas } from './financeiro.api'
import { t } from './textos'

const c = t.cartoes
const lista = (filtro: string) => `/app/admin/alunas${filtro ? `?filtro=${filtro}` : ''}`

/** Alunas paradas (7 dias ou mais sem entrar), da mais antiga para a mais recente. */
function Paradas({ alunas, agora }: { alunas: AlunaPainel[]; agora: Date }) {
  const lista = alunas
    .filter((a) => statusAluna(a, agora) === 'sumiu')
    .sort((a, b) => (a.ultimo_acesso_em ?? '').localeCompare(b.ultimo_acesso_em ?? ''))
  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-[#ECEFED] bg-white p-5 shadow-painel">
      <h2 className="text-[17px] font-bold text-verde-escuro">{t.paradasTitulo}</h2>
      {lista.length === 0 ? (
        <p className="text-sm text-suave">{t.semParadas}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-linha">
          {lista.slice(0, 15).map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
            >
              <Link
                to={`/app/admin/alunas/${a.id}`}
                className="font-semibold text-tinta hover:underline"
              >
                {a.nome || a.apelido || '-'}
              </Link>
              <span className="text-suave">
                {a.ultimo_acesso_em ? quandoFoi(new Date(a.ultimo_acesso_em), agora) : '-'}
              </span>
            </li>
          ))}
        </ul>
      )}
      <Link to="/app/admin/alunas" className="self-start text-sm font-bold text-verde-escuro">
        {t.verTodas}
      </Link>
    </section>
  )
}

/** CRM (Membros): quantas alunas, quantas fazendo o processo, paradas e o que entrou de dinheiro. */
export function CrmPainelPage() {
  const alunas = useAlunas()
  const vendas = useQuery({ queryKey: ['admin', 'vendas'], queryFn: listarVendas })
  const [agora] = useState(() => new Date())
  if (alunas.isPending || vendas.isPending) return <Estado tipo="carregando" />
  if (alunas.isError || vendas.isError)
    return <Estado tipo="erro" tentar={() => (alunas.refetch(), vendas.refetch())} />
  const m = resumoMembros(alunas.data, agora)
  const v = resumoVendas(vendas.data, agora)
  return (
    <Quadro
      titulo={t.titulo}
      numeros={[
        { valor: String(m.inscritas), rotulo: c.inscritas, tom: 'salvia', para: lista('') },
        { valor: String(m.fazendo), rotulo: c.fazendo, tom: 'salvia', para: lista('fazendo') },
        { valor: String(m.atencao), rotulo: c.atencao, tom: 'ocre', para: lista('atencao') },
        { valor: String(m.paradas), rotulo: c.paradas, tom: 'terracota', para: lista('paradas') },
        {
          valor: String(m.semAcesso),
          rotulo: c.semAcesso,
          tom: 'terracota',
          para: lista('sem_acesso'),
        },
      ]}
    >
      <AbasCrm />
      <h2 className="text-[17px] font-bold text-verde-escuro">{t.dinheiro}</h2>
      <Resumo
        numeros={[
          { valor: formatarCentavos(v.valorMes), rotulo: c.valorMes, tom: 'salvia' },
          { valor: String(v.vendasMes), rotulo: c.vendasMes, tom: 'salvia' },
          { valor: String(m.emAtraso), rotulo: c.emAtraso, tom: 'ocre', para: lista('atraso') },
          {
            valor: String(m.pausadas),
            rotulo: c.pausadas,
            tom: 'terracota',
            para: lista('pausadas'),
          },
          { valor: String(v.devolvidas), rotulo: c.devolvidas, tom: 'terracota' },
        ]}
      />
      <Paradas alunas={alunas.data} agora={agora} />
    </Quadro>
  )
}
