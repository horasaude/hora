import { useId, useState } from 'react'
import { Janela } from '@/components/ui'
import { ErroForm, RodapeForm } from '../../components/RodapeForm'
import {
  cadastrarProfissional,
  editarProfissional,
  ErroEquipe,
  type Profissional,
} from '../api/equipe.api'
import { useAcaoEquipe } from '../hooks/useEquipe'
import { t } from '../textos'
import { Campos } from './CamposProfissional'
import { EMAIL, ehEsp, type Valores } from './valoresProfissional'

/** Erro de validação do formulário, ou null quando está tudo certo. */
function validar(v: Valores, novo: boolean): string | null {
  if (!v.nome.trim()) return t.erros.nome
  if (novo && !EMAIL.test(v.email.trim())) return t.erros.email
  if (novo && (v.senha.length < 8 || v.senha.length > 72)) return t.erros.senha
  return null
}

const mensagem = (e: unknown) => {
  const c = e instanceof ErroEquipe ? e.message : 'falha'
  return c === 'ja_existe' ? t.erros.ja_existe : t.erros.falha
}

/** Adicionar (com e-mail e senha) ou editar profissional. Ao adicionar, a conta já entra com a senha. */
export function ProfissionalJanela({
  p,
  aoFechar,
  aoCadastrar,
}: {
  p: Profissional | null
  aoFechar: () => void
  aoCadastrar: (nome: string, email: string) => void
}) {
  const id = useId()
  const [v, setV] = useState<Valores>({
    nome: p?.nome ?? '',
    email: '',
    senha: '',
    especialidade: p?.especialidade && ehEsp(p.especialidade) ? p.especialidade : null,
    titulo: p?.titulo_profissional ?? '',
  })
  const [erro, setErro] = useState('')
  const convidar = useAcaoEquipe(cadastrarProfissional)
  const editar = useAcaoEquipe(editarProfissional)
  const mudar = (x: Partial<Valores>) => setV((a) => ({ ...a, ...x }))
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    const invalido = validar(v, !p)
    if (invalido) return setErro(invalido)
    const dados = { nome: v.nome.trim(), especialidade: v.especialidade, titulo: v.titulo.trim() }
    try {
      if (p) {
        await editar.mutateAsync({ ...dados, perfil: p.id })
        aoFechar()
      } else {
        const email = v.email.trim().toLowerCase()
        await convidar.mutateAsync({ ...dados, email, senha: v.senha })
        aoCadastrar(dados.nome, email)
      }
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
        {erro && <ErroForm mensagem={erro} />}
      </form>
    </Janela>
  )
}
