import { useId, useState } from 'react'
import { AvisoErro, EscolherFoto, Janela, RodapeSalvar } from '@/components/ui'
import { useSalvarPerfil } from '../hooks/usePerfil'
import { esquemaApelido } from '../schemas/perfil.schema'
import { textos } from '../textos'
import { Avatar } from './Topo'

const t = textos.config

type Props = { nome: string; apelido: string; avatar: string | null; aoFechar: () => void }

/** Editar apelido e foto de perfil (foto comprimida, só ela e as profissionais veem). */
export function JanelaEditar({ nome, apelido, avatar, aoFechar }: Props) {
  const id = useId()
  const salvar = useSalvarPerfil()
  const [valor, setValor] = useState(apelido)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const enviar = () => {
    const r = esquemaApelido.safeParse(valor)
    if (!r.success) return setAviso(r.error.issues[0]?.message ?? textos.erroSalvar)
    setAviso(null)
    salvar.mutate({ apelido: r.data, arquivo }, { onSuccess: aoFechar })
  }
  return (
    <Janela
      titulo={t.janela}
      aoFechar={aoFechar}
      rodape={
        <RodapeSalvar
          aoCancelar={aoFechar}
          aoSalvar={enviar}
          salvando={salvar.isPending}
          textos={textos}
        />
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor={`${id}-apelido`} className="font-bold">
            {t.apelido}
          </label>
          <input
            id={`${id}-apelido`}
            value={valor}
            maxLength={20}
            onChange={(e) => setValor(e.target.value)}
            className="min-h-11 rounded-xl border border-linha bg-white px-4 focus:border-ora focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Avatar nome={nome} caminho={avatar} tamanho="size-14" />
          <div className="flex flex-col gap-1">
            <span className="font-bold">{t.foto}</span>
            <EscolherFoto
              rotulo={arquivo ? textos.evolucao.trocarFoto : textos.evolucao.escolherFoto}
              escolhida={Boolean(arquivo)}
              aoEscolher={setArquivo}
              camera={false}
              tom="cinza"
            />
            {arquivo && <span className="text-[13px] text-suave">{arquivo.name}</span>}
          </div>
        </div>
      </div>
      <AvisoErro texto={aviso ?? (salvar.isError ? textos.erroSalvar : null)} />
    </Janela>
  )
}
