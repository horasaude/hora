import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router-dom'
import { BotaoBrilho, CampoSenha, LogoOra } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { buscarPapel } from '../api/auth.api'
import { useSessao } from '../hooks/useSessao'
import { linkComErro, sessaoDoLink } from '../linkDeSenha'
import { textos } from '../textos'

const t = textos.definir

function Formulario({ email }: { email: string }) {
  const navegar = useNavigate()
  const [senha, setSenha] = useState('')
  const [repetir, setRepetir] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (senha.length < 8) return setErro(t.curta)
    if (senha !== repetir) return setErro(t.diferentes)
    setSalvando(true)
    const { error } = await supabase.auth.updateUser({ password: senha })
    if (error) {
      setSalvando(false)
      return setErro(t.erro)
    }
    navegar((await buscarPapel().catch(() => null)) === 'admin' ? '/app/admin' : '/app', {
      replace: true,
    })
  }
  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <p className="text-center text-sm text-suave">{t.conta(email)}</p>
      <CampoSenha
        id="nova-senha"
        rotulo={t.nova}
        autoComplete="new-password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <CampoSenha
        id="repetir-senha"
        rotulo={t.repetir}
        autoComplete="new-password"
        value={repetir}
        onChange={(e) => setRepetir(e.target.value)}
      />
      {erro && (
        <p role="alert" className="text-sm text-terracota-escuro">
          {erro}
        </p>
      )}
      <BotaoBrilho type="submit" tamanho="lg" disabled={salvando}>
        {salvando ? t.salvando : t.salvar}
      </BotaoBrilho>
    </form>
  )
}

/** Página do link de acesso (convite ou nova senha): só vale para a conta que acabou de entrar pelo link. */
export function DefinirSenhaPage() {
  const { sessao, carregando } = useSessao()
  const [erroNoLink] = useState(() => linkComErro(window.location))
  const valida = (s: Session | null): s is Session => !erroNoLink && sessaoDoLink(s)
  return (
    <main className="font-sistema mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-8 px-4 py-10">
      <header className="flex flex-col items-center gap-6 text-center">
        <LogoOra largura={160} />
        <h1 className="text-2xl font-bold text-verde-escuro">{t.titulo}</h1>
      </header>
      {carregando ? (
        <p className="text-center text-suave">{textos.carregando}</p>
      ) : valida(sessao) ? (
        <Formulario email={sessao.user.email ?? ''} />
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <p role="alert" className="text-tinta">
            {t.expirado}
          </p>
          <Link to="/entrar" className="text-sm text-suave underline underline-offset-4">
            {t.entrar}
          </Link>
        </div>
      )}
    </main>
  )
}
