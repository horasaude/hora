import { useState } from 'react'
import { Cartao } from '@/components/ui'
import { diaEmBrasilia } from '@/lib/datas'
import { DIAS_CURTOS } from '@/domain/treinos'
import { useFeitosDoMes } from '../hooks/useTreinos'
import { textos } from '../textos'

const t = textos.historico

/** Minha evolução: os treinos do mês num calendário pequeno, com ponto coral nos dias de treino. */
export function TreinosFeitos() {
  const feitos = useFeitosDoMes()
  const [hoje] = useState(() => diaEmBrasilia(new Date()))
  const [ano, mes] = hoje.split('-').map(Number) as [number, number]
  const primeiro = new Date(Date.UTC(ano, mes - 1, 1)).getUTCDay()
  const dias = new Date(Date.UTC(ano, mes, 0)).getUTCDate()
  const comTreino = new Set((feitos.data ?? []).map((f) => f.data))
  const vazios = Array.from({ length: primeiro }, (_, i) => <li key={`v${i}`} aria-hidden />)
  return (
    <Cartao className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[19px] font-bold text-verde-escuro">{t.titulo}</h2>
        <span className="text-[13px] text-suave">{t.mes(comTreino.size)}</span>
      </div>
      <ul className="grid grid-cols-7 gap-1 text-center text-[11px] text-suave">
        {DIAS_CURTOS.map((d) => (
          <li key={d} className="font-bold">
            {d.slice(0, 1)}
          </li>
        ))}
        {vazios}
        {Array.from({ length: dias }, (_, i) => {
          const data = `${hoje.slice(0, 8)}${String(i + 1).padStart(2, '0')}`
          const treinou = comTreino.has(data)
          return (
            <li key={data} className="flex flex-col items-center gap-0.5 py-1">
              <span className={data === hoje ? 'font-bold text-verde-escuro' : ''}>{i + 1}</span>
              <span
                aria-label={treinou ? t.titulo : undefined}
                className={`size-1.5 rounded-full ${treinou ? 'bg-coral' : 'bg-transparent'}`}
              />
            </li>
          )
        })}
      </ul>
      {comTreino.size === 0 && <p className="text-[13px] text-suave">{t.vazio}</p>}
    </Cartao>
  )
}
