import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { diaMesDeData } from '@/lib/datas'
import { CAMPOS_MEDIDA, type Medida } from '../api/medidas.api'
import { useApagarMedida } from '../hooks/useMedidas'
import { textos } from '../textos'

const t = textos.evolucao

/** Registros do mais novo ao mais antigo, com as medidas, a foto e Apagar (com confirmação). */
export function ListaMedidas({ medidas }: { medidas: Medida[] }) {
  const apagar = useApagarMedida()
  const [confirmar, setConfirmar] = useState<string | null>(null)
  return (
    <ul className="flex flex-col divide-y divide-linha">
      {medidas.map((m) => {
        const data = diaMesDeData(m.dia)
        return (
          <li key={m.id} className="flex items-center gap-3 py-3">
            {m.foto ? (
              <img
                src={m.foto}
                alt={t.fotoDoDia(data)}
                className="size-12 shrink-0 rounded-xl object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-tinta">{data}</p>
              <p className="text-[13px] text-suave">
                {CAMPOS_MEDIDA.filter((c) => m[c] !== null)
                  .map(
                    (c) =>
                      `${textos.campos[c].nome} ${m[c]?.toLocaleString('pt-BR')} ${textos.campos[c].unidade}`,
                  )
                  .join(' · ')}
              </p>
            </div>
            {confirmar === m.id ? (
              <span className="flex flex-wrap justify-end gap-1.5">
                <span className="sr-only">{t.confirmar}</span>
                <BotaoBrilho
                  tom="coral"
                  tamanho="sm"
                  disabled={apagar.isPending}
                  onClick={() => apagar.mutate(m, { onSettled: () => setConfirmar(null) })}
                >
                  {t.sim}
                </BotaoBrilho>
                <BotaoBrilho tom="cinza" tamanho="sm" onClick={() => setConfirmar(null)}>
                  {t.nao}
                </BotaoBrilho>
              </span>
            ) : (
              <BotaoBrilho
                tom="cinza"
                tamanho="sm"
                aria-label={t.apagarRotulo(data)}
                onClick={() => setConfirmar(m.id)}
              >
                {t.apagar}
              </BotaoBrilho>
            )}
          </li>
        )
      })}
    </ul>
  )
}
