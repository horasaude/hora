import { useId, useState } from 'react'
import { Campo, Janela } from '@/components/ui'
import { ESPECIALIDADES, type Especialidade } from '@/domain/forum'
import { RodapeForm } from '../../components/RodapeForm'
import {
  convidarProfissional,
  editarProfissional,
  ErroEquipe,
  type Profissional,
} from '../api/equipe.api'
import { useAcaoEquipe } from '../hooks/useEquipe'
import { t } from '../textos'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ehEsp = (v: string): v is Especialidade => v in ESPECIALIDADES
type Valores = { nome: string; email: string; especialidade: Especialidade | null; titulo: string }

function CampoEspecialidade({ v, mudar }: { v: Valores; mudar: (p: Partial<Valores>) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{t.campos.especialidade}</span>
      <select
        className="min-h-12 rounded-xl border border-linha bg-white px-4"
        value={v.especialidade ?? ''}
        onChange={(e) => mudar({ especialidade: ehEsp(e.target.value) ? e.target.value : null })}
      >
        <option value="">{t.campos.nenhuma}</option>
        {Object.entries(ESPECIALIDADES).map(([k, n]) => (
          <option key={k} value={k}>
            {n}
          </option>
        ))}
      </select>
    </label>
  )
}

function Campos({
  v,
  mudar,
  comEmail,
}: {
  v: Valores
  mudar: (p: Partial<Valores>) => void
  comEmail: boolean
}) {
  return (
    <>
      <Campo
        rotulo={t.campos.nome}
        maxLength={120}
        value={v.nome}
        onChange={(e) => mudar({ nome: e.target.value })}
      />
      {comEmail && (
        <Campo
          rotulo={t.campos.email}
          type="email"
          value={v.email}
          onChange={(e) => mudar({ email: e.target.value })}
        />
      )}
      <CampoEspecialidade v={v} mudar={mudar} />
      <Campo
        rotulo={t.campos.titulo}
        maxLength={80}
        value={v.titulo}
        onChange={(e) => mudar({ titulo: e.target.value })}
      />
    </>
  )
}

const mensagem = (e: unknown) => {
  const c = e instanceof ErroEquipe ? e.message : 'falha'
  return c === 'ja_existe' ? t.erros.ja_existe : t.erros.falha
}

/** Convidar (com e-mail) ou editar profissional. Ao convidar, devolve o link para enviar. */
export function ProfissionalJanela({
  p,
  aoFechar,
  aoConvidar,
}: {
  p: Profissional | null
  aoFechar: () => void
  aoConvidar: (nome: string, link: string) => void
}) {
  const id = useId()
  const [v, setV] = useState<Valores>({
    nome: p?.nome ?? '',
    email: '',
    especialidade: p?.especialidade && ehEsp(p.especialidade) ? p.especialidade : null,
    titulo: p?.titulo_profissional ?? '',
  })
  const [erro, setErro] = useState('')
  const convidar = useAcaoEquipe(convidarProfissional)
  const editar = useAcaoEquipe(editarProfissional)
  const mudar = (x: Partial<Valores>) => setV((a) => ({ ...a, ...x }))
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!v.nome.trim()) return setErro(t.erros.nome)
    if (!p && !EMAIL.test(v.email.trim())) return setErro(t.erros.email)
    const dados = { nome: v.nome.trim(), especialidade: v.especialidade, titulo: v.titulo.trim() }
    try {
      if (p) {
        await editar.mutateAsync({ ...dados, perfil: p.id })
        aoFechar()
      } else aoConvidar(dados.nome, await convidar.mutateAsync({ ...dados, email: v.email.trim() }))
    } catch (err) {
      setErro(mensagem(err))
    }
  }
  return (
    <Janela
      titulo={p ? `${t.editar}: ${p.nome}` : t.convidar}
      aoFechar={aoFechar}
      rotuloFechar={t.fechar}
      rodape={
        <RodapeForm
          formId={id}
          salvando={convidar.isPending || editar.isPending}
          aoCancelar={aoFechar}
        />
      }
    >
      <form id={id} onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
        <Campos v={v} mudar={mudar} comEmail={!p} />
        {erro && (
          <p role="alert" className="text-sm text-terracota-escuro sm:col-span-2">
            {erro}
          </p>
        )}
      </form>
    </Janela>
  )
}
