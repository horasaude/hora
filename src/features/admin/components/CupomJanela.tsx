import { useState } from 'react'
import { Campo } from '@/components/ui'
import { useSalvarCupom } from '../hooks/useCupons'
import {
  deCupom,
  errosCupom,
  formVazio,
  paraLinha,
  type CupomLinha,
  type FormCupom,
} from '../schemas/cupomForm'
import { cupons as t } from '../textos/cupons'
import { CamposDesconto, CamposLimites, CamposPlanos } from './CupomCampos'
import { JanelaSalvar } from './FormsConfiguracao'

type Props = { cupom: CupomLinha | null; codigos: string[]; aoFechar: () => void }

/** Criar ou editar cupom: código, desconto, formas de pagamento, limite, prazo e ligado. */
export function CupomJanela({ cupom, codigos, aoFechar }: Props) {
  const salvar = useSalvarCupom()
  const [f, setF] = useState<FormCupom>(() => (cupom ? deCupom(cupom) : formVazio()))
  const [tentou, setTentou] = useState(false)
  const mudar = (parte: Partial<FormCupom>) => setF((x) => ({ ...x, ...parte }))
  const erros = errosCupom(f)
  if (codigos.includes(f.codigo) && f.codigo !== cupom?.codigo) erros.codigo = t.erros.repetido
  const valido = Object.keys(erros).length === 0
  const vistos = tentou
    ? erros
    : { codigo: erros.codigo === t.erros.repetido ? erros.codigo : undefined }
  return (
    <JanelaSalvar
      titulo={cupom ? t.editar : t.novo}
      aoFechar={aoFechar}
      valido={valido}
      aoTentar={() => setTentou(true)}
      aoSalvar={() => salvar.mutateAsync({ id: cupom?.id ?? null, linha: paraLinha(f) })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo
          rotulo={t.codigo}
          name="codigo"
          value={f.codigo}
          placeholder={t.codigoDica}
          autoCapitalize="characters"
          onChange={(e) =>
            mudar({
              codigo: e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .slice(0, 20),
            })
          }
          onBlur={() => setTentou(true)}
          erro={vistos.codigo}
        />
        <CamposPlanos f={f} erros={vistos} mudar={mudar} />
      </div>
      <CamposDesconto f={f} erros={vistos} mudar={mudar} />
      <CamposLimites f={f} erros={vistos} mudar={mudar} />
    </JanelaSalvar>
  )
}
