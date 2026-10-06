import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { ESPECIALIDADES, type Especialidade } from '@/domain/forum'
import { RodapeForm } from '../../components/RodapeForm'
import { salvarPerfilEquipe, type PerfilEquipe } from '../api/forum.api'
import { useAcaoForumPainel } from '../hooks/useForumPainel'
import { t } from '../textos'

const p = t.perfil
const TIPOS = ['image/jpeg', 'image/png', 'image/webp']
const ehEspecialidade = (v: string): v is Especialidade => v in ESPECIALIDADES

function Foto({ arquivo, setArquivo }: { arquivo?: File; setArquivo: (f?: File) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{p.foto}</span>
      <input
        type="file"
        accept={TIPOS.join(',')}
        onChange={(e) => setArquivo(e.target.files?.[0])}
        className="text-[13px] file:mr-3 file:rounded-full file:border-0 file:bg-trilho file:px-4 file:py-2 file:font-bold"
      />
      {arquivo && <span className="text-xs text-suave">{arquivo.name}</span>}
    </label>
  )
}

function CampoEspecialidade({
  valor,
  mudar,
}: {
  valor: Especialidade | null
  mudar: (e: Especialidade | null) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{p.especialidade}</span>
      <select
        className="min-h-12 rounded-xl border border-linha bg-white px-4"
        value={valor ?? ''}
        onChange={(e) => mudar(ehEspecialidade(e.target.value) ? e.target.value : null)}
      >
        <option value="">{p.nenhuma}</option>
        {Object.entries(ESPECIALIDADES).map(([k, n]) => (
          <option key={k} value={k}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}

/** Nome, especialidade, título e foto que aparecem nas respostas; a especialidade guia o Para mim. */
export function PerfilEquipeJanela({
  perfil,
  aoFechar,
}: {
  perfil: PerfilEquipe
  aoFechar: () => void
}) {
  const id = useId()
  const [v, setV] = useState(perfil)
  const [arquivo, setArquivo] = useState<File>()
  const [erro, setErro] = useState('')
  const salvar = useAcaoForumPainel(salvarPerfilEquipe)
  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!v.nome.trim()) return setErro(p.erroNome)
    if (arquivo && (!TIPOS.includes(arquivo.type) || arquivo.size > 3_000_000))
      return setErro(p.erroFoto)
    salvar.mutate(
      { ...v, nome: v.nome.trim(), arquivo },
      { onSuccess: aoFechar, onError: () => setErro(t.erro) },
    )
  }
  return (
    <Janela
      titulo={p.titulo}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={<RodapeForm formId={id} salvando={salvar.isPending} aoCancelar={aoFechar} />}
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        <Campo
          rotulo={p.nome}
          maxLength={120}
          value={v.nome}
          onChange={(e) => setV({ ...v, nome: e.target.value })}
        />
        <Campo
          rotulo={p.tituloProf}
          maxLength={80}
          value={v.titulo_profissional ?? ''}
          onChange={(e) => setV({ ...v, titulo_profissional: e.target.value })}
        />
        <CampoEspecialidade
          valor={v.especialidade}
          mudar={(e) => setV({ ...v, especialidade: e })}
        />
        <Foto arquivo={arquivo} setArquivo={setArquivo} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
