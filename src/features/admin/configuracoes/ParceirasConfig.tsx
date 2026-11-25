import { useState } from 'react'
import { acessoAtivo } from '@/domain/painel'
import { formatarData, quandoFoi } from '@/lib/datas'
import { Estado } from '../components/Estado'
import { celula, Etiqueta, LinhaTabela, Tabela } from '../components/Tabela'
import { useAlunas } from '../hooks/useModulos'
import { BotaoParceira } from '../parceiras/Parceria'
import { t } from './textos'

const data = (d: string | null) => (d ? formatarData(new Date(d)) : '-')

/** Parceiras: cadastrar e a lista; cada uma abre a ficha (reenviar e-mail, encerrar parceria). */
export function ParceirasConfig() {
  const alunas = useAlunas()
  const [abertaEm] = useState(() => Date.now())
  const agora = new Date(Math.max(abertaEm, alunas.dataUpdatedAt))
  const lista = (alunas.data ?? []).filter((a) => a.parceira)
  let corpo
  if (alunas.isPending) corpo = <Estado tipo="carregando" />
  else if (alunas.isError) corpo = <Estado tipo="erro" tentar={() => alunas.refetch()} />
  else if (!lista.length) corpo = <Estado tipo="vazio" texto={t.parceiras.vazio} />
  else
    corpo = (
      <Tabela colunas={t.parceiras.colunas}>
        {lista.map((a) => (
          <LinhaTabela
            key={a.id}
            ativa={false}
            para={`/app/admin/alunas/${a.id}`}
            titulo={a.nome || '-'}
            marca={
              acessoAtivo(a, agora) ? undefined : (
                <Etiqueta tom="rosa">{t.parceiras.encerrada}</Etiqueta>
              )
            }
          >
            <td className={celula}>{data(a.acesso_inicio_em)}</td>
            <td className={celula}>{data(a.acesso_fim_em)}</td>
            <td className={celula}>
              {a.ultimo_acesso_em
                ? quandoFoi(new Date(a.ultimo_acesso_em), agora)
                : t.parceiras.nunca}
            </td>
          </LinhaTabela>
        ))}
      </Tabela>
    )
  return (
    <>
      <div className="self-start">
        <BotaoParceira />
      </div>
      {corpo}
    </>
  )
}
