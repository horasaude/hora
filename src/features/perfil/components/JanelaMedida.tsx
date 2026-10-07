import { useState } from 'react'
import { AvisoErro, EscolherFoto, Janela, RodapeSalvar } from '@/components/ui'
import type { CampoMedida } from '../api/medidas.api'
import { useRegistrarMedida } from '../hooks/usePerfil'
import { esquemaMedida } from '../schemas/medida.schema'
import { textos } from '../textos'
import { CamposMedida } from './CamposMedida'

const t = textos.evolucao
const VAZIO = { peso: '', cintura: '', quadril: '', braco: '', coxa: '' }

/** Novo registro: data, peso, cintura, quadril, braço, coxa e foto opcional (comprimida). */
export function JanelaMedida({ hoje, aoFechar }: { hoje: string; aoFechar: () => void }) {
  const registrar = useRegistrarMedida()
  const [dia, setDia] = useState(hoje)
  const [valores, setValores] = useState<Record<CampoMedida, string>>(VAZIO)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const salvar = () => {
    const r = esquemaMedida(hoje).safeParse({ dia, ...valores, arquivo })
    if (!r.success) return setAviso(r.error.issues[0]?.message ?? t.peloMenosUm)
    setAviso(null)
    registrar.mutate(r.data, { onSuccess: aoFechar })
  }
  return (
    <Janela
      titulo={t.janela}
      aoFechar={aoFechar}
      rodape={
        <RodapeSalvar
          aoCancelar={aoFechar}
          aoSalvar={salvar}
          salvando={registrar.isPending}
          textos={textos}
        />
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CamposMedida
          hoje={hoje}
          dia={dia}
          setDia={setDia}
          valores={valores}
          setValor={(c, v) => setValores((x) => ({ ...x, [c]: v }))}
        />
        <div className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-bold">{t.foto}</span>
          <EscolherFoto
            rotulo={arquivo ? t.trocarFoto : t.escolherFoto}
            escolhida={Boolean(arquivo)}
            aoEscolher={setArquivo}
          />
          {arquivo && <span className="text-[13px] text-suave">{arquivo.name}</span>}
          <span className="text-[13px] text-suave">{t.privado}</span>
        </div>
      </div>
      <AvisoErro texto={aviso ?? (registrar.isError ? textos.erroSalvar : null)} />
    </Janela>
  )
}
