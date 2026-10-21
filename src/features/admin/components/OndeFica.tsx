import type { UseFormRegister } from 'react-hook-form'
import type { Tema } from '../api/conteudo.api'
import { textos } from '../textos'
import type { EntradaAula } from './FormAula'

const c = textos.conteudo
const campo =
  'min-h-12 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none'

type Props = { temas: Tema[]; register: UseFormRegister<EntradaAula>; erro?: string }

/** "Onde fica a aula": o tema (as aulas abrem junto com ele para a aluna). */
export function OndeFica({ temas, register, erro }: Props) {
  return (
    <div className="flex flex-col gap-1 text-sm sm:col-span-2">
      <label htmlFor="aula-tema" className="font-medium">
        {c.campoTema}
      </label>
      <select id="aula-tema" className={campo} {...register('tema')}>
        <option value="">{c.escolhaTema}</option>
        {temas.map((t) => (
          <option key={t.id} value={t.id}>
            {t.titulo}
          </option>
        ))}
      </select>
      {erro && <span className="text-terracota-escuro">{erro}</span>}
    </div>
  )
}
