import { useState } from 'react'
import { BotaoBrilho } from '@/components/ui'
import { useConfiguracoes, useSalvarConfiguracoes } from '../../hooks/useModulos'
import { t } from '../textos'

/** Meta de água por dia (ml) que as alunas vão somando copo a copo; bater a meta dá os pontos de Água. */
export function MetaAgua() {
  const config = useConfiguracoes().data
  const salvar = useSalvarConfiguracoes()
  const [valor, setValor] = useState<string | null>(null)
  const atual = valor ?? String(config?.agua_meta_ml ?? '')
  const ml = Number(atual)
  const valido = Number.isInteger(ml) && ml >= 500 && ml <= 6000
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-[#EEF6FC] p-4">
      <label className="flex flex-col gap-1 text-sm font-bold text-tinta">
        {t.agua.rotulo}
        <span className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={500}
            max={6000}
            step={50}
            value={atual}
            onChange={(e) => setValor(e.target.value)}
            className="min-h-10 w-32 rounded-xl border border-linha bg-white px-3 font-normal focus:border-ora focus:outline-none"
          />
          <span className="font-normal text-suave">ml</span>
        </span>
      </label>
      <BotaoBrilho
        tom="verde"
        disabled={!valido || salvar.isPending || ml === config?.agua_meta_ml}
        onClick={() => salvar.mutate({ agua_meta_ml: ml }, { onSuccess: () => setValor(null) })}
      >
        {salvar.isPending ? t.agua.salvando : t.agua.salvar}
      </BotaoBrilho>
      <p className="w-full text-xs text-suave">{valido ? t.agua.ajuda : t.agua.invalido}</p>
      {salvar.isError && <p className="w-full text-xs text-terracota-escuro">{t.agua.erro}</p>}
    </div>
  )
}
