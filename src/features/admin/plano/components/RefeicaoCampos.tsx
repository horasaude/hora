import { useId } from 'react'
import { BotaoBrilho, Campo } from '@/components/ui'
import { totalItens } from '@/domain/nutricao'
import type { TipoRefeicao } from '../api/cardapios.api'
import { textos, TIPOS_REFEICAO } from '../textos'
import { tRefeicoes as t } from '../textos2'
import { CampoArea } from '../../components/CampoArea'
import { ItensEditor } from './ItensEditor'
import type { Rascunho } from './RefeicaoJanela'

type Mudar = (p: Partial<Rascunho>) => void

/** Descrição (da lista ou digitada), tipo no modelo e horário sugerido. */
export function CamposTopo({
  r,
  mudar,
  semHorario,
  erroNome,
}: {
  r: Rascunho
  mudar: Mudar
  semHorario?: boolean
  erroNome: boolean
}) {
  const id = useId()
  const colunas = 1 + (r.tipo !== undefined ? 1 : 0) + (semHorario ? 0 : 1)
  return (
    <div
      className={`grid gap-4 ${colunas === 3 ? 'sm:grid-cols-3' : colunas === 2 ? 'sm:grid-cols-2' : ''}`}
    >
      <Campo
        rotulo={t.campoDescricao}
        list={`${id}-nomes`}
        value={r.nome}
        onChange={(e) => mudar({ nome: e.target.value })}
        erro={erroNome ? t.campoDescricao : undefined}
      />
      <datalist id={`${id}-nomes`}>
        {Object.values(TIPOS_REFEICAO).map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      {r.tipo !== undefined && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">{t.campoTipo}</span>
          <select
            className="min-h-12 rounded-xl border border-linha bg-white px-4"
            value={r.tipo}
            onChange={(e) => mudar({ tipo: e.target.value as TipoRefeicao })}
          >
            {Object.entries(TIPOS_REFEICAO).map(([v, n]) => (
              <option key={v} value={v}>
                {n}
              </option>
            ))}
          </select>
        </label>
      )}
      {!semHorario && (
        <Campo
          rotulo={t.campoHorario}
          type="time"
          value={r.horario}
          onChange={(e) => mudar({ horario: e.target.value })}
        />
      )}
    </div>
  )
}

/** Alimentos (com total) ou texto livre, e a observação. */
export function CamposConteudo({
  r,
  mudar,
  textoLivre,
}: {
  r: Rascunho
  mudar: Mudar
  textoLivre?: boolean
}) {
  return (
    <>
      {textoLivre ? (
        <CampoArea
          rotulo={t.texto}
          rows={6}
          value={r.texto}
          onChange={(e) => mudar({ texto: e.target.value })}
        />
      ) : (
        <section className="flex flex-col gap-2">
          <h3 className="flex items-center justify-between text-[13px] font-bold text-verde-escuro">
            {t.alimentos}
            <span className="text-suave">{textos.kcal(totalItens(r.itens).kcal)}</span>
          </h3>
          <ItensEditor itens={r.itens} aoMudar={(itens) => mudar({ itens })} />
        </section>
      )}
      <CampoArea
        rotulo={t.observacao}
        rows={2}
        value={r.observacao}
        onChange={(e) => mudar({ observacao: e.target.value })}
      />
    </>
  )
}

/** Cancelar, Salvar e continuar, Salvar e fechar. */
export function RodapeRefeicao({
  salvo,
  ocupado,
  aoCancelar,
  aoSalvar,
}: {
  salvo: boolean
  ocupado: boolean
  aoCancelar: () => void
  aoSalvar: (fechar: boolean) => void
}) {
  return (
    <>
      {salvo && (
        <span role="status" className="mr-auto self-center text-sm text-ora">
          {textos.salvo}
        </span>
      )}
      <BotaoBrilho tom="cinza" onClick={aoCancelar}>
        {textos.cancelar}
      </BotaoBrilho>
      <BotaoBrilho tom="cinza" disabled={ocupado} onClick={() => aoSalvar(false)}>
        {t.salvarContinuar}
      </BotaoBrilho>
      <BotaoBrilho disabled={ocupado} onClick={() => aoSalvar(true)}>
        {t.salvarFechar}
      </BotaoBrilho>
    </>
  )
}
