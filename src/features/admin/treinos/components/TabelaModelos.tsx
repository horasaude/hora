import { useState } from 'react'
import { DIAS_CURTOS, OBJETIVOS, nivelLocal } from '@/domain/treinos'
import { Tabela } from '../../components/Tabela'
import { Confirmar } from '../../plano/components/Confirmar'
import { MenuAcoes } from '../../plano/components/MenuAcoes'
import { publicar, removerRotina, type Rotina } from '../api/treinos.api'
import { useAcaoTreinos } from '../hooks/useTreinosPainel'
import { t } from '../textos'
import { StatusTreino } from './Etiquetas'
import { RotinaJanela } from './RotinaJanela'

/** Dias com musculação (ou quantos na ordem) e quantos aeróbicos o tipo de treino tem. */
function DiasDoModelo({ r }: { r: Rotina }) {
  const musculacao = r.dias.filter((x) => x.categoria !== 'aerobico')
  const aerobicos = r.dias.length - musculacao.length
  const dias =
    r.tipo === 'numerico'
      ? t.treinosN(musculacao.length)
      : [...new Set(musculacao.flatMap((x) => (x.dia_semana === null ? [] : [x.dia_semana])))]
          .sort((a, b) => a - b)
          .map((x) => DIAS_CURTOS[x])
          .join(', ')
  return (
    <>
      {dias}
      {aerobicos > 0 && (
        <span className="ml-2 text-[11px] font-bold text-coral">
          {t.aerobicos.aerobicosN(aerobicos)}
        </span>
      )}
    </>
  )
}

type Aberta = { tipo: 'editar' | 'remover'; r: Rotina } | null

/** Tipos de treino de um tema: objetivo, nível e local, treinos, status e ações. */
export function TabelaModelos({ rotinas }: { rotinas: Rotina[] }) {
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
            <td className="px-3.5 py-3">
              {r.objetivo ? OBJETIVOS[r.objetivo as keyof typeof OBJETIVOS] : '-'}
            </td>
            <td className="px-3.5 py-3">{nivelLocal(r.nivel, r.local)}</td>
            <td className="px-3.5 py-3">
              <DiasDoModelo r={r} />
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
