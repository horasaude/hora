import type { ReactNode } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Campo } from '@/components/ui'
import { LOCAIS, NIVEIS } from '@/domain/treinos'
import type { Tema } from '../../api/conteudo.api'
import { CampoArea } from '../../components/CampoArea'
import { t } from '../textos'

export type EntradaTreino = {
  nome: string
  tema_id: string
  nivel: string
  local: string
  duracao: string
  descricao: string
  aquecimento: string
  alongamento: string
  orientacoes: string
}

const caixa =
  'min-h-12 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none'

function Escolha({
  id,
  rotulo,
  erro,
  children,
}: {
  id: string
  rotulo: string
  erro?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="font-medium">
        {rotulo}
      </label>
      {children}
      {erro && <span className="text-terracota-escuro">{erro}</span>}
    </div>
  )
}

type Props = {
  register: UseFormRegister<EntradaTreino>
  erros: FieldErrors<EntradaTreino>
  temas: Tema[]
}

/** Nome, tema, nível, local, duração e descrição do treino. */
export function CamposTreino({ register, erros, temas }: Props) {
  return (
    <>
      <div className="sm:col-span-2">
        <Campo
          id="treino-nome"
          rotulo={t.campos.nomeTreino}
          erro={erros.nome?.message}
          {...register('nome')}
        />
      </div>
      <Escolha id="treino-tema" rotulo={t.campos.tema} erro={erros.tema_id?.message}>
        <select id="treino-tema" className={caixa} {...register('tema_id')}>
          <option value="">{t.erros.tema}</option>
          {temas.map((x) => (
            <option key={x.id} value={x.id}>
              {x.titulo}
            </option>
          ))}
        </select>
      </Escolha>
      <Campo
        id="treino-duracao"
        rotulo={t.campos.duracao}
        type="number"
        inputMode="numeric"
        min={1}
        erro={erros.duracao?.message}
        {...register('duracao')}
      />
      <Escolha id="treino-nivel" rotulo={t.campos.nivel}>
        <select id="treino-nivel" className={caixa} {...register('nivel')}>
          {Object.entries(NIVEIS).map(([v, n]) => (
            <option key={v} value={v}>
              {n}
            </option>
          ))}
        </select>
      </Escolha>
      <Escolha id="treino-local" rotulo={t.campos.local}>
        <select id="treino-local" className={caixa} {...register('local')}>
          {Object.entries(LOCAIS).map(([v, n]) => (
            <option key={v} value={v}>
              {n}
            </option>
          ))}
        </select>
      </Escolha>
      <div className="sm:col-span-2">
        <CampoArea
          id="treino-descricao"
          rotulo={t.campos.descricao}
          rows={2}
          {...register('descricao')}
        />
      </div>
    </>
  )
}

/** Aquecimento ou alongamento: bloco separado, opcional, no começo ou no fim. */
export function BlocoOpcional({
  id,
  rotulo,
  ...reg
}: { id: string; rotulo: string } & ReturnType<UseFormRegister<EntradaTreino>>) {
  return (
    <div className="rounded-2xl border border-dashed border-[#F2C4B3] bg-[#FFF8F5] p-3 sm:col-span-2">
      <CampoArea id={id} rotulo={rotulo} rows={2} {...reg} />
    </div>
  )
}
