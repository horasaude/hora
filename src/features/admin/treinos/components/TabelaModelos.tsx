import { useState } from 'react'
import { DIAS_CURTOS, nivelLocal } from '@/domain/treinos'
import { useTemas } from '../../hooks/usePainel'
import { Tabela } from '../../components/Tabela'
import { Confirmar } from '../../plano/components/Confirmar'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import { publicar, removerRotina, type Rotina } from '../api/treinos.api'
import { useAcaoTreinos } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { StatusTreino } from './Etiquetas'
import { RotinaJanela } from './RotinaJanela'

type Aberta = { tipo: 'editar' | 'remover'; r: Rotina } | null

/** Modelos de rotina semanal: dias com treino, status e ações. */
export function TabelaModelos({ rotinas }: { rotinas: Rotina[] }) {
  const temas = useTemas().data ?? []
  const [aberta, setAberta] = useState<Aberta>(null)
  const mudar = useAcaoTreinos(publicar)
  const remover = useAcaoTreinos(removerRotina)
  const fechar = () => setAberta(null)
  return (
    <>
      <Tabela colunas={t.colunasModelos}>
        {rotinas.map((r) => (
          <tr
            key={r.id}
            className="cursor-pointer border-b border-[#F4F5F4] last:border-b-0 hover:bg-[#F8FAF9]"
            onClick={() => setAberta({ tipo: 'editar', r })}
          >
            <td className="px-3.5 py-3 font-bold text-tinta">{r.nome}</td>
            <td className="px-3.5 py-3">{temas.find((m) => m.id === r.tema_id)?.titulo}</td>
            <td className="px-3.5 py-3">{nivelLocal(r.nivel, r.local)}</td>
            <td className="px-3.5 py-3">
              {[...r.dias]
                .sort((a, b) => a.dia_semana - b.dia_semana)
                .map((x) => DIAS_CURTOS[x.dia_semana])
                .join(', ')}
            </td>
            <td className="px-3.5 py-3">
              <StatusTreino publicado={r.publicado} />
            </td>
            <td className="w-12 px-2 py-2">
              <MenuAcoes
                nome={r.nome}
                acoes={[
                  { nome: t.editar, aoEscolher: () => setAberta({ tipo: 'editar', r }) },
                  {
                    nome: r.publicado ? t.rascunho : t.publicar,
                    aoEscolher: () =>
                      mudar.mutate({ tabela: 'rotinas', id: r.id, publicado: !r.publicado }),
                  },
                  {
                    nome: t.remover,
                    perigo: true,
                    aoEscolher: () => setAberta({ tipo: 'remover', r }),
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </Tabela>
      {aberta?.tipo === 'editar' && <RotinaJanela rotina={aberta.r} aoFechar={fechar} />}
      {aberta?.tipo === 'remover' && (
        <Confirmar
          nome={aberta.r.nome}
          aoConfirmar={() => remover.mutateAsync(aberta.r.id)}
          aoFechar={fechar}
        />
      )}
    </>
  )
}
