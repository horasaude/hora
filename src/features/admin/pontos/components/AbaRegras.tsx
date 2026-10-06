import { useState } from 'react'
import { Estado } from '../../components/Estado'
import { Tabela } from '../../components/Tabela'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import { salvarRegra, type Regra } from '../api/pontos.api'
import { useAcaoPontos, useRegras } from '../hooks/usePontos'
import { t } from '../textos'
import { Interruptor } from './Interruptor'
import { RegraJanela } from './RegraJanela'

/** Regras: ação, valor, limite e liga/desliga; editar abre a janela. */
export function AbaRegras() {
  const regras = useRegras()
  const salvar = useAcaoPontos(salvarRegra)
  const [editando, setEditando] = useState<Regra | null>(null)
  if (regras.isPending) return <Estado tipo="carregando" />
  if (regras.isError) return <Estado tipo="erro" tentar={() => regras.refetch()} />
  return (
    <>
      <Tabela colunas={t.regras.colunas}>
        {regras.data.map((r) => (
          <tr
            key={r.acao}
            className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
            onClick={() => setEditando(r)}
          >
            <td className={`px-3.5 py-3 font-bold ${r.ativo ? 'text-tinta' : 'text-suave'}`}>
              {r.nome}
            </td>
            <td className="px-3.5 py-3">{r.pontos} pts</td>
            <td className="px-3.5 py-3 text-suave">
              {t.limite(r.limite_tipo, r.limite_qtd, r.acao)}
            </td>
            <td className="px-3.5 py-3">
              <Interruptor
                ligado={r.ativo}
                rotulo={t.regras.ativa(r.nome)}
                ocupado={salvar.isPending}
                aoMudar={() => salvar.mutate({ ...r, ativo: !r.ativo })}
              />
            </td>
            <td className="w-12 px-2 py-2">
              <MenuAcoes
                nome={r.nome}
                acoes={[{ nome: t.regras.editar, aoEscolher: () => setEditando(r) }]}
              />
            </td>
          </tr>
        ))}
      </Tabela>
      {editando && <RegraJanela regra={editando} aoFechar={() => setEditando(null)} />}
    </>
  )
}
